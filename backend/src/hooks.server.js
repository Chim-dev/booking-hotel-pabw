/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Menangani request OPTIONS (preflight)
	if (event.request.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Origin': 'http://localhost:5173',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				'Access-Control-Allow-Credentials': 'true'
			}
		});
	}

	const response = await resolve(event);
	
	// Menambahkan header CORS ke semua response
	response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173');
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	response.headers.set('Access-Control-Allow-Credentials', 'true');

	return response;
}
