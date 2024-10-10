<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { UserData, ProfileData } from '$lib/utils/types';
	import MembershipCard from '$lib/components/MembershipCard.svelte';
	import Item from '$lib/components/Item.svelte';
	import { getUniqueInventoryItems } from '$lib/utils/helpers';

	let { data } = $props<{ data: { user: UserData | null; profileData: ProfileData | null } }>();
	let isLoading = $state(data.profileData === null && data.user !== null);

	$effect(() => {
		if (data.profileData) {
			console.log('Unique items:', getUniqueInventoryItems(data.profileData));
		}
	});
</script>

{#if isLoading}
	<Skeleton />
{:else if data.user && data.profileData}
	<MembershipCard user={data.user} />
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
		{#each getUniqueInventoryItems(data.profileData) as item (item.itemInstanceId)}
			<Item {item} />
		{/each}
	</div>
{:else if data.user}
	<p>Loading profile data...</p>
{:else}
	<p>No user data available. Please log in.</p>
{/if}
