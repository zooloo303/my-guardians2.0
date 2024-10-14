<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { UserData, ProfileData } from '$lib/utils/types';
	import CharacterList from '$lib/components/CharacterList.svelte';

	//props
	let { data } = $props<{ data: { user: UserData | null; profileData: ProfileData | null } }>();
	// console.log("data", data)
	//state
	let isLoading = $state(data.profileData === null && data.user !== null);
</script>

{#if isLoading}
	<Skeleton />
{:else if data.user && data.profileData}
	<CharacterList characters={data.profileData.characters} />
{:else if data.user}
	<p>Loading profile data...</p>
{:else}
	<p>No user data available. Please log in.</p>
{/if}
