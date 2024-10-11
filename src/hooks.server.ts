import type { Handle } from '@sveltejs/kit';
import { fetchUserServer } from '$lib/utils/serverAuth';
import { refreshTokenIfNeeded } from '$lib/utils/auth';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname !== '/api/auth/refresh') {
		await refreshTokenIfNeeded(event);
	  }
	event.locals.user = await fetchUserServer(event.fetch, event.cookies);
	return resolve(event);
};
