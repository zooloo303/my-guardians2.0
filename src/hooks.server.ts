import type { Handle } from '@sveltejs/kit';
import { fetchUserServer } from '$lib/utils/serverAuth';
import { refreshTokenIfNeeded } from '$lib/utils/auth';

export const handle: Handle = async ({ event, resolve }) => {
	await refreshTokenIfNeeded(event);
	event.locals.user = await fetchUserServer(event.fetch, event.cookies);
	console.log('User from hooks:', event.locals.user);

	// Only redirect if not on the login or auth-callback page
	if (
		!event.locals.user &&
		!event.url.pathname.startsWith('/login') &&
		!event.url.pathname.startsWith('/auth-callback')
	) {
		return new Response(null, {
			status: 302,
			headers: { Location: '/login' }
		});
	}

	return resolve(event);
};
