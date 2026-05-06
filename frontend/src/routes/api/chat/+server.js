import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db';

const OLLAMA_BASE_URL = (env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
const OLLAMA_MODEL = env.OLLAMA_MODEL || 'mistral:7b';
const MAX_AGENT_STEPS = 5;
const TAX_RATE = 0.11;

const BASE_SYSTEM_PROMPT = `Anda adalah "Isabelle", Concierge AI eksklusif dari Grand Maison, hotel mewah bergaya Victorian dan Baroque berdiri sejak 1887 di Jakarta.

Kepribadian Anda:
- Elegan, sopan, dan profesional namun hangat
- Berbicara dengan Bahasa Indonesia yang indah dan formal
- Sesekali menyapa tamu dengan "Tuan" atau "Nyonya" jika konteksnya sesuai
- Tidak pernah membicarakan hal di luar konteks hotel dan perhotelan

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

const TOOL_INSTRUCTIONS = `
Tools yang tersedia:
1) list_rooms(input: { available_only?: boolean })
   - Mengembalikan daftar kamar.
2) get_room_detail(input: { room_type: string })
   - Mencari kamar berdasarkan code atau id.
3) calculate_price(input: { room_type: string, nights: number, guests?: number })
   - Hitung subtotal, pajak 11%, total.
4) create_booking_link(input: { room_type: string, check_in?: string, check_out?: string, guests?: number })
   - Mengembalikan link /booking dengan query params.

Aturan respons agent:
- Anda WAJIB hanya output JSON valid TANPA markdown/code block.
- Gunakan salah satu format:
  {"action":"tool","tool":"<nama_tool>","input":{...}}
  {"action":"respond","reply":"<jawaban final untuk user>"}
