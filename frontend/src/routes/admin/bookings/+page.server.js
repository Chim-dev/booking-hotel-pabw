/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	try {
		const res = await fetch('/api/bookings');
		const json = await res.json();
		return {
			bookings: json.data || []
		};
	} catch (error) {
		console.error('Load admin/bookings error:', error);
		return { bookings: [] };
	}
}
