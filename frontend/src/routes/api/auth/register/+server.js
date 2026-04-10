import { json } from '@sveltejs/kit';
import { createAccessToken, hashPassword, setAuthCookie } from '$lib/server/auth';
import { query } from '$lib/server/db';
import { isValidEmail, toNonEmptyString } from '$lib/server/validation';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	try {
		const body = await request.json().catch(() => ({}));

		const firstName = toNonEmptyString(body.firstName);
		const lastName = toNonEmptyString(body.lastName);
		const email = toNonEmptyString(body.email).toLowerCase();
		const phone = toNonEmptyString(body.phone);
		const password = toNonEmptyString(body.password);

		if (!firstName || !email || !password) {
			return json({ error: 'Field wajib: firstName, email, password.' }, { status: 400 });
		}

		if (!isValidEmail(email)) {
			return json({ error: 'Format email tidak valid.' }, { status: 400 });
		}

		if (password.length < 8) {
			return json({ error: 'Password minimal 8 karakter.' }, { status: 400 });
		}

		const passwordHash = await hashPassword(password);

		const { rows } = await query(
			`INSERT INTO users (email, password_hash, first_name, last_name, phone)
			 VALUES ($1, $2, $3, $4, $5)
			 RETURNING id, email, role, first_name, last_name, phone, created_at`,
			[email, passwordHash, firstName, lastName || null, phone || null]
		);

		const user = rows[0];
		const token = createAccessToken({
			id: user.id,
			email: user.email,
			role: user.role
		});

		setAuthCookie(cookies, token);

		return json(
			{
				message: 'Registrasi berhasil.',
				data: {
					user,
					token
				}
			},
			{ status: 201 }
		);
	} catch (error) {
		if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
			return json({ error: 'Email sudah terdaftar.' }, { status: 409 });
		}

		console.error('POST /api/auth/register error:', error);
		return json({ error: 'Gagal melakukan registrasi.' }, { status: 500 });
	}
}
