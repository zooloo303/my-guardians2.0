import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bngBaseUrl, manifestTables } from '$lib/utils/helpers';

const CHUNK_SIZE = 5000; // Adjust this value based on performance

export const GET: RequestHandler = async ({ fetch, url }) => {
	const tableParam = url.searchParams.get('table');
	const chunkParam = url.searchParams.get('chunk');

	try {
		const manifestResponse = await fetch(`${bngBaseUrl}/Platform/Destiny2/Manifest/`);

		if (!manifestResponse.ok) {
			return json({ error: 'Failed to fetch manifest' }, { status: 500 });
		}

		const manifestData = await manifestResponse.json();
		const version = manifestData.Response.version;
		const contentPaths = manifestData.Response.jsonWorldComponentContentPaths.en;

		// If a specific table is requested
		if (tableParam && manifestTables.includes(tableParam)) {
			const tableResponse = await fetch(`${bngBaseUrl}${contentPaths[tableParam]}`);
			
			if (!tableResponse.ok) {
				return json({ error: `Failed to fetch table ${tableParam}` }, { status: 500 });
			}

			const tableData = await tableResponse.json();
			const entries = Object.entries(tableData);
			
			// If chunk is requested, return only that chunk
			if (chunkParam !== null) {
				const chunkIndex = parseInt(chunkParam);
				const start = chunkIndex * CHUNK_SIZE;
				const end = start + CHUNK_SIZE;
				const chunkEntries = entries.slice(start, end);
				const chunkData = Object.fromEntries(chunkEntries);
				
				return json({ 
					version, 
					table: tableParam, 
					data: chunkData,
					totalChunks: Math.ceil(entries.length / CHUNK_SIZE),
					currentChunk: chunkIndex
				});
			}

			// If no chunk specified, return metadata about the table
			return json({ 
				version,
				table: tableParam,
				totalChunks: Math.ceil(entries.length / CHUNK_SIZE)
			});
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
