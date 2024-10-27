import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bngBaseUrl, manifestTables } from '$lib/utils/helpers';

interface ManifestTable {
	[key: string]: object;
}

const BATCH_SIZE = 5; // Adjust based on your needs

export const GET: RequestHandler = async ({ fetch }) => {
	const manifestResponse = await fetch(`${bngBaseUrl}/Platform/Destiny2/Manifest/`);

	if (!manifestResponse.ok) {
		return json({ error: 'Failed to fetch manifest' }, { status: 500 });
	}

	const manifestData = await manifestResponse.json();
	const version = manifestData.Response.version;
	const contentPaths = manifestData.Response.jsonWorldComponentContentPaths.en;

	const tables: Record<string, ManifestTable> = {};

	// Split manifestTables into batches
	for (let i = 0; i < manifestTables.length; i += BATCH_SIZE) {
		const batch = manifestTables.slice(i, i + BATCH_SIZE);
		
		const batchResults = await Promise.all(
			batch.map(async (table) => {
				const response = await fetch(`${bngBaseUrl}${contentPaths[table]}`);
				if (response.ok) {
					const data = await response.json();
					return { table, data };
				}
				return { table, data: null };
			})
		);

		// Add successful results to tables
		batchResults.forEach(({ table, data }) => {
			if (data) {
				tables[table] = data;
			}
		});
	}

	return json({ version, tables });
};
