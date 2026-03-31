import { randomBytes } from 'node:crypto';
import { json } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/auth';
import { ApiError } from '$lib/server/api-error';
import { withTransaction } from '$lib/server/db';
import {
	differenceInDays,
	normalizeRoomLookup,
	parseIsoDate,
	toInteger,
	toNonEmptyString,
	isValidEmail
} from '$lib/server/validation';

const TAX_RATE = 0.11;
const VALID_PAYMENT_METHODS = new Set(['transfer', 'card', 'cash']);

function generateBookingReference() {
	return `GM-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;
}

/**
 * @param {import('@sveltejs/kit').RequestEvent} event
 */
export async function POST({ request, cookies }) {
	try {
		const body = await request.json();
		const authUser = getAuthenticatedUser(cookies);

		const roomLookup = normalizeRoomLookup(body.roomId ?? body.roomCode ?? body.room_type);
		const checkIn = parseIsoDate(body.checkIn ?? body.check_in);
		const checkOut = parseIsoDate(body.checkOut ?? body.check_out);
		const guests = toInteger(body.guests);
		const firstName = toNonEmptyString(body.firstName ?? body.first_name);
		const lastName = toNonEmptyString(body.lastName ?? body.last_name);
		const email = toNonEmptyString(body.email).toLowerCase();
		const phone = toNonEmptyString(body.phone);
		const nationality = toNonEmptyString(body.nationality).toUpperCase();
		const specialRequest = toNonEmptyString(body.specialRequest ?? body.special_request);
		const paymentMethod = toNonEmptyString(body.paymentMethod ?? body.payment_method).toLowerCase();

		if (!roomLookup || !checkIn || !checkOut || !Number.isInteger(guests)) {
			return json(
				{ error: 'Field wajib: roomId/roomCode, checkIn, checkOut, guests.' },
				{ status: 400 }
			);
		}

		if (!firstName || !lastName || !email) {
			return json({ error: 'Field wajib: firstName, lastName, email.' }, { status: 400 });
		}

		if (!isValidEmail(email)) {
			return json({ error: 'Format email tidak valid.' }, { status: 400 });
		}

		if (guests < 1 || guests > 10) {
			return json({ error: 'Jumlah tamu tidak valid.' }, { status: 400 });
		}

		const nights = differenceInDays(checkIn, checkOut);
		if (nights < 1) {
			return json({ error: 'Tanggal check-out harus setelah check-in.' }, { status: 400 });
		}

		if (!VALID_PAYMENT_METHODS.has(paymentMethod)) {
			return json(
				{ error: 'paymentMethod harus salah satu dari: transfer, card, cash.' },
				{ status: 400 }
			);
		}

		const payload = await withTransaction(async (client) => {
			const roomWhereClause = roomLookup.kind === 'id' ? 'id = $1' : 'code = $1';
			const roomResult = await client.query(
				`SELECT id, code, name, price_per_night, max_guests, is_available
				 FROM rooms
				 WHERE ${roomWhereClause}
				 LIMIT 1`,
				[roomLookup.value]
			);

			const room = roomResult.rows[0];
			if (!room) {
				throw new ApiError(404, 'Kamar tidak ditemukan.');
			}

			if (!room.is_available) {
				throw new ApiError(409, 'Kamar sedang tidak tersedia.');
			}

			if (guests > room.max_guests) {
				throw new ApiError(
					400,
					`Jumlah tamu melebihi kapasitas kamar. Maksimum: ${room.max_guests}.`
				);
			}

			const subtotal = room.price_per_night * nights;
			const tax = Math.round(subtotal * TAX_RATE);
			const grandTotal = subtotal + tax;
			const bookingReference = generateBookingReference();

			const insertResult = await client.query(
				`INSERT INTO bookings (
					booking_reference,
					user_id,
					room_id,
					check_in,
					check_out,
					guests,
					first_name,
					last_name,
					email,
					phone,
					nationality,
					special_request,
					payment_method,
					subtotal,
					tax_amount,
					grand_total,
					status
				)
				VALUES (
					$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'pending'
				)
				RETURNING
					id,
					booking_reference,
					room_id,
					check_in,
					check_out,
					guests,
					status,
					subtotal,
					tax_amount,
					grand_total,
					created_at`,
				[
					bookingReference,
					authUser?.id || null,
					room.id,
					(checkIn.toISOString().slice(0, 10)),
					(checkOut.toISOString().slice(0, 10)),
					guests,
					firstName,
					lastName,
					email,
					phone || null,
					nationality || null,
					specialRequest || null,
					paymentMethod,
					subtotal,
					tax,
					grandTotal
				]
			);

			return {
				booking: insertResult.rows[0],
				room: {
					id: room.id,
					code: room.code,
					name: room.name,
					price_per_night: room.price_per_night
				}
			};
		});

		return json(
			{
				message: 'Booking berhasil dibuat.',
				data: payload
			},
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof ApiError) {
			return json({ error: error.message }, { status: error.status });
		}

		if (error && typeof error === 'object' && 'code' in error) {
			if (error.code === '23P01') {
				return json(
					{ error: 'Kamar sudah dipesan pada rentang tanggal tersebut.' },
					{ status: 409 }
				);
			}

			if (error.code === '23514') {
				return json({ error: 'Data booking tidak valid.' }, { status: 400 });
			}
		}

		console.error('POST /api/bookings error:', error);
		return json({ error: 'Gagal membuat booking.' }, { status: 500 });
	}
}
