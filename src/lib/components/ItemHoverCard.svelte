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
		socketDefinitions: Record<number, DestinyInventoryItemDefinition>;
	}>({ itemDefinition: null, damageTypeDefinition: null, statDefinitions: {}, socketDefinitions: {} });

	$effect(() => {
		async function fetchData() {
			const [itemDef, damageDef] = await Promise.all([
				getManifestData<DestinyInventoryItemDefinition>(
						'DestinyInventoryItemDefinition',
						item.itemHash
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

			const socketDefs: Record<number, DestinyInventoryItemDefinition> = {};
			if (item.sockets?.sockets) {
				for (const socket of item.sockets.sockets) {
					if (socket.plugHash) {
						socketDefs[socket.plugHash] = await getManifestData<DestinyInventoryItemDefinition>(
							'DestinyInventoryItemDefinition',
							socket.plugHash
						);
					}
				}
			}

			itemData = {
				itemDefinition: itemDef || null,
				damageTypeDefinition: damageDef,
				statDefinitions: statDefs,
				socketDefinitions: socketDefs
			};
		}
		fetchData();
	});
</script>

<HoverCard>
	<HoverCardTrigger>
		{@render children()}
	</HoverCardTrigger>
	<HoverCardContent class="w-96 relative">
		{#if itemData.itemDefinition}
			{#if itemData.itemDefinition.screenshot}
				<div
					class="absolute inset-0 bg-cover bg-center opacity-20"
					style="background-image: url('{bngBaseUrl}{itemData.itemDefinition.screenshot}'); background-size: contain; background-repeat: no-repeat;"
				></div>
			{/if}
			<div class="relative z-10 flex flex-col space-y-3 p-4">
				<div class="flex items-center space-x-2">
					<h3 class="text-lg font-semibold">{itemData.itemDefinition.displayProperties.name}</h3>
					{#if itemData.damageTypeDefinition}
						<img
							src={`${bngBaseUrl}${itemData.damageTypeDefinition.displayProperties.icon}`}
							alt={itemData.damageTypeDefinition.displayProperties.name}
							class="h-6 w-6"
						/>
					{/if}
				</div>
				<p class="text-sm text-muted-foreground">{itemData.itemDefinition.itemTypeDisplayName}</p>
				<p class="text-sm font-medium">Power Level: {item.instance?.primaryStat?.value || 'N/A'}</p>

				{#if item.sockets?.sockets}
					<div class="flex flex-wrap gap-2">
						{#each item.sockets.sockets.filter(socket => socket.isEnabled && socket.isVisible) as socket}
							{#if itemData.socketDefinitions[socket.plugHash]}
								<Tooltip>
									<TooltipTrigger>
										<img
											src={`${bngBaseUrl}${itemData.socketDefinitions[socket.plugHash].displayProperties.icon}`}
											alt={itemData.socketDefinitions[socket.plugHash].displayProperties.name}
											class="h-8 w-8"
										/>
									</TooltipTrigger>
									<TooltipContent>
										<p>{itemData.socketDefinitions[socket.plugHash].displayProperties.name}</p>
									</TooltipContent>
								</Tooltip>
							{/if}
						{/each}
					</div>
				{/if}

				{#if item.stats}
					<div class="space-y-2">
						{#each Object.entries(item.stats) as [statHash, stat]}
							{#if itemData.statDefinitions[statHash]}
								<div class="flex items-center">
									<span class="w-28 text-sm font-medium"
										>{itemData.statDefinitions[statHash].displayProperties.name}</span
									>
									<Progress value={stat.value} max={100} class="flex-grow" />
									<span class="ml-2 text-sm">{stat.value}</span>
								</div>
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
