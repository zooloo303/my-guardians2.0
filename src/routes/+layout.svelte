<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { setNavContext } from '$lib/utils/navContext';
	import type { UserData, ProfileData } from '$lib/utils/types';
	import ManifestManager from '$lib/components/ManifestManager.svelte';
	import MaintenanceAlert from '$lib/components/MaintenanceAlert.svelte';
	import DataRefreshManager from '$lib/components/DataRefreshManager.svelte';
	// Props
	let { data, children } = $props<{
		data: { user: UserData | null; profileData: ProfileData | null };
	}>();
	let user = $state(data.user);
	// State
	let sidebarOpen = $state(false);
	// Force dark mode immediately on load
	if (typeof window !== 'undefined') {
		document.documentElement.classList.add('dark');
	}
	setNavContext($page.url.pathname);

</script>

<ModeWatcher />
<Header {user} bind:sidebarOpen />
<Sidebar bind:open={sidebarOpen} />
<Toaster />
<MaintenanceAlert />
<DataRefreshManager />

{#if user}
  <ManifestManager />
{/if}

{@render children()}
