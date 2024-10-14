<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { UserData, ProfileData } from '$lib/utils/types';
	import ItemList from '$lib/components/ItemList.svelte';
	//props
	let { data } = $props<{ data: { user: UserData | null; profileData: ProfileData | null } }>();
	//state
	let isLoading = $state(data.profileData === null && data.user !== null);
</script>

{#if isLoading}
	<Skeleton />
{:else if data.user && data.profileData}
	<ItemList profileData={data.profileData} />
{:else if data.user}
	<p>Loading profile data...</p>
{:else}
	<p>No user data available. Please log in.</p>
{/if}
