import { Pool } from 'pg';

/** @type {Pool | undefined} */
let pool;

function getConnectionConfig() {
	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		throw new Error('DATABASE_URL belum di-set.');
	}

	const sslEnabled =
		process.env.DATABASE_SSL === 'true' ||
		process.env.DATABASE_SSL === '1' ||
		process.env.PGSSLMODE === 'require';

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
 * @param {(client: import('pg').PoolClient) => Promise<T>} callback
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
