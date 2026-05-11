import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// Karena ini API-only, kita mungkin ingin mengizinkan CORS
		// Tapi CORS biasanya ditangani di level middleware atau hook
		csrf: {
			checkOrigin: false,
		}
	}
};

export default config;
