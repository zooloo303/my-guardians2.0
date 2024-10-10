import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bngBaseUrl, manifestTables } from '$lib/utils/helpers';

interface ManifestTable {
	[key: string]: object;
}

export const GET: RequestHandler = async ({ fetch }) => {
	const manifestResponse = await fetch(`${bngBaseUrl}/Platform/Destiny2/Manifest/`);

	if (!manifestResponse.ok) {
		return json({ error: 'Failed to fetch manifest' }, { status: 500 });
	}

	const manifestData = await manifestResponse.json();
	const version = manifestData.Response.version;
	const contentPaths = manifestData.Response.jsonWorldComponentContentPaths.en;

	const tables: Record<string, ManifestTable> = {};

	for (const table of manifestTables) {
		const tableResponse = await fetch(`${bngBaseUrl}${contentPaths[table]}`, {});

		if (tableResponse.ok) {
			tables[table] = await tableResponse.json();
		}
	}

	return json({ version, tables });
};
