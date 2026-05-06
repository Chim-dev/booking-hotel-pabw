/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	try {
		const res = await fetch('/api/rooms');
		const json = await res.json();
		return {
			rooms: json.data || []
		};
	} catch (error) {
		console.error('Load admin/rooms error:', error);
		return { rooms: [] };
	}
}
