<script lang="ts">
    import { page } from '$app/stores';
    import { Button } from '$lib/components/ui/button';
    import type { Character, ArmorPiece } from '$lib/utils/types';
    import { bngBaseUrl, getArmorForClass } from '$lib/utils/helpers';
    import * as Drawer from '$lib/components/ui/drawer';

    let { character, onSelect } = $props<{
        character: Character;
        onSelect: (exotic: ArmorPiece) => void;
    }>();

    let exoticArmor = $state<ArmorPiece[]>([]);
    let selectedExotic = $state<ArmorPiece | null>(null);
    let isDrawerOpen = $state(false);

    $effect(() => {
        loadExoticArmor();
    });

    async function loadExoticArmor() {
        const inventoryData = $page.data.profileData.inventoryData;
        exoticArmor = await getArmorForClass(inventoryData, character.classType, 6);
    }

    function handleSelect(exotic: ArmorPiece) {
        selectedExotic = exotic;
        onSelect(exotic);
        isDrawerOpen = false;
    }

    function openDrawer() {
        isDrawerOpen = true;
    }
</script>

<div class="flex justify-center">
    {#if selectedExotic}
        <Button
            variant="ghost"
            class="flex flex-col items-center p-2"
            onclick={openDrawer}
        >
            <img src={bngBaseUrl + selectedExotic.icon} alt={selectedExotic.name} class="w-12 h-12 mb-2" />
            <span class="text-sm font-semibold text-center">{selectedExotic.name}</span>
        </Button>
    {:else}
        <Button onclick={openDrawer}>
            Select Exotic Armor
        </Button>
    {/if}
</div>

<Drawer.Root bind:open={isDrawerOpen}>
    <Drawer.Content class="h-[95vh]">
        <Drawer.Header>
            <Drawer.Title>Select Exotic Armor</Drawer.Title>
        </Drawer.Header>
        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 overflow-y-auto">
            {#each exoticArmor as exotic (exotic.itemInstanceId)}
                <Button
                    variant="ghost"
                    class="flex flex-col items-center p-2 h-auto"
                    onclick={() => handleSelect(exotic)}
                >
                    <img src={bngBaseUrl + exotic.icon} alt={exotic.name} class="w-12 h-12 mb-2" />
                    <span class="text-sm font-semibold text-center">{exotic.name}</span>
                </Button>
            {/each}
        </div>
    </Drawer.Content>
</Drawer.Root>
