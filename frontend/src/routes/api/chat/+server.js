import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const SYSTEM_PROMPT = `Anda adalah "Isabelle", Concierge AI eksklusif dari Grand Maison, hotel mewah bergaya Victorian dan Baroque berdiri sejak 1887 di Jakarta.

Kepribadian Anda:
- Elegan, sopan, dan profesional namun hangat
- Berbicara dengan Bahasa Indonesia yang indah dan formal
- Sesekali menyapa tamu dengan "Tuan" atau "Nyonya" jika konteksnya sesuai
- Tidak pernah membicarakan hal di luar konteks hotel dan perhotelan

Kamar yang tersedia:
| Tipe               | Harga/malam     | Luas  | Maks Tamu | Unggulan                        |
|--------------------|-----------------|-------|-----------|---------------------------------|
| Superior Klasik    | Rp 1.750.000    | 32 m2 | 2         | Rain shower, city view, sarapan |
| Deluxe Victoria    | Rp 2.850.000    | 45 m2 | 2         | Bathtub antik, balkon, butler   |
| Premier Mezzanine  | Rp 3.900.000    | 60 m2 | 2         | Mezzanine, soaking tub, minibar |
| Suite Baroque Grand| Rp 5.500.000    | 90 m2 | 4         | Living room, marble bath, 24/7 butler, champagne |

Fasilitas Hotel:
- Grand Dining (restoran fine dining Perancis-Jawa)
- Royal Spa (perawatan tradisional & modern)
- Ballroom Baroque (kapasitas 500 tamu)
- Perpustakaan dengan koleksi buku antik
- Kolam Renang Victoria (outdoor, marmer klasik)
- Concierge 24/7

Info Penting:
- Alamat: Jl. Merdeka Raya No. 1, Jakarta Pusat 10110
- Telepon: +62 21 1234 5678
- Check-in: 14.00 WIB | Check-out: 12.00 WIB
- Early check-in & late check-out tersedia (surcharge berlaku)

Tugas utama Anda:
1. Sambut tamu dengan hangat
2. Bantu pilih kamar sesuai kebutuhan, jumlah tamu, dan anggaran
3. Jelaskan fasilitas secara detail jika ditanya
4. Hitung total harga (harga kamar x jumlah malam + pajak 11%)
5. Arahkan ke halaman /booking untuk menyelesaikan reservasi
6. Jawab FAQ seputar hotel

Jika tamu meminta rekomendasi, tanyakan: tujuan kunjungan, jumlah tamu, dan anggaran. Kemudian berikan 1-2 rekomendasi terbaik dengan alasan yang jelas.

Selalu akhiri respons dengan pertanyaan atau ajakan yang mendorong tamu melanjutkan percakapan atau menuju halaman booking.`;

const tools = [
	{
		name: 'calculate_price',
		description: 'Hitung total harga menginap berdasarkan tipe kamar dan jumlah malam',
		input_schema: {
			type: 'object',
			properties: {
				room_type: {
					type: 'string',
					enum: ['superior', 'deluxe', 'premier', 'suite'],
					description: 'Tipe kamar yang dipilih'
				},
				nights: {
					type: 'number',
					description: 'Jumlah malam menginap'
				},
				guests: {
					type: 'number',
					description: 'Jumlah tamu'
				}
			},
			required: ['room_type', 'nights']
		}
	},
	{
		name: 'get_room_detail',
		description: 'Ambil detail lengkap sebuah tipe kamar',
		input_schema: {
			type: 'object',
			properties: {
				room_type: {
					type: 'string',
					enum: ['superior', 'deluxe', 'premier', 'suite']
				}
			},
			required: ['room_type']
		}
	},
	{
		name: 'create_booking_link',
		description:
			'Buat link booking dengan parameter yang sudah terisi otomatis untuk memudahkan tamu',
		input_schema: {
			type: 'object',
			properties: {
				room_type: { type: 'string' },
				check_in: { type: 'string', description: 'Format YYYY-MM-DD' },
				check_out: { type: 'string', description: 'Format YYYY-MM-DD' },
				guests: { type: 'number' }
			},
			required: ['room_type']
		}
	}
];

/**
 * @param {string} toolName
 * @param {any} toolInput
 */
