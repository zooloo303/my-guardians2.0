<script lang="ts">
	import { page } from '$app/stores';
	import Item from '$lib/components/Item.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getManifestData } from '$lib/utils/indexedDB';
	import { Button, ProgressButton } from '$lib/components/ui/button';
	import { bngBaseUrl, findItemInInventory } from '$lib/utils/helpers';
    import { Tooltip, TooltipTrigger, TooltipContent } from '$lib/components/ui/tooltip';
	import { equipLoadout, clearLoadout, snapshotLoadout } from '$lib/utils/loadoutActions';
	import type {
		Loadout,
		LoadoutItem,
		Character,
		DestinyLoadoutColorDefinition,
		DestinyLoadoutIconDefinition,
		DestinyLoadoutNameDefinition,
        LoadoutItemWithComponents,
		DestinyInventoryItemDefinition
	} from '$lib/utils/types';
	
	
	let {
		loadout,
		loadoutIndex,
		character,
		open = $bindable()
	} = $props<{
		loadout: Loadout;
		loadoutIndex: number;
		
		character: Character;
		open: boolean;
	}>();

	let loadoutDetails = $state<{
		color: string;
		icon: string;
		name: string;
		
		items: LoadoutItemWithComponents[];
		plugItemDefinitions: Record<number, DestinyInventoryItemDefinition>;
	}>({
		color: '',
		icon: '',
		name: '',
		items: [],
		plugItemDefinitions: {}
	});
	let inventoryData = $derived($page.data.profileData.inventoryData);

	$effect(() => {
		async function fetchLoadoutDetails() {
			const [colorDef, iconDef, nameDef] = await Promise.all([
				getManifestData<DestinyLoadoutColorDefinition>(
					'DestinyLoadoutColorDefinition',
					loadout.colorHash
				),
				getManifestData<DestinyLoadoutIconDefinition>(
					'DestinyLoadoutIconDefinition',
					loadout.iconHash
				),
				getManifestData<DestinyLoadoutNameDefinition>(
					'DestinyLoadoutNameDefinition',
					loadout.nameHash
				)
			]);
			const itemDetails = await Promise.all(
				loadout.items.map(async (loadoutItem: LoadoutItem) => {
					const foundItem = findItemInInventory(inventoryData, loadoutItem.itemInstanceId);
					if (foundItem && foundItem.item.itemHash) {
						const itemDef = await getManifestData<DestinyInventoryItemDefinition>(
							'DestinyInventoryItemDefinition',
							foundItem.item.itemHash
						);

						// Fetch plug item definitions
						const plugItemDefs = await Promise.all(
							loadoutItem.plugItemHashes.map(async (hash) => {
								return await getManifestData<DestinyInventoryItemDefinition>(
									'DestinyInventoryItemDefinition',
									hash
								);
							})
						);

						return {
							...foundItem,
							instance: inventoryData.itemComponents.instances.data[loadoutItem.itemInstanceId],
							stats: inventoryData.itemComponents.stats.data[loadoutItem.itemInstanceId]?.stats,
							sockets: inventoryData.itemComponents.sockets.data[loadoutItem.itemInstanceId],
							itemHash: foundItem.item.itemHash,
							displayItemHash: foundItem.item.itemHash,
							plugItemHashes: loadoutItem.plugItemHashes,
							name: itemDef?.displayProperties.name,
							icon: itemDef?.displayProperties.icon,
							plugItemDefinitions: plugItemDefs.reduce((acc, def) => {
								if (def) acc[def.hash] = def;
								return acc;
							}, {} as Record<number, DestinyInventoryItemDefinition>)
						};
					}
					console.warn('Item not found in inventory:', loadoutItem);
					return loadoutItem;
				})
			);

			loadoutDetails = {
				color: colorDef?.colorImagePath || '',
				icon: iconDef?.iconImagePath || '',
				name: nameDef?.name || '',
				items: itemDetails,
				plugItemDefinitions: itemDetails.reduce((acc, item) => {
					if ('plugItemDefinitions' in item) {
						Object.assign(acc, item.plugItemDefinitions);
					}
					return acc;
				}, {} as Record<number, DestinyInventoryItemDefinition>)
			};
		}

		if (open) {
			fetchLoadoutDetails();
		}
	});

	async function handleEquipLoadout() {
		await equipLoadout(loadoutIndex, character.characterId, character.membershipType);
		open = false;
	}

	async function handleClearLoadout() {
		await clearLoadout(loadoutIndex, character.characterId, character.membershipType);
		open = false;
	}

	async function handleSnapshotLoadout() {
		await snapshotLoadout(
			loadoutIndex,
			character.characterId,
			character.membershipType,
			loadout.colorHash,
			loadout.iconHash,
			loadout.nameHash
		);
		open = false;
	}

	const responsiveIconSize = "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10";
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] max-h-[90vh] overflow-y-auto">
		<div class="grid gap-4 py-4">
			<div class="flex items-center space-x-4">
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full"
					style="background-image: url('{bngBaseUrl}{loadoutDetails.color}'); background-size: cover;"
				>
					<img
						src="{bngBaseUrl}{loadoutDetails.icon}"
						alt={loadoutDetails.name}
						class="h-12 w-12"
					/>
				</div>
				<h2 class="text-2xl font-bold">{loadoutDetails.name}</h2>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{#each loadoutDetails.items as item}
					<div class="flex flex-col items-center bg-secondary/50 rounded-lg p-2">
						<Item {item} />
						<div class="flex flex-wrap justify-center mt-2 gap-1">
							{#each item.plugItemHashes as plugHash}
								{#if loadoutDetails.plugItemDefinitions[plugHash]}
									<Tooltip>
										<TooltipTrigger>
											<img
												src="{bngBaseUrl}{loadoutDetails.plugItemDefinitions[plugHash].displayProperties.icon}"
												alt={loadoutDetails.plugItemDefinitions[plugHash].displayProperties.name}
												class="{responsiveIconSize} object-contain"
											/>
										</TooltipTrigger>
										<TooltipContent>
											<p>{loadoutDetails.plugItemDefinitions[plugHash].displayProperties.name}</p>
										</TooltipContent>
									</Tooltip>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<Dialog.Footer>
			<Button onclick={handleEquipLoadout} variant="default">Equip Loadout</Button>
			<ProgressButton 
			  onclick={handleSnapshotLoadout} 
			  variant="default" 
			  duration={1000}
			>
			  Overwrite Loadout
			</ProgressButton>
			<ProgressButton 
			  onclick={handleClearLoadout} 
			  variant="destructive"
			  duration={2000} 
			  >
			  Clear Loadout
			</ProgressButton>
			<Dialog.Close>
			  <Button variant="outline">Close</Button>
			</Dialog.Close>
		  </Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
