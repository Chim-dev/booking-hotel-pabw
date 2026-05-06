/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
	try {
		const res = await fetch('/api/users');
		const json = await res.json();
		return {
			users: json.data || []
		};
	} catch (error) {
		console.error('Load admin/users error:', error);
		return { users: [] };
	}
}
