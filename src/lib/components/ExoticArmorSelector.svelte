<script lang="ts">
    import { page } from '$app/stores';
    import { Button } from '$lib/components/ui/button';
    import type { Character, ArmorPiece } from '$lib/utils/types';
    import { bngBaseUrl, getArmorForClass } from '$lib/utils/helpers';
    
    let { character, onSelect } = $props<{
        character: Character;
        onSelect: (exotic: ArmorPiece) => void;
    }>();
    
    let exoticArmor = $state<ArmorPiece[]>([]);
    
    $effect(() => {
        loadExoticArmor();
    });
    
    async function loadExoticArmor() {
        const inventoryData = $page.data.profileData.inventoryData;
        exoticArmor = await getArmorForClass(inventoryData, character.classType, 6);
    }
    
    function handleSelect(exotic: ArmorPiece) {
        onSelect(exotic);
    }
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {#each exoticArmor as exotic (exotic.itemInstanceId)}
        <Button
            variant="ghost"
            class="flex flex-col items-center p-2"
            on:click={() => handleSelect(exotic)}
        >
            <img src={bngBaseUrl + exotic.icon} alt={exotic.name} class="w-10 h-10 mb-2" />
            <span class="text-sm font-semibold text-center">{exotic.name}</span>
        </Button>
    {/each}
</div>
