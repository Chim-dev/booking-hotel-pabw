import { json } from '@sveltejs/kit';
import { clearAuthCookie } from '$lib/server/auth';

/**
 * @param {import('@sveltejs/kit').RequestEvent} event
 */
export async function POST({ cookies }) {
	clearAuthCookie(cookies);

	return json({
		message: 'Logout berhasil.'
	});
}
