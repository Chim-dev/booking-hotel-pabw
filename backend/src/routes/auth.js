import { Router } from 'express';
import {
	clearAuthCookie,
	createAccessToken,
	getAuthenticatedUser,
	hashPassword,
	setAuthCookie,
	verifyPassword
} from '../lib/auth.js';
import { query } from '../lib/db.js';
import { isValidEmail, toNonEmptyString } from '../lib/validation.js';

const router = Router();

router.post('/register', async (req, res) => {
	try {
		const body = req.body ?? {};

		const firstName = toNonEmptyString(body.firstName);
		const lastName = toNonEmptyString(body.lastName);
		const email = toNonEmptyString(body.email).toLowerCase();
		const phone = toNonEmptyString(body.phone);
		const password = toNonEmptyString(body.password);

		if (!firstName || !email || !password) {
			return res.status(400).json({ error: 'Field wajib: firstName, email, password.' });
		}

		if (!isValidEmail(email)) {
			return res.status(400).json({ error: 'Format email tidak valid.' });
		}

		if (password.length < 8) {
			return res.status(400).json({ error: 'Password minimal 8 karakter.' });
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

		setAuthCookie(res, token);

		res.status(201).json({
			message: 'Registrasi berhasil.',
			data: {
				user,
				token
			}
		});
	} catch (error) {
		if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
			return res.status(409).json({ error: 'Email sudah terdaftar.' });
		}

		console.error('POST /api/auth/register error:', error);
		res.status(500).json({ error: 'Gagal melakukan registrasi.' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const body = req.body ?? {};
		const email = toNonEmptyString(body.email).toLowerCase();
		const password = toNonEmptyString(body.password);

		if (!email || !password) {
			return res.status(400).json({ error: 'Field wajib: email, password.' });
		}

		if (!isValidEmail(email)) {
			return res.status(400).json({ error: 'Format email tidak valid.' });
		}

		const { rows } = await query(
			`SELECT id, email, role, password_hash, first_name, last_name, phone, created_at
			 FROM users
			 WHERE email = $1
			 LIMIT 1`,
			[email]
		);

		const user = rows[0];
		if (!user) {
			return res.status(401).json({ error: 'Email atau password tidak valid.' });
		}

		const validPassword = await verifyPassword(password, user.password_hash);
		if (!validPassword) {
			return res.status(401).json({ error: 'Email atau password tidak valid.' });
		}

		const token = createAccessToken({
			id: user.id,
			email: user.email,
			role: user.role
		});

		setAuthCookie(res, token);

		const { password_hash, ...safeUser } = user;

		res.json({
			message: 'Login berhasil.',
			data: {
				user: safeUser,
				token
			}
		});
	} catch (error) {
		console.error('POST /api/auth/login error:', error);
		res.status(500).json({ error: 'Gagal melakukan login.' });
	}
});

router.post('/logout', async (_req, res) => {
	clearAuthCookie(res);

	res.json({
		message: 'Logout berhasil.'
	});
});

router.get('/me', async (req, res) => {
	const authUser = getAuthenticatedUser(req);
	if (!authUser?.id) {
		return res.status(401).json({ error: 'Unauthorized.' });
	}

	try {
		const { rows } = await query(
			`SELECT id, email, role, first_name, last_name, phone, created_at
			 FROM users
			 WHERE id = $1
			 LIMIT 1`,
			[authUser.id]
		);

		if (rows.length === 0) {
			return res.status(404).json({ error: 'User tidak ditemukan.' });
		}

		res.json({ data: rows[0] });
	} catch (error) {
		console.error('GET /api/auth/me error:', error);
		res.status(500).json({ error: 'Gagal mengambil data user.' });
	}
});

export default router;
