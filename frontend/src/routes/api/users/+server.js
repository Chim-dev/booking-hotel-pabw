import { json } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/auth';
import { query } from '$lib/server/db';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	const authUser = getAuthenticatedUser(cookies);
	if (authUser?.role !== 'admin') {
		return json({ error: 'Unauthorized.' }, { status: 401 });
	}

	try {
		const { rows } = await query(
			`SELECT id, email, first_name, last_name, role, created_at
			 FROM users
			 ORDER BY created_at DESC`
		);

		return json({ data: rows });
	} catch (error) {
		console.error('GET /api/users error:', error);
		return json({ error: 'Gagal mengambil data user.' }, { status: 500 });
	}
}
