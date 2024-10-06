import { BUNGIE_API_KEY } from '$env/static/private';
import { bngBaseUrl } from '$lib/utils/helpers';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
	const membershipType = url.searchParams.get('membershipType');
	const destinyMembershipId = url.searchParams.get('destinyMembershipId');
	const accessToken = cookies.get('access_token');

	if (!membershipType || !destinyMembershipId || !accessToken) {
		return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
	}

	const apiUrl = `${bngBaseUrl}Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?components=102,200,201,205,206,300,304,305`;

	const response = await fetch(apiUrl, {
		headers: {
			'X-API-Key': BUNGIE_API_KEY,
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		return new Response(
			JSON.stringify({ error: 'Failed to fetch character data from Bungie API' }),
			{ status: response.status }
		);
	}

	const data = await response.json();

	const characters = data.Response.characters.data;
	const loadouts = data.Response.characterLoadouts.data;
	const inventoryData = {
		profileInventory: data.Response.profileInventory.data,
		characterInventories: data.Response.characterInventories.data,
		characterEquipment: data.Response.characterEquipment.data,
		itemComponents: data.Response.itemComponents
	};

	return new Response(JSON.stringify({ characters, loadouts, inventoryData }));
};
