import { json } from '@sveltejs/kit';
import { clearAuthCookie } from '$lib/server/auth';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	clearAuthCookie(cookies);

	return json({
		message: 'Logout berhasil.'
	});
}
