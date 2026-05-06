import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '0.0.0.0';

const server = app.listen(port, host, () => {
	console.log(`[backend] running at http://${host}:${port}`);
});

function shutdown(signal) {
	console.log(`[backend] received ${signal}, shutting down...`);
	server.close((error) => {
		if (error) {
			console.error('[backend] error during shutdown:', error);
			process.exit(1);
		}

		process.exit(0);
	});
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
