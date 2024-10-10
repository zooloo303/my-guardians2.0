import type { RequestHandler } from './$types';
import { bngBaseUrl } from '$lib/utils/helpers';
import { error, redirect } from '@sveltejs/kit';
import { BUNGIE_CLIENT_ID, BUNGIE_CLIENT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code || !state) {
		throw error(400, 'Invalid OAuth callback');
	}

	const tokenResponse = await fetch(`${bngBaseUrl}/platform/app/oauth/token/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${btoa(`${BUNGIE_CLIENT_ID}:${BUNGIE_CLIENT_SECRET}`)}`
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			client_id: BUNGIE_CLIENT_ID
		})
	});

	if (!tokenResponse.ok) {
		throw error(500, 'Failed to obtain access token');
	}

	const tokenData = await tokenResponse.json();

	// Store tokens
	cookies.set('access_token', tokenData.access_token, {
		path: '/',
		httpOnly: true,
		secure: true,
		maxAge: tokenData.expires_in
	});
	cookies.set('refresh_token', tokenData.refresh_token, {
		path: '/',
		httpOnly: true,
		secure: true,
		maxAge: tokenData.refresh_expires_in
	});

	// Goto home page
	redirect(302, '/');
};

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });
	return new Response(null, { status: 302, headers: { Location: '/' } });
};