- Jika data sudah cukup, balas dengan action=respond.
- Jika butuh data/perhitungan, panggil tool dulu dengan action=tool.
`;

/**
 * @param {unknown} value
 */
function toText(value) {
	return typeof value === 'string' ? value.trim() : '';
}

/**
 * @param {unknown} value
 */
function toNumber(value) {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return NaN;
}

/**
 * @param {number} amount
 */
function formatRupiah(amount) {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0
	}).format(amount);
}

/**
 * @param {unknown} value
 */
function normalizeLookup(value) {
	const text = toText(value).toLowerCase();
	if (!text) return '';
	return text;
}

/**
 * @param {string} text
 */
function parseJsonObject(text) {
	const trimmed = toText(text);
	if (!trimmed) return null;

	try {
		const parsed = JSON.parse(trimmed);
		return parsed && typeof parsed === 'object' ? parsed : null;
	} catch {
		const firstBrace = trimmed.indexOf('{');
		const lastBrace = trimmed.lastIndexOf('}');
		if (firstBrace < 0 || lastBrace <= firstBrace) return null;

		try {
			const candidate = trimmed.slice(firstBrace, lastBrace + 1);
			const parsed = JSON.parse(candidate);
			return parsed && typeof parsed === 'object' ? parsed : null;
		} catch {
			return null;
		}
	}
}

async function getRoomsFromDatabase() {
	const { rows } = await query(
		`SELECT id, code, name, category, description, price_per_night, size_sqm, max_guests, features, is_available
		 FROM rooms
		 ORDER BY price_per_night ASC, id ASC`
	);
	return rows;
}

/**
 * @param {any[]} rooms
 */
function buildRoomsSummary(rooms) {
	if (rooms.length === 0) {
		return '- Tidak ada data kamar tersedia saat ini.';
	}

	return rooms
		.map(
			(room) =>
				`- ${room.name} (code: ${room.code}, id: ${room.id}) | ${formatRupiah(room.price_per_night)}/malam | maks ${room.max_guests} tamu | tersedia: ${room.is_available ? 'ya' : 'tidak'}`
		)
		.join('\n');
}

/**
 * @param {any[]} rooms
 * @param {string} lookup
 */
function findRoom(rooms, lookup) {
	const normalized = normalizeLookup(lookup);
	if (!normalized) return null;

	if (/^\d+$/.test(normalized)) {
		const id = Number(normalized);
		return rooms.find((room) => Number(room.id) === id) || null;
	}

	return rooms.find((room) => String(room.code).toLowerCase() === normalized) || null;
}

/**
 * @param {unknown} rawInput
 */
function createBookingLink(rawInput) {
	/** @type {any} */
	const input = rawInput && typeof rawInput === 'object' ? rawInput : {};
	const roomType = toText(input.room_type);

	if (!roomType) {
		return { error: 'room_type wajib diisi.' };
	}

	const params = new URLSearchParams();
	params.set('roomType', roomType);

	const checkIn = toText(input.check_in);
	const checkOut = toText(input.check_out);
	const guests = toNumber(input.guests);

	if (checkIn) params.set('checkIn', checkIn);
	if (checkOut) params.set('checkOut', checkOut);
	if (Number.isFinite(guests) && guests > 0) params.set('guests', String(Math.trunc(guests)));

	return {
		booking_url: `/booking?${params.toString()}`,
		message: 'Link booking berhasil dibuat.'
	};
}

/**
 * @param {string} toolName
 * @param {unknown} rawInput
 * @param {any[]} rooms
 */
function runTool(toolName, rawInput, rooms) {
	/** @type {any} */
	const input = rawInput && typeof rawInput === 'object' ? rawInput : {};

	if (toolName === 'list_rooms') {
		const availableOnly = input.available_only === true;
		const filtered = availableOnly ? rooms.filter((room) => room.is_available) : rooms;

		return {
			count: filtered.length,
			rooms: filtered.map((room) => ({
				id: room.id,
				code: room.code,
				name: room.name,
				category: room.category,
				price_per_night: room.price_per_night,
				max_guests: room.max_guests,
				is_available: room.is_available
			}))
		};
	}

	if (toolName === 'get_room_detail') {
		const room = findRoom(rooms, toText(input.room_type));
		if (!room) {
			return { error: 'Kamar tidak ditemukan.' };
		}

		return {
			room: {
				id: room.id,
				code: room.code,
				name: room.name,
				category: room.category,
				description: room.description,
				price_per_night: room.price_per_night,
				size_sqm: room.size_sqm,
				max_guests: room.max_guests,
				features: Array.isArray(room.features) ? room.features : [],
				is_available: room.is_available
			}
		};
	}

	if (toolName === 'calculate_price') {
		const room = findRoom(rooms, toText(input.room_type));
		if (!room) {
			return { error: 'Kamar tidak ditemukan.' };
		}

		const nights = Math.trunc(toNumber(input.nights));
		if (!Number.isFinite(nights) || nights < 1) {
			return { error: 'nights harus bilangan bulat >= 1.' };
		}

		const guests = Math.trunc(toNumber(input.guests));
		if (Number.isFinite(guests) && guests > room.max_guests) {
			return { error: `Jumlah tamu melebihi kapasitas kamar (maksimum ${room.max_guests}).` };
		}

		const subtotal = room.price_per_night * nights;
		const tax = Math.round(subtotal * TAX_RATE);
		const total = subtotal + tax;

		return {
			room: room.name,
			room_code: room.code,
			nights,
			price_per_night: room.price_per_night,
			subtotal,
			tax_11pct: tax,
			grand_total: total,
			formatted: {
				price_per_night: formatRupiah(room.price_per_night),
				subtotal: formatRupiah(subtotal),
				tax_11pct: formatRupiah(tax),
				grand_total: formatRupiah(total)
			}
		};
	}

	if (toolName === 'create_booking_link') {
		return createBookingLink(input);
	}

	return { error: `Tool tidak ditemukan: ${toolName}` };
}

/**
 * @param {{ role?: unknown; content?: unknown }[]} input
 */
function mapIncomingMessages(input) {
	return input
		.map((message) => ({
			/** @type {'assistant' | 'user'} */
			role: message?.role === 'assistant' ? 'assistant' : 'user',
			content: toText(message?.content)
		}))
		.filter((message) => message.content !== '');
}

/**
 * @param {{ role: 'assistant' | 'user'; content: string }[]} messages
 * @param {any[]} rooms
 */
function buildOfflineFallbackReply(messages, rooms) {
	const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user')?.content || '';
	const lastUserText = lastUserMessage.toLowerCase();
	const requestedCode = ['superior', 'deluxe', 'premier', 'suite'].find((code) =>
		lastUserText.includes(code)
	);
	const requestedRoom = requestedCode ? findRoom(rooms, requestedCode) : null;
	const nightsMatch = /(\d+)\s*malam/.exec(lastUserText);
	const nights = nightsMatch ? Math.max(1, Number(nightsMatch[1])) : 1;

	if ((lastUserText.includes('harga') || lastUserText.includes('berapa')) && requestedRoom) {
		const subtotal = requestedRoom.price_per_night * nights;
		const tax = Math.round(subtotal * TAX_RATE);
		const total = subtotal + tax;
		return `Maaf Tuan/Nyonya, layanan AI sedang offline sementara karena Ollama belum terhubung.\n\nSementara saya bantu hitung cepat:\n- ${requestedRoom.name} (${nights} malam)\n- Harga kamar: ${formatRupiah(requestedRoom.price_per_night)} / malam\n- Subtotal: ${formatRupiah(subtotal)}\n- Pajak 11%: ${formatRupiah(tax)}\n- Total: ${formatRupiah(total)}\n\nSilakan lanjutkan reservasi di /booking?roomType=${requestedRoom.code}. Apakah Anda ingin saya bantu estimasi untuk tipe kamar lain?`;
	}

	const availableRooms = rooms
		.filter((room) => room.is_available)
		.slice(0, 3)
		.map((room) => `- ${room.name}: ${formatRupiah(room.price_per_night)} / malam`)
		.join('\n');

	if (availableRooms) {
		return `Maaf Tuan/Nyonya, layanan AI sedang offline sementara karena Ollama belum terhubung.\n\nSebagai alternatif cepat, berikut kamar yang sedang tersedia:\n${availableRooms}\n\nAnda bisa langsung lanjut ke halaman booking di /booking. Ingin saya bantu pilih kamar sesuai budget Anda?`;
	}

	return 'Maaf Tuan/Nyonya, layanan AI sedang offline sementara karena Ollama belum terhubung. Silakan coba lagi beberapa saat, atau lanjutkan reservasi langsung di /booking.';
}

/**
 * @param {unknown} error
 */
function isOllamaUnavailable(error) {
	const message =
		error && typeof error === 'object' && 'message' in error ? toText(error.message).toLowerCase() : '';

	return (
		message.startsWith('ollama_unavailable:') ||
		message.includes('connect') ||
		message.includes('econnrefused') ||
		message.includes('enotfound') ||
		message.includes('ehostunreach')
	);
}

/**
 * @param {{ role: 'system' | 'user' | 'assistant'; content: string }[]} messages
 */
async function callOllama(messages) {
	let response;
	try {
		response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: OLLAMA_MODEL,
				stream: false,
				messages
			})
		});
	} catch (error) {
		const message =
			error && typeof error === 'object' && 'message' in error
				? toText(error.message)
				: 'fetch error';
		throw new Error(`OLLAMA_UNAVAILABLE: ${message}`);
	}

	if (!response.ok) {
		const errText = await response.text();
		throw new Error(`Ollama request gagal: ${errText}`);
	}

	const data = await response.json();
	const content = toText(data?.message?.content);
	if (!content) {
		throw new Error('Ollama tidak mengembalikan konten respons.');
	}

	return content;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	/** @type {{ role: 'assistant' | 'user'; content: string }[]} */
	let messages = [];
	/** @type {any[]} */
	let rooms = [];

	try {
		const body = await request.json().catch(() => ({}));
		messages = Array.isArray(body?.messages) ? mapIncomingMessages(body.messages) : [];
		rooms = await getRoomsFromDatabase();

		const dynamicSystemPrompt = `${BASE_SYSTEM_PROMPT}

