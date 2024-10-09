import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	let profileData = null;
	if (locals.user) {
		const profileResponse = await fetch('/api/d2/profile');
		if (profileResponse.ok) {
			profileData = await profileResponse.json();
		}
	}
	return { profileData, user: locals.user };
};
