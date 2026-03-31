import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db';
import { normalizeRoomLookup } from '$lib/server/validation';

const ROOM_SELECT = `
	SELECT
		id,
		code,
		name,
		category,
		description,
		price_per_night,
		size_sqm,
		max_guests,
		features,
		is_available
	FROM rooms
`;

/**
 * @param {import('@sveltejs/kit').RequestEvent} event
 */
export async function GET({ params }) {
	const lookup = normalizeRoomLookup(params.id);
	if (!lookup) {
		return json({ error: 'Parameter room id tidak valid.' }, { status: 400 });
	}

	try {
		const whereClause = lookup.kind === 'id' ? 'id = $1' : 'code = $1';
		const { rows } = await query(`${ROOM_SELECT} WHERE ${whereClause} LIMIT 1`, [lookup.value]);

		if (rows.length === 0) {
			return json({ error: 'Kamar tidak ditemukan.' }, { status: 404 });
		}

		return json({
			data: rows[0]
		});
	} catch (error) {
		console.error('GET /api/rooms/:id error:', error);
		return json({ error: 'Gagal mengambil data kamar.' }, { status: 500 });
	}
}
