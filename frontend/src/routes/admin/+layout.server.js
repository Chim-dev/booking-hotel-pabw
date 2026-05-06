import { redirect } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/auth';
import { query } from '$lib/server/db';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, url }) {
	const authUser = getAuthenticatedUser(cookies);

	if (!authUser) {
		throw redirect(302, `/login?redirectTo=${url.pathname}`);
	}

	if (authUser.role !== 'admin') {
		throw redirect(302, '/');
	}

	// Fetch full user details
	const { rows } = await query(
		`SELECT id, email, role, first_name, last_name 
		 FROM users 
		 WHERE id = $1`,
		[authUser.id]
	);

	if (rows.length === 0) {
		throw redirect(302, '/login');
	}

	return {
		user: rows[0]
	};
}
