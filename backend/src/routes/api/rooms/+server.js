import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db';

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

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const availableParam = url.searchParams.get('available');
		const availableOnly = availableParam === 'true' || availableParam === '1';

		const { rows } = await query(
			`${ROOM_SELECT}
			${availableOnly ? 'WHERE is_available = TRUE' : ''}
			ORDER BY price_per_night ASC, id ASC`
		);

		return json({ data: rows });
	} catch (error) {
		console.error('GET /api/rooms error:', error);
		return json({ error: 'Gagal mengambil data kamar.' }, { status: 500 });
	}
}
