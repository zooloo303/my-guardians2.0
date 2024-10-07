import type { Handle } from '@sveltejs/kit';
import { fetchUserServer } from '$lib/utils/serverAuth';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = await fetchUserServer(event.fetch, event.cookies);
	return resolve(event);
};
