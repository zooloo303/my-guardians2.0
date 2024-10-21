<script lang="ts">
	import { page } from '$app/stores';
	import Item from '$lib/components/Item.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getManifestData } from '$lib/utils/indexedDB';
	import { bngBaseUrl, findItemInInventory } from '$lib/utils/helpers';
	import { equipLoadout, clearLoadout } from '$lib/utils/loadoutActions';
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
}>({
  color: '',
  icon: '',
  name: '',
  items: []
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
						return {
							...foundItem,
							instance: inventoryData.itemComponents.instances.data[loadoutItem.itemInstanceId],
							stats: inventoryData.itemComponents.stats.data[loadoutItem.itemInstanceId]?.stats,
							sockets: inventoryData.itemComponents.sockets.data[loadoutItem.itemInstanceId],
							itemHash: foundItem.item.itemHash,
                            displayItemHash: foundItem.item.itemHash,
							plugItemHashes: loadoutItem.plugItemHashes,
							name: itemDef?.displayProperties.name,
							icon: itemDef?.displayProperties.icon
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
				items: itemDetails
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
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Loadout Details</Dialog.Title>
			<Dialog.Description>View and manage your loadout</Dialog.Description>
		</Dialog.Header>
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
			<div class="grid grid-cols-3 gap-2">
				{#each loadoutDetails.items as item}
					<Item {item} />
				{/each}
			</div>
		</div>
		<Dialog.Footer>
			<Button onclick={handleEquipLoadout}>Equip Loadout</Button>
			<Button onclick={handleClearLoadout} variant="destructive">Clear Loadout</Button>
			<Dialog.Close>
				<Button variant="outline">Close</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
