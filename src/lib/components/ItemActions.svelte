<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Avatar, AvatarImage } from '$lib/components/ui/avatar';
	import { equipItem, transferItem } from '$lib/utils/itemActions';
	import { findItemInInventory, bngBaseUrl } from '$lib/utils/helpers';
	import type { Character, InventoryItem, ItemInstance } from '$lib/utils/types';

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
	// $inspect('itemInstanceId :', itemInstanceId);
	// $inspect('itemInstance :', itemInstance);
	// $inspect('characters', characters);
	// $inspect('currentItemLocation', currentItemLocation);
	// $inspect('isInVault', isInVault);

	function canTransfer(character: Character): boolean {
		if (!currentItemLocation) return false;
		if (isInVault) return true;
		if (itemInstance.isEquipped) return false;
		return currentItemLocation.location !== character.characterId;
	}

	async function handleEquip(character: Character) {
		if (canEquip(character)) {
			await equipItem(itemInstanceId, character.characterId, character.membershipType);
		}
	}

	async function handleTransfer(character: Character) {
		if (!currentItemLocation) return;
		const item = currentItemLocation.item as InventoryItem;

		if (itemInstance.isEquipped) {
			await transferItem(
				item.itemHash,
				item.quantity,
				true,
				itemInstanceId,
				character.characterId,
				character.membershipType
			);
		}

		if (isInVault || canTransfer(character)) {
			await transferItem(
				item.itemHash,
				item.quantity,
				isInVault ? false : true,
				itemInstanceId,
				character.characterId,
				character.membershipType
			);
		}
	}
</script>

<div class="space-y-4">
	<div>
		<h3 class="mb-2 text-sm font-semibold">Equip Item on:</h3>
		<div class="flex space-x-2">
			{#each characters as character}
				<Button
					variant="ghost"
					size="icon"
					disabled={!canEquip(character as Character)}
					onclick={() => handleEquip(character as Character)}
				>
					<Avatar>
						<AvatarImage
							src={`${bngBaseUrl}${character.emblemPath}`}
							alt={`Equip on ${character.classType}`}
						/>
					</Avatar>
				</Button>
			{/each}
		</div>
	</div>

	<div>
		<h3 class="mb-2 text-sm font-semibold">Transfer Item to:</h3>
		<div class="flex space-x-2">
			{#each characters as character}
				<Button
					variant="ghost"
					size="icon"
					disabled={!canTransfer(character as Character)}
					onclick={() => handleTransfer(character as Character)}
				>
					<Avatar>
						<AvatarImage
							src={`${bngBaseUrl}${character.emblemPath}`}
							alt={`Transfer to ${character.classType}`}
						/>
					</Avatar>
				</Button>
			{/each}
		</div>
	</div>
</div>
