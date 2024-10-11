<script lang="ts">
	import type { ProfileData } from '$lib/utils/types';
	import Item from '$lib/components/Item.svelte';
	import { getUniqueInventoryItems } from '$lib/utils/helpers';

	let { profileData } = $props<{ profileData: ProfileData }>();

	let items = $derived(getUniqueInventoryItems(profileData));
</script>

<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each items as item (item.itemInstanceId)}
		<Item {item} />
	{/each}
</div>