function processTool(toolName, toolInput) {
	/** @type {{ [key: string]: { name: string; price: number; size: string; maxGuests: number } }} */
	const rooms = {
		superior: { name: 'Superior Klasik', price: 1750000, size: '32 m2', maxGuests: 2 },
		deluxe: { name: 'Deluxe Victoria', price: 2850000, size: '45 m2', maxGuests: 2 },
		premier: { name: 'Premier Mezzanine', price: 3900000, size: '60 m2', maxGuests: 2 },
		suite: { name: 'Suite Baroque Grand', price: 5500000, size: '90 m2', maxGuests: 4 }
	};

	if (toolName === 'calculate_price') {
		const room = rooms[String(toolInput.room_type)];
		if (!room) return { error: 'room_type tidak valid' };
		const nights = toolInput.nights || 1;
		const subtotal = room.price * nights;
		const tax = Math.round(subtotal * 0.11);
		const total = subtotal + tax;
		const fmt = (/** @type {number} */ n) =>
			new Intl.NumberFormat('id-ID', {
				style: 'currency',
				currency: 'IDR',
				minimumFractionDigits: 0
			}).format(n);
		return {
			room: room.name,
			nights,
			price_per_night: fmt(room.price),
			subtotal: fmt(subtotal),
			tax_11pct: fmt(tax),
			grand_total: fmt(total)
		};
	}

	if (toolName === 'get_room_detail') {
		const room = rooms[String(toolInput.room_type)];
		if (!room) return { error: 'room_type tidak valid' };
		/** @type {{ [key: string]: string[] }} */
		const features = {
			superior: ['Queen Bed', 'Rain Shower', 'City View', 'Sarapan Inklusif', 'WiFi'],
			deluxe: ['King Bed', 'Bathtub Antik Clawfoot', 'Balkon Privat', 'Butler Service', 'Sarapan Inklusif'],
			premier: ['King Bed', 'Level Mezzanine', 'Soaking Tub', 'Mini Bar Premium', 'Panoramic View'],
			suite: [
				'King Bed + Sofa Bed',
				'Living Room Terpisah',
				'Marble Bathroom',
				'Butler 24/7',
				'Champagne Welcome',
				'Dining Area Privat'
			]
		};
		return { ...room, features: features[String(toolInput.room_type)] };
	}

	if (toolName === 'create_booking_link') {
		const params = new URLSearchParams();
		if (toolInput.room_type) params.set('roomType', toolInput.room_type);
		if (toolInput.check_in) params.set('checkIn', toolInput.check_in);
		if (toolInput.check_out) params.set('checkOut', toolInput.check_out);
		if (toolInput.guests) params.set('guests', toolInput.guests);
		return { booking_url: `/booking?${params.toString()}`, message: 'Link booking berhasil dibuat' };
	}

	return { error: 'Tool tidak ditemukan' };
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const apiKey = env.ANTHROPIC_API_KEY;
	if (!apiKey) {
		return json({ error: 'ANTHROPIC_API_KEY belum di-set di server.' }, { status: 500 });
	}

	try {
		const body = await request.json().catch(() => ({}));
		const messages = Array.isArray(body?.messages) ? body.messages : [];
		let currentMessages = [...messages];

		for (let i = 0; i < 5; i += 1) {
			const llmResponse = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01'
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-5',
					max_tokens: 1024,
					system: SYSTEM_PROMPT,
					tools,
					messages: currentMessages
				})
			});

			if (!llmResponse.ok) {
				const errText = await llmResponse.text();
				return json({ error: errText }, { status: 500 });
			}

			const data = await llmResponse.json();
			const contentBlocks = Array.isArray(data?.content) ? data.content : [];

			if (data.stop_reason === 'end_turn') {
				const text =
					contentBlocks.find((/** @type {{ type?: string; text?: string }} */ block) => block.type === 'text')
						?.text ?? '';
				return json({ reply: text });
			}

			if (data.stop_reason === 'tool_use') {
				const toolUseBlocks = contentBlocks.filter(
					(/** @type {{ type?: string }} */ block) => block.type === 'tool_use'
				);

				currentMessages.push({ role: 'assistant', content: contentBlocks });

				const toolResults = toolUseBlocks.map((/** @type {{ id: string; name: string; input: any }} */ block) => ({
					type: 'tool_result',
					tool_use_id: block.id,
					content: JSON.stringify(processTool(block.name, block.input))
				}));

				currentMessages.push({ role: 'user', content: toolResults });
				continue;
			}

			break;
		}

		return json({ reply: 'Maaf, terjadi kesalahan. Silakan coba lagi.' });
	} catch (error) {
		console.error('POST /api/chat error:', error);
		return json({ error: String(error) }, { status: 500 });
	}
}
