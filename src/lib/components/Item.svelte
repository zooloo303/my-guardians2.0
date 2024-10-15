<script lang="ts">
	import { bngBaseUrl } from '$lib/utils/helpers';
	import { getManifestData } from '$lib/utils/indexedDB';
	import { Card, CardContent } from '$lib/components/ui/card';
	import ItemHoverCard from '$lib/components/ItemHoverCard.svelte';
	import type {
		SUBCLASS_BUCKET_HASH,
		InventoryItemWithComponents,
		DestinyInventoryItemDefinition,
		DestinyDamageTypeDefinition
	} from '$lib/utils/types';

	// props
	let { item } = $props<{ item: InventoryItemWithComponents }>();

	// state
	let itemData = $state<{
		itemDefinition: DestinyInventoryItemDefinition | undefined;
		damageTypeDefinition: DestinyDamageTypeDefinition | undefined;
		powerLevel: number | undefined;
	}>({ itemDefinition: undefined, damageTypeDefinition: undefined, powerLevel: undefined });

	$effect(() => {
		async function fetchData() {
			const [itemDef, damageDef] = await Promise.all([
				getManifestData<DestinyInventoryItemDefinition>(
					'DestinyInventoryItemDefinition',
					item.displayItemHash
				),
				item.instance?.damageTypeHash
					? getManifestData<DestinyDamageTypeDefinition>(
							'DestinyDamageTypeDefinition',
							item.instance.damageTypeHash
						)
					: undefined
			]);

			itemData = {
				itemDefinition: itemDef,
				damageTypeDefinition: damageDef,
				powerLevel: item.instance?.primaryStat?.value
			};
		}
		fetchData();
	});

	function getItemStateClass(state: number): string {
		const baseClass = 'border border-gray-700 shadow-sm';
		if (state & 4) return `${baseClass} shadow-inner shadow-orange-500/50`; // Masterwork
		if (state & 8) return `${baseClass} shadow-inner shadow-red-500/50`; // Crafted
		if (state & 16) return `${baseClass} shadow-inner shadow-green-500/50`; // HighlightedObjective
		if (state & 1) return `${baseClass} shadow-inner shadow-blue-500/50`; // Locked
		if (state & 2) return `${baseClass} shadow-inner shadow-yellow-500/50`; // Tracked
		return baseClass; // Default state
	}
</script>

<ItemHoverCard {item}>
	<Card class={`w-full ${getItemStateClass(item.state)}`}>
		<CardContent class="flex flex-col items-center p-1">
			{#if itemData.itemDefinition}
				<img
					src={`${bngBaseUrl}${itemData.itemDefinition.displayProperties.icon}`}
					alt={itemData.itemDefinition.displayProperties.name}
					class="mb-1 h-12 w-12"
				/>
				<h3 class="w-full break-words text-center text-xs font-semibold">
					{itemData.itemDefinition.displayProperties.name}
				</h3>
				<div class="mt-2 flex items-center text-xs">
					{#if itemData.damageTypeDefinition}
						<img
							src={`${bngBaseUrl}${itemData.damageTypeDefinition.displayProperties.icon}`}
							alt={itemData.damageTypeDefinition.displayProperties.name}
							class="mr-2 h-4 w-4"
						/>
					{/if}
					{#if itemData.powerLevel !== undefined && itemData.powerLevel !== 1}
						<span>{itemData.powerLevel}</span>
					{/if}
				</div>
			{:else}
				<div class="mb-1 h-12 w-12 animate-pulse bg-gray-300"></div>
				<div class="h-4 w-3/4 animate-pulse bg-gray-300"></div>
			{/if}
		</CardContent>
	</Card>
</ItemHoverCard>
