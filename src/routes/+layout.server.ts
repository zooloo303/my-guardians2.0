import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	console.log('hello');
	const res = await fetch('/api/d2/profile');
	const profileData = await res.json();
	return { profileData, user: locals.user };
};
