<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { UserData, ProfileData } from '$lib/utils/types';
	import MembershipCard from '$lib/components/MembershipCard.svelte';

	let { data } = $props<{ data: { user: UserData | null; profileData: ProfileData } }>();
	let isLoading = $state(true);

	$effect(() => {
		if (data.user !== null && data.profileData !== undefined) {
			isLoading = false;
		}
	});
	console.log(data);
</script>

{#if isLoading}
	<Skeleton />
{:else if data.user}
	<MembershipCard user={data.user} />
{:else}
	<p>No user data available. Please log in.</p>
{/if}
