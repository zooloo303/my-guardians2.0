import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bngBaseUrl, manifestTables } from '$lib/utils/helpers';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const tableParam = url.searchParams.get('table');

	try {
		const manifestResponse = await fetch(`${bngBaseUrl}/Platform/Destiny2/Manifest/`);

		if (!manifestResponse.ok) {
			return json({ error: 'Failed to fetch manifest' }, { status: 500 });
		}

		const manifestData = await manifestResponse.json();
		const version = manifestData.Response.version;
		const contentPaths = manifestData.Response.jsonWorldComponentContentPaths.en;

		// If a specific table is requested, return only that table
		if (tableParam && manifestTables.includes(tableParam)) {
			const tableResponse = await fetch(`${bngBaseUrl}${contentPaths[tableParam]}`);
			
			if (!tableResponse.ok) {
				return json({ error: `Failed to fetch table ${tableParam}` }, { status: 500 });
			}

			const tableData = await tableResponse.json();
			return json({ version, table: tableParam, data: tableData });
		}

		// Otherwise just return the version and available tables
		return json({ 
			version, 
			tables: manifestTables 
		});
	} catch (error) {
		console.error('Error fetching manifest:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
