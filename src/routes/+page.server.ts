import { Character } from '$lib/utils/types';

export const load = async ({ fetch }) => {
	const res = await fetch('/api/d2/profile/');
};
