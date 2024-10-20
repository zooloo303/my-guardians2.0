<script lang="ts">
    import { getManifestData } from '$lib/utils/indexedDB';
    import type { Loadout, Character, DestinyLoadoutColorDefinition, DestinyLoadoutIconDefinition, DestinyLoadoutNameDefinition, DestinyInventoryItemDefinition } from '$lib/utils/types';
    import { bngBaseUrl } from '$lib/utils/helpers';
    import Item from '$lib/components/Item.svelte';
    import * as Dialog from '$lib/components/ui/dialog';
    import { Button } from '$lib/components/ui/button';
    import { equipLoadout, clearLoadout } from '$lib/utils/loadoutActions';

    let { loadout, loadoutIndex, character, open = $bindable() } = $props<{ 
        loadout: Loadout; 
        loadoutIndex: number;
        character: Character;
        open: boolean;
    }>();

    let loadoutDetails = $state({
        color: '',
        icon: '',
        name: '',
        items: []
    });

    $effect(() => {
        async function fetchLoadoutDetails() {
            const [colorDef, iconDef, nameDef] = await Promise.all([
                getManifestData<DestinyLoadoutColorDefinition>('DestinyLoadoutColorDefinition', loadout.colorHash),
                getManifestData<DestinyLoadoutIconDefinition>('DestinyLoadoutIconDefinition', loadout.iconHash),
                getManifestData<DestinyLoadoutNameDefinition>('DestinyLoadoutNameDefinition', loadout.nameHash)
            ]);

            const itemDetails = await Promise.all(loadout.items.map(async (item) => {
                const itemDef = await getManifestData<DestinyInventoryItemDefinition>('DestinyInventoryItemDefinition', item.itemInstanceId);
                return {
                    ...item,
                    name: itemDef?.displayProperties.name,
                    icon: itemDef?.displayProperties.icon
                };
            }));

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
            <Dialog.Description>
                View and manage your loadout
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="flex items-center space-x-4">
                <div 
                    class="w-16 h-16 rounded-full flex items-center justify-center"
                    style="background-image: url('{bngBaseUrl}{loadoutDetails.color}'); background-size: cover;"
                >
                    <img src="{bngBaseUrl}{loadoutDetails.icon}" alt="{loadoutDetails.name}" class="w-12 h-12" />
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
