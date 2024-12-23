<script lang="ts">
	import { page } from '$app/stores';
	import { ClassType } from '$lib/utils/types';
	import { Button } from '$lib/components/ui/button';
	import { equipItem, transferItem } from '$lib/utils/itemActions';
	import { findItemInInventory, bngBaseUrl } from '$lib/utils/helpers';
	import type { Character, InventoryItem, ItemInstance } from '$lib/utils/types';
	import { Tooltip, TooltipTrigger, TooltipContent } from '$lib/components/ui/tooltip';

	let { itemInstanceId, itemInstance } = $props<{
		itemInstanceId: string;
		itemInstance: ItemInstance;
	}>();

	let characters = $derived(Object.values($page.data.profileData.characters));
	let currentItemLocation = $derived(
		findItemInInventory($page.data.profileData.inventoryData, itemInstanceId)
	);
	let isInVault = $derived(currentItemLocation?.location === 'vault');

	function canEquip(character: Character): boolean {
		if (!currentItemLocation) return false;
		return currentItemLocation.location === character.characterId && !itemInstance.isEquipped;
	}


	function canTransfer(character: Character): boolean {
		if (!currentItemLocation) return false;
		if (isInVault) return true;
		if (itemInstance.isEquipped) return false;
		return currentItemLocation.location !== character.characterId;
	}

	async function handleEquip(character: Character) {
		console.log('Attempting to equip item', { itemInstanceId, character });
		if (canEquip(character)) {
			try {
				const result = await equipItem(itemInstanceId, character.characterId, character.membershipType);
				console.log('Equip result:', result);
				console.log('Item equipped successfully');
			} catch (error) {
				console.error('Error equipping item:', error);
			}
		} else {
			console.log('Cannot equip item', { canEquip: canEquip(character) });
		}
	}

	async function handleTransfer(character: Character) {
		console.log('Attempting to transfer item', { itemInstanceId, character });
		if (!currentItemLocation) return;
		const item = currentItemLocation.item as InventoryItem;

		try {
			if (itemInstance.isEquipped) {
				const result = await transferItem(
					item.itemHash,
					item.quantity,
					true,
					itemInstanceId,
					character.characterId,
					character.membershipType
				);
				console.log('Transfer result for equipped item:', result);
			}

			if (isInVault || canTransfer(character)) {
				const result = await transferItem(
					item.itemHash,
					item.quantity,
					isInVault ? false : true,
					itemInstanceId,
					character.characterId,
					character.membershipType
				);
				console.log('Transfer result:', result);
			} else {
				console.log('Cannot transfer item', { isInVault, canTransfer: canTransfer(character) });
			}
		} catch (error) {
			console.error('Error transferring item:', error);
		}
	}
</script>

<div class="space-y-4">
	<div>
		<h3 class="mb-2 text-sm font-semibold">Equip Item on:</h3>
		<div class="flex space-x-2">
			{#each characters as character}
				<Tooltip>
					<TooltipTrigger>
						<Button
							variant="ghost"
							size="icon"
							disabled={!canEquip(character as Character)}
							onclick={() => handleEquip(character as Character)}
							class="relative p-0 h-8 w-8 overflow-hidden"
						>
							<img
								src={`${bngBaseUrl}${character.emblemPath}`}
								alt={`Equip on ${ClassType[character.classType]}`}
								class="w-full h-full object-cover"
							/>
							<span class="sr-only">Equip on {ClassType[character.classType]}</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Equip on {ClassType[character.classType]}</p>
					</TooltipContent>
				</Tooltip>
			{/each}
		</div>
	</div>

	<div>
		<h3 class="mb-2 text-sm font-semibold">Transfer Item to:</h3>
		<div class="flex space-x-2">
			{#each characters as character}
				<Tooltip>
					<TooltipTrigger>
						<Button
							variant="ghost"
							size="icon"
							disabled={!canTransfer(character as Character)}
							onclick={() => handleTransfer(character as Character)}
							class="relative p-0 h-8 w-8 overflow-hidden"
						>
							<img
								src={`${bngBaseUrl}${character.emblemPath}`}
								alt={`Transfer to ${ClassType[character.classType]}`}
								class="w-full h-full object-cover"
							/>
							<span class="sr-only">Transfer to {ClassType[character.classType]}</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Transfer to {ClassType[character.classType]}</p>
					</TooltipContent>
				</Tooltip>
			{/each}
		</div>
	</div>
</div>
