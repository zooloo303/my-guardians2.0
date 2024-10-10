<script lang="ts">
    import { bngBaseUrl } from '$lib/utils/helpers';
    import { getManifestData } from '$lib/utils/indexedDB';
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { InventoryItem, DestinyInventoryItemDefinition } from '$lib/utils/types';
    //props
	let { item } = $props<{ item: InventoryItem }>();
    //state
	let itemDefinition = $state<DestinyInventoryItemDefinition | undefined>(undefined);
        
	$effect(() => {
		async function fetchItemDefinition() {
			itemDefinition = await getManifestData<DestinyInventoryItemDefinition>('DestinyInventoryItemDefinition', item.itemHash);
		}
		fetchItemDefinition();
	});
</script>

<Card class="w-64">
	<CardContent class="flex flex-col items-center p-4">
		{#if itemDefinition}
			<img 
				src={`${bngBaseUrl}${itemDefinition.displayProperties.icon}`} 
				alt={itemDefinition.displayProperties.name} 
				class="w-16 h-16 mb-2"
			/>
			<h3 class="text-lg font-semibold text-center">{itemDefinition.displayProperties.name}</h3>
		{:else}
			<div class="w-16 h-16 mb-2 bg-gray-300 animate-pulse"></div>
			<div class="h-6 w-3/4 bg-gray-300 animate-pulse"></div>
		{/if}
	</CardContent>
</Card>

