import { goto } from '$app/navigation';
import type { RequestEvent } from '@sveltejs/kit';

export async function refreshTokenIfNeeded(event: RequestEvent) {
	const accessToken = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');

	if (!accessToken && refreshToken) {
		try {
			const response = await event.fetch('/api/auth/refresh', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ refreshToken })
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					console.log('Token refreshed successfully');
					event.cookies.set('access_token', data.access_token, {
						path: '/',
						httpOnly: true,
						secure: true,
						sameSite: 'strict',
						maxAge: data.expires_in
					});
				} else {
					console.error('Failed to refresh token');
					// Clear cookies if refresh failed
					event.cookies.delete('access_token', { path: '/' });
					event.cookies.delete('refresh_token', { path: '/' });
				}
			} else {
				console.error('Error calling refresh token endpoint');
				// Clear cookies if refresh failed
				event.cookies.delete('access_token', { path: '/' });
				event.cookies.delete('refresh_token', { path: '/' });
			}
		} catch (error) {
			console.error('Error during token refresh:', error);
			// Clear cookies if refresh failed
			event.cookies.delete('access_token', { path: '/' });
			event.cookies.delete('refresh_token', { path: '/' });
		}
	}
}

async function refreshToken() {
	const TIMEOUT_MS = 10000; // 10 seconds

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

		const response = await fetch('/api/auth/refresh', {
			method: 'POST',
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error('Token refresh failed');
		}

		const data = await response.json();

		if (typeof data.expires_in === 'number' && !isNaN(data.expires_in)) {
			const newExpiration = Date.now() + data.expires_in * 1000;
			localStorage.setItem('tokenExpiration', newExpiration.toString());
		} else {
			console.error('Invalid expires_in value:', data.expires_in);
		}
	} catch (error: unknown) {
		if (error instanceof Error && error.name === 'AbortError') {
			console.error('Token refresh timeout');
		} else {
			console.error('Failed to refresh token:', error);
		}
		goto('/api/auth/login');
	}
}
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
	const response = await fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	});

	if (response.status === 401) {
		// Token might have expired right after the check
		await refreshToken();
		return authenticatedFetch(url, options);
	}

	return response;
}
