import { env } from '$env/dynamic/private';
import { Pool } from 'pg';

/** @type {any} */
let pool;

function getConnectionConfig() {
	const connectionString = env.DATABASE_URL;

	if (!connectionString) {
		throw new Error('DATABASE_URL belum di-set.');
	}

	let isSupabaseHost = false;
	try {
		isSupabaseHost = new URL(connectionString).hostname.includes('supabase');
	} catch {
		isSupabaseHost = false;
	}

	const sslEnabled =
		env.DATABASE_SSL === 'true' ||
		env.DATABASE_SSL === '1' ||
		env.PGSSLMODE === 'require' ||
		/[?&]sslmode=require/i.test(connectionString) ||
		/[?&]ssl=true/i.test(connectionString) ||
		isSupabaseHost;

	return {
		connectionString,
		ssl: sslEnabled ? { rejectUnauthorized: false } : undefined
	};
}

function getPool() {
	if (!pool) {
		pool = new Pool(getConnectionConfig());
	}

	return pool;
}

/**
 * @param {string} text
 * @param {unknown[]} [params]
 */
export async function query(text, params = []) {
	return getPool().query(text, params);
}

/**
 * @template T
 * @param {(client: any) => Promise<T>} callback
 * @returns {Promise<T>}
 */
export async function withTransaction(callback) {
	const client = await getPool().connect();

	try {
		await client.query('BEGIN');
		const result = await callback(client);
		await client.query('COMMIT');
		return result;
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}
