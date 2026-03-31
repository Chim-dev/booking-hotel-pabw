import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { getAuthenticatedUser } from '../lib/auth.js';
import { ApiError } from '../lib/api-error.js';
import { withTransaction } from '../lib/db.js';
import {
	differenceInDays,
	normalizeRoomLookup,
	parseIsoDate,
	toInteger,
	toNonEmptyString,
	isValidEmail
} from '../lib/validation.js';

const router = Router();
const TAX_RATE = 0.11;
const VALID_PAYMENT_METHODS = new Set(['transfer', 'card', 'cash']);

function generateBookingReference() {
	return `GM-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;
}

router.post('/', async (req, res) => {
	try {
		const body = req.body ?? {};
		const authUser = getAuthenticatedUser(req);

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
			return res
				.status(400)
				.json({ error: 'Field wajib: roomId/roomCode, checkIn, checkOut, guests.' });
		}

		if (!firstName || !lastName || !email) {
			return res.status(400).json({ error: 'Field wajib: firstName, lastName, email.' });
		}

		if (!isValidEmail(email)) {
			return res.status(400).json({ error: 'Format email tidak valid.' });
		}

		if (guests < 1 || guests > 10) {
			return res.status(400).json({ error: 'Jumlah tamu tidak valid.' });
		}

		const nights = differenceInDays(checkIn, checkOut);
		if (nights < 1) {
			return res.status(400).json({ error: 'Tanggal check-out harus setelah check-in.' });
		}

		if (!VALID_PAYMENT_METHODS.has(paymentMethod)) {
			return res
				.status(400)
				.json({ error: 'paymentMethod harus salah satu dari: transfer, card, cash.' });
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
					checkIn.toISOString().slice(0, 10),
					checkOut.toISOString().slice(0, 10),
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

		res.status(201).json({
			message: 'Booking berhasil dibuat.',
			data: payload
		});
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.status).json({ error: error.message });
		}

		if (error && typeof error === 'object' && 'code' in error) {
			if (error.code === '23P01') {
				return res
					.status(409)
					.json({ error: 'Kamar sudah dipesan pada rentang tanggal tersebut.' });
			}

			if (error.code === '23514') {
				return res.status(400).json({ error: 'Data booking tidak valid.' });
			}
		}

		console.error('POST /api/bookings error:', error);
		res.status(500).json({ error: 'Gagal membuat booking.' });
	}
});

export default router;
