import { bngBaseUrl } from '$lib/utils/helpers';
import { BUNGIE_API_KEY } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import type { UserData } from '$lib/utils/types';

export async function fetchUserServer(
	fetch: typeof globalThis.fetch,
	cookies: Cookies
): Promise<UserData | null> {
	const accessToken = cookies.get('access_token');

	if (!accessToken) {
		return null;
	}

	const response = await fetch(`${bngBaseUrl}/Platform/User/GetMembershipsForCurrentUser/`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'X-API-Key': BUNGIE_API_KEY
		}
	});

	if (!response.ok) {
		console.error('Failed to fetch user data');
		return null;
	}

	const userData = await response.json();
	return userData.Response;
}
