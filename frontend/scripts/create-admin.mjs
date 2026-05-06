import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

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

async function createAdmin(email, password, firstName, lastName) {
	const client = await pool.connect();
	try {
		const passwordHash = await bcrypt.hash(password, 12);
		await client.query(
			`INSERT INTO users (email, password_hash, first_name, last_name, role)
			 VALUES ($1, $2, $3, $4, 'admin')
			 ON CONFLICT (email) DO UPDATE 
			 SET role = 'admin', password_hash = $2`,
			[email, passwordHash, firstName, lastName]
		);
		console.log(`Admin user ${email} berhasil dibuat/diperbarui.`);
	} catch (error) {
		console.error('Gagal membuat admin:', error);
	} finally {
		client.release();
		await pool.end();
	}
}

const email = process.argv[2] || 'admin@grandmaison.com';
const password = process.argv[3] || 'admin123';

createAdmin(email, password, 'Admin', 'Grand Maison');
