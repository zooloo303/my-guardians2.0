import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	console.log('hello');
	const res = await fetch('/api/d2/profile');
	const profileData = await res.json();
	return { profileData };
};
