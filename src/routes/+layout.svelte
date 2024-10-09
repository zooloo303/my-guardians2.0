<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { storeManifestData, getManifestVersion } from '$lib/utils/indexedDB';

	onMount(async () => {
		try {
			const storedVersion = await getManifestVersion();
			const response = await fetch('/api/d2/manifest');

			if (response.ok) {
				const { version, tables } = await response.json();

				if (version !== storedVersion) {
					await storeManifestData({ version, tables });
					console.log('New manifest data stored successfully');
				} else {
					console.log('Manifest is up to date');
				}
			} else {
				console.error('Failed to fetch manifest data');
			}
		} catch (error) {
			console.error('Error handling manifest data:', error);
		}
	});

	let { children } = $props();
</script>

<ModeWatcher />
<Header />
<Toaster />
{@render children()}
