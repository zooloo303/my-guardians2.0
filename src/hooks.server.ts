import type { Handle } from '@sveltejs/kit';
import { fetchUserServer } from '$lib/utils/serverAuth';
import { refreshTokenIfNeeded } from '$lib/utils/auth';

export const handle: Handle = async ({ event, resolve }) => {
	await refreshTokenIfNeeded(event);
	event.locals.user = await fetchUserServer(event.fetch, event.cookies);
	return resolve(event);
};
