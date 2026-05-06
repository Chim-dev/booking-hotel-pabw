import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const DEFAULT_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
const DEFAULT_BCRYPT_ROUNDS = 12;

function getJwtSecret() {
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET belum di-set.');
	}

	return process.env.JWT_SECRET;
}

function getBcryptRounds() {
	const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? DEFAULT_BCRYPT_ROUNDS);
	return Number.isFinite(rounds) && rounds >= 8 ? Math.trunc(rounds) : DEFAULT_BCRYPT_ROUNDS;
}

/**
 * @param {string} plainPassword
 */
export async function hashPassword(plainPassword) {
	return bcrypt.hash(plainPassword, getBcryptRounds());
}

/**
 * @param {string} plainPassword
 * @param {string} hashedPassword
 */
export async function verifyPassword(plainPassword, hashedPassword) {
	return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * @param {{ id: number; email: string; role: string }} user
 */
export function createAccessToken(user) {
	return jwt.sign(
		{
			sub: String(user.id),
			email: user.email,
			role: user.role
		},
		getJwtSecret(),
		{
			expiresIn: process.env.JWT_EXPIRES_IN || '7d'
		}
	);
}

/**
 * @param {string} token
 */
export function verifyAccessToken(token) {
	try {
		return jwt.verify(token, getJwtSecret());
	} catch {
		return null;
	}
}

/**
 * @param {import('express').Response} res
 * @param {string} token
 */
export function setAuthCookie(res, token) {
	res.cookie('auth_token', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: Number(process.env.JWT_COOKIE_MAX_AGE ?? DEFAULT_TOKEN_MAX_AGE) * 1000
	});
}

/**
 * @param {import('express').Response} res
 */
export function clearAuthCookie(res) {
	res.clearCookie('auth_token', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	});
}

/**
 * @param {import('express').Request} req
 */
export function getAuthenticatedUser(req) {
	const token = req.cookies?.auth_token;
	if (!token) return null;

	const decoded = verifyAccessToken(token);
	if (!decoded || typeof decoded !== 'object') return null;

	return {
		id: Number(decoded.sub),
		email: typeof decoded.email === 'string' ? decoded.email : '',
		role: typeof decoded.role === 'string' ? decoded.role : 'guest'
	};
}
