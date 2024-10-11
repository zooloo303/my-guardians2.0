<script lang="ts">
	import { HoverCard, HoverCardContent, HoverCardTrigger } from '$lib/components/ui/hover-card';
	import { Progress } from '$lib/components/ui/progress';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { getManifestData } from '$lib/utils/indexedDB';
	import { bngBaseUrl } from '$lib/utils/helpers';
	import type {
		InventoryItemWithComponents,
		DestinyInventoryItemDefinition,
		DestinyDamageTypeDefinition,
		DestinyStatDefinition
	} from '$lib/utils/types';
	import type { Snippet } from 'svelte';

	let {
		item,
		children
	}: {
		item: InventoryItemWithComponents;
		children: Snippet;
	} = $props();

	let itemData = $state<{
		itemDefinition: DestinyInventoryItemDefinition | null;
		damageTypeDefinition: DestinyDamageTypeDefinition | null;
		statDefinitions: Record<string, DestinyStatDefinition>;
	}>({ itemDefinition: null, damageTypeDefinition: null, statDefinitions: {} });

	let socketDefinitions = $state<Record<string, DestinyInventoryItemDefinition>>({});

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
					: null
			]);

			const statDefs: Record<string, DestinyStatDefinition> = {};
			if (item.stats) {
				for (const statHash of Object.keys(item.stats)) {
					statDefs[statHash] = await getManifestData<DestinyStatDefinition>(
						'DestinyStatDefinition',
						parseInt(statHash)
					);
				}
			}

			// Fetch socket definitions
			const socketDefs: Record<string, DestinyInventoryItemDefinition> = {};
			if (itemDef && itemDef.sockets && itemDef.sockets.socketEntries) {
				for (const socket of itemDef.sockets.socketEntries) {
					if (socket.singleInitialItemHash) {
						socketDefs[socket.singleInitialItemHash] = await getManifestData<DestinyInventoryItemDefinition>(
							'DestinyInventoryItemDefinition',
							socket.singleInitialItemHash
						);
					}
				}
			}

			itemData = {
				itemDefinition: itemDef || null,
				damageTypeDefinition: damageDef,
				statDefinitions: statDefs
			};
			socketDefinitions = socketDefs;
		}
		fetchData();
	});
</script>

	<HoverCard>
	<HoverCardTrigger>
		{@render children()}
	</HoverCardTrigger>
		<HoverCardContent class="w-80">
		{#if itemData.itemDefinition}
			<div class="flex flex-col space-y-2">
				<h3 class="text-lg font-semibold">{itemData.itemDefinition.displayProperties.name}</h3>
				<p class="text-sm text-muted-foreground">{itemData.itemDefinition.itemTypeDisplayName}</p>
				<p class="text-sm">Power Level: {item.instance?.primaryStat?.value || 'N/A'}</p>

				{#if itemData.itemDefinition.screenshot}
					<img
						src={`${bngBaseUrl}${itemData.itemDefinition.screenshot}`}
						alt="Item Screenshot"
						class="rounded-md"
					/>
				{/if}

				{#if item.stats}
					<div class="space-y-1">
						{#each Object.entries(item.stats) as [statHash, stat]}
							{#if itemData.statDefinitions[statHash]}
								<div class="flex items-center">
									<span class="w-24 text-sm"
										>{itemData.statDefinitions[statHash].displayProperties.name}</span
									>
									<Progress value={stat.value} max={100} class="flex-grow" />
									<span class="ml-2 text-sm">{stat.value}</span>
								</div>
							{/if}
						{/each}
					</div>
				{/if}

				{#if itemData.itemDefinition.sockets?.socketEntries}
					<div class="flex space-x-2">
						{#each itemData.itemDefinition.sockets.socketEntries as socket}
							{#if socket.singleInitialItemHash && socketDefinitions[socket.singleInitialItemHash]}
								<Tooltip>
									<TooltipTrigger>
										<img
											src={`${bngBaseUrl}${socketDefinitions[socket.singleInitialItemHash].displayProperties.icon}`}
											alt={socketDefinitions[socket.singleInitialItemHash].displayProperties.name}
											class="h-6 w-6"
										/>
									</TooltipTrigger>
									<TooltipContent>
										<p>{socketDefinitions[socket.singleInitialItemHash].displayProperties.name}</p>
									</TooltipContent>
								</Tooltip>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<p>Loading item data...</p>
		{/if}
	</HoverCardContent>
</HoverCard>