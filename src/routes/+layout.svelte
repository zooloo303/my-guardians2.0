<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { setNavContext } from '$lib/utils/navContext';
	import { Progress } from '$lib/components/ui/progress';
	import type { UserData, ProfileData } from '$lib/utils/types';
	import DataRefreshManager from '$lib/components/DataRefreshManager.svelte';
	import { storeManifestData, getManifestVersion } from '$lib/utils/indexedDB';
	
	setNavContext($page.url.pathname);

	let isUpdatingManifest = $state(false);
	let sidebarOpen = $state(false);
	let progress = $state(0);
	let currentTable = $state('');
	let currentChunk = $state(0);
	let totalChunks = $state(0);

	onMount(async () => {
		try {
			const storedVersion = await getManifestVersion();
			const response = await fetch('/api/d2/manifest');

			if (response.ok) {
				const { version, tables } = await response.json();

				if (version !== storedVersion) {
					isUpdatingManifest = true;
					const totalTables = tables.length;
					
					for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
						const table = tables[tableIndex];
						currentTable = table;
						
						// Get table metadata first
						const tableMetaResponse = await fetch(`/api/d2/manifest?table=${table}`);
						if (!tableMetaResponse.ok) continue;
						
						const { totalChunks: chunks } = await tableMetaResponse.json();
						totalChunks = chunks;

						// Fetch each chunk
						for (let chunk = 0; chunk < chunks; chunk++) {
							currentChunk = chunk + 1;
							const chunkResponse = await fetch(`/api/d2/manifest?table=${table}&chunk=${chunk}`);
							
							if (chunkResponse.ok) {
								const { data } = await chunkResponse.json();
								await storeManifestData({ 
									version, 
									tables: { [table]: data } 
								});
							}

							// Calculate overall progress
							const tableProgress = (tableIndex + (chunk + 1) / chunks) / totalTables;
							progress = Math.round(tableProgress * 100);
						}
					}

					console.log('New manifest data stored successfully');
				} else {
					console.log('Manifest is up to date');
				}
			}
		} catch (error) {
			console.error('Error handling manifest data:', error);
		} finally {
			isUpdatingManifest = false;
			progress = 0;
			currentTable = '';
			currentChunk = 0;
			totalChunks = 0;
		}
	});

	let { data, children } = $props<{
		data: { user: UserData | null; profileData: ProfileData | null };
	}>();
	let user = $state(data.user);
</script>

<ModeWatcher />
<Header {user}bind:sidebarOpen />
<Sidebar bind:open={sidebarOpen} />
<Toaster />
<DataRefreshManager />

{#if isUpdatingManifest}
	<div class="fixed bottom-0 left-0 right-0 z-50 bg-background/80 p-4 backdrop-blur-sm">
		<div class="mx-auto max-w-md">
			<p class="mb-2 text-sm font-medium">
				Updating Manifest: {progress}%
				{#if currentTable}
					<span class="text-muted-foreground">
						({currentTable} - Chunk {currentChunk}/{totalChunks})
					</span>
				{/if}
			</p>
			<Progress value={progress} max={100} />
		</div>
	</div>
{/if}

{@render children()}
