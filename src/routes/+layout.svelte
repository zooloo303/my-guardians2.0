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
	
	// Force dark mode immediately on load
	if (typeof window !== 'undefined') {
		document.documentElement.classList.add('dark');
	}

	setNavContext($page.url.pathname);

	let isUpdatingManifest = $state(false);
	let sidebarOpen = $state(false);
	let progress = $state(0);

	onMount(async () => {
		try {
			const storedVersion = await getManifestVersion();
			const response = await fetch('/api/d2/manifest');

			if (response.ok) {
				const { version, tables } = await response.json();

				if (version !== storedVersion) {
					isUpdatingManifest = true;
					// Simulating progress for demonstration
					for (let i = 0; i <= 100; i += 10) {
						progress = i;
						await new Promise((resolve) => setTimeout(resolve, 200));
					}

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
		} finally {
			isUpdatingManifest = false;
			progress = 0;
		}
	});

	let { data, children } = $props<{
		data: { user: UserData | null; profileData: ProfileData | null };
	}>();
	let user = $state(data.user);
</script>

<ModeWatcher />
<Header {user} bind:sidebarOpen />
<Sidebar bind:open={sidebarOpen} />
<Toaster />
<DataRefreshManager />

{#if isUpdatingManifest}
	<div class="fixed bottom-0 left-0 right-0 z-50 bg-background/80 p-4 backdrop-blur-sm">
		<div class="mx-auto max-w-md">
			<p class="mb-2 text-sm font-medium">Updating Manifest: {progress}%</p>
			<Progress value={progress} max={100} />
		</div>
	</div>
{/if}

{@render children()}
