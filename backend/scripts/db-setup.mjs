import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const schemaPath = path.join(rootDir, 'db', 'schema.sql');
const seedPath = path.join(rootDir, 'db', 'seed.sql');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	console.error('DATABASE_URL belum di-set.');
	process.exit(1);
}

const pool = new Pool({
	connectionString,
	ssl:
		process.env.DATABASE_SSL === 'true' ||
		process.env.DATABASE_SSL === '1' ||
		process.env.PGSSLMODE === 'require'
			? { rejectUnauthorized: false }
			: undefined
});

async function runSqlFile(client, sqlPath, label) {
	const sql = await readFile(sqlPath, 'utf8');
	await client.query(sql);
	console.log(`OK: ${label}`);
}

async function main() {
	const seedOnly = process.argv.includes('--seed-only');
	const client = await pool.connect();

	try {
		if (!seedOnly) {
			await runSqlFile(client, schemaPath, 'schema');
		}
		await runSqlFile(client, seedPath, 'seed');
	} finally {
		client.release();
		await pool.end();
	}
}

main().catch((error) => {
	console.error('db-setup gagal:', error);
	process.exit(1);
});
