import { Router } from 'express';
import { query } from '../lib/db.js';
import { normalizeRoomLookup } from '../lib/validation.js';

const router = Router();

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

router.get('/', async (req, res) => {
	try {
		const availableOnly =
			req.query.available === 'true' || req.query.available === '1';

		const { rows } = await query(
			`${ROOM_SELECT}
			${availableOnly ? 'WHERE is_available = TRUE' : ''}
			ORDER BY price_per_night ASC, id ASC`
		);

		res.json({ data: rows });
	} catch (error) {
		console.error('GET /api/rooms error:', error);
		res.status(500).json({ error: 'Gagal mengambil data kamar.' });
	}
});

router.get('/:id', async (req, res) => {
	const lookup = normalizeRoomLookup(req.params.id);
	if (!lookup) {
		return res.status(400).json({ error: 'Parameter room id tidak valid.' });
	}

	try {
		const whereClause = lookup.kind === 'id' ? 'id = $1' : 'code = $1';
		const { rows } = await query(`${ROOM_SELECT} WHERE ${whereClause} LIMIT 1`, [lookup.value]);

		if (rows.length === 0) {
			return res.status(404).json({ error: 'Kamar tidak ditemukan.' });
		}

		res.json({ data: rows[0] });
	} catch (error) {
		console.error('GET /api/rooms/:id error:', error);
		res.status(500).json({ error: 'Gagal mengambil data kamar.' });
	}
});

export default router;