Model backend:
- Gunakan Ollama lokal (${OLLAMA_BASE_URL}) dengan model ${OLLAMA_MODEL}.

Kamar saat ini (dinamis dari database):
${buildRoomsSummary(rooms)}

${TOOL_INSTRUCTIONS}`;

		/** @type {{ role: 'system' | 'user' | 'assistant'; content: string }[]} */
		const agentMessages = [{ role: 'system', content: dynamicSystemPrompt }, ...messages];

		for (let i = 0; i < MAX_AGENT_STEPS; i += 1) {
			const modelOutput = await callOllama(agentMessages);
			const payload = parseJsonObject(modelOutput);

			if (!payload) {
				return json({ reply: modelOutput });
			}

			const action = toText(payload.action).toLowerCase();
			if (action === 'respond') {
				const reply = toText(payload.reply);
				return json({ reply: reply || 'Maaf, saya belum bisa memproses permintaan Anda saat ini.' });
			}

			if (action === 'tool') {
				const toolName = toText(payload.tool).toLowerCase();
				const toolResult = runTool(toolName, payload.input, rooms);

				agentMessages.push({
					role: 'assistant',
					content: JSON.stringify(payload)
				});
				agentMessages.push({
					role: 'user',
					content: `TOOL_RESULT ${toolName}: ${JSON.stringify(toolResult)}. Jika sudah cukup, balas dengan action=respond.`
				});
				continue;
			}

			return json({
				reply: 'Maaf, saya mengalami kendala memahami aksi internal. Silakan coba pertanyaan lain.'
			});
		}

		return json({
			reply: 'Maaf, proses agent memerlukan terlalu banyak langkah. Mohon ringkas pertanyaannya dan coba lagi.'
		});
	} catch (error) {
		if (isOllamaUnavailable(error)) {
			return json({
				reply: buildOfflineFallbackReply(messages, rooms),
				degraded: true
			});
		}

		console.error('POST /api/chat error:', error);
		return json({ error: 'Gagal memproses chat AI.' }, { status: 500 });
	}
}
