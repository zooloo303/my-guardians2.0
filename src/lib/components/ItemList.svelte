<script lang="ts">
	import Item from '$lib/components/Item.svelte';
	import ItemSearch from '$lib/components/ItemSearch.svelte';
	import { getUniqueInventoryItems } from '$lib/utils/helpers';
	import { getManifestData } from '$lib/utils/indexedDB';
	import type { ProfileData, InventoryItemWithComponents, DestinyInventoryItemDefinition, SearchCriteria } from '$lib/utils/types';

	// Props
	let { profileData } = $props<{ profileData: ProfileData }>();

	// Derived state
	let items = $derived(getUniqueInventoryItems(profileData));

	// State for filtered items
	let filteredItems = $state(items);

	// Search function
	async function handleSearch(criteria: SearchCriteria) {
		filteredItems = await Promise.all(items.map(async (item) => {
			const itemDef = await getManifestData<DestinyInventoryItemDefinition>(
				'DestinyInventoryItemDefinition',
				item.itemHash
			);
			if (!itemDef) return null;

			const matchesName = !criteria.itemName || itemDef.displayProperties.name.toLowerCase().includes(criteria.itemName.toLowerCase());
			const matchesItemType = !criteria.itemType || itemDef.itemType === criteria.itemType;
			const matchesDamageType = !criteria.damageType || item.instance?.damageType === criteria.damageType;
			const matchesBucketType = !criteria.bucketType || item.bucketHash === criteria.bucketType;
			const matchesTierType = !criteria.tierType || itemDef.inventory?.tierType === criteria.tierType;

			return matchesName && matchesItemType && matchesDamageType && matchesBucketType && matchesTierType ? item : null;
		}));
		filteredItems = filteredItems.filter((item): item is InventoryItemWithComponents => item !== null);
	}
</script>

<div class="space-y-4">
	<ItemSearch onSearch={handleSearch} />

	<div class="grid grid-cols-2 gap-1 p-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
		{#each filteredItems as item (item.itemInstanceId)}
			<Item {item} />
		{/each}
	</div>
</div>
