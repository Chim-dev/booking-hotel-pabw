import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './routes/auth.js';
import bookingsRoutes from './routes/bookings.js';
import chatRoutes from './routes/chat.js';
import roomsRoutes from './routes/rooms.js';

const app = express();
app.disable('x-powered-by');

const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use(
	cors({
		origin(origin, callback) {
			if (!origin) {
				return callback(null, true);
			}

			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error(`Origin ${origin} tidak diizinkan.`));
		},
		credentials: true
	})
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
	res.json({
		ok: true,
		service: 'booking-hotel-backend'
	});
});

app.get('/api/health', (_req, res) => {
	res.json({
		ok: true,
		service: 'booking-hotel-backend'
	});
});

app.use('/api/rooms', roomsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/chat', chatRoutes);

app.use((req, res) => {
	res.status(404).json({
		error: `Route tidak ditemukan: ${req.method} ${req.originalUrl}`
	});
});

app.use((error, _req, res, _next) => {
	console.error('Unhandled backend error:', error);
	res.status(500).json({
		error: 'Terjadi kesalahan pada server backend.'
	});
});

export default app;
