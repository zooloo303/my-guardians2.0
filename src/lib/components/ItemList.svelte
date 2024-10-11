<script lang="ts">
	import type { ProfileData } from '$lib/utils/types';
	import Item from '$lib/components/Item.svelte';
	import { getUniqueInventoryItems } from '$lib/utils/helpers';
	//state
	let { profileData } = $props<{ profileData: ProfileData }>();
	//derived
	let items = $derived(getUniqueInventoryItems(profileData));
	$inspect("items", items);
</script>

<div class="grid grid-cols-2 gap-1 p-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
	{#each items as item (item.itemInstanceId)}
		<Item {item} />
	{/each}
</div>
