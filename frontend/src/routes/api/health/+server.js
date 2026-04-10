import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	return json({
		ok: true,
		service: 'booking-hotel-sveltekit'
	});
}
