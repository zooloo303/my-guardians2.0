<script lang="ts">
import { page } from '$app/stores';
import { Button } from '$lib/components/ui/button';
import { optimizeArmor } from '$lib/utils/armorOptimizer';
import SubclassSelector from '$lib/components/SubclassSelector.svelte';
import CharacterSelector from '$lib/components/CharacterSelector.svelte';
import OptimizationResult from '$lib/components/OptimizationResult.svelte';
import ExoticArmorSelector from '$lib/components/ExoticArmorSelector.svelte';
import StatPrioritySelector from '$lib/components/StatPrioritySelector.svelte';
import type { Character, Loadout, InventoryItemWithComponents } from '$lib/utils/types';

let selectedCharacter = $state<Character | null>(null);
let selectedSubclass = $state<string | null>(null);
let selectedExotic = $state<InventoryItemWithComponents | null>(null);
let statPriority = $state<string[]>([]);
let optimizationResult = $state<Loadout | null>(null);

let characters = $derived($page.data.profileData.characters);
let inventoryData = $derived($page.data.profileData.inventoryData);

function handleCharacterSelect(character: Character) {
    selectedCharacter = character;
    selectedSubclass = null;
    selectedExotic = null;
    statPriority = [];
    optimizationResult = null;
}

function handleSubclassSelect(subclassHash: string) {
    selectedSubclass = subclassHash;
    selectedExotic = null;
    statPriority = [];
    optimizationResult = null;
}

function handleExoticSelect(exotic: InventoryItemWithComponents) {
    selectedExotic = exotic;
    statPriority = [];
    optimizationResult = null;
}

function handleStatPriorityChange(priorities: string[]) {
    statPriority = priorities;
    optimizationResult = null;
}

async function handleOptimizeArmor() {
    if (!selectedCharacter || !selectedSubclass || !selectedExotic || statPriority.length === 0) {
        // Show an error or alert that all selections are required
        return;
    }

    optimizationResult = await optimizeArmor(
        inventoryData,
        selectedCharacter.classType,
        selectedSubclass,
        selectedExotic,
        statPriority
    );
}
</script>

<div class="flex h-full">
    <!-- Left column: Selectors -->
    <div class="w-1/2 p-4 space-y-8 overflow-y-auto">
        <h1 class="text-3xl font-bold text-center mb-6">Armor Optimizer</h1>
        
        <section class="space-y-4">
            <h2 class="text-xl font-semibold">1. Select Character</h2>
            <CharacterSelector characters={characters} onSelect={handleCharacterSelect} />
        </section>
        
        {#if selectedCharacter}
            <section class="space-y-4">
                <h2 class="text-xl font-semibold">2. Select Subclass</h2>
                <SubclassSelector character={selectedCharacter} onSelect={handleSubclassSelect} />
            </section>
        {/if}
        
        {#if selectedSubclass}
            <section class="space-y-4">
                <h2 class="text-xl font-semibold">3. Select Exotic Armor</h2>
                <ExoticArmorSelector 
                    character={selectedCharacter!} 
                    onSelect={handleExoticSelect} 
                />
            </section>
        {/if}
        
        {#if selectedExotic}
            <section class="space-y-4">
                <h2 class="text-xl font-semibold">4. Set Stat Priorities</h2>
                <StatPrioritySelector onPrioritiesChange={handleStatPriorityChange} />
            </section>
        {/if}
        
        {#if statPriority.length > 0}
            <section class="text-center">
                <Button 
                    onclick={handleOptimizeArmor}
                >
                    Optimize Armor
                </Button>
            </section>
        {/if}
    </div>

    <!-- Right column: Results -->
    <div class="w-1/2 p-4 overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4">Optimization Result</h2>
        {#if optimizationResult}
            <OptimizationResult result={optimizationResult} />
        {:else}
            <p class="text-center text-gray-500">No optimization result yet. Configure your options and click "Optimize Armor" to see results.</p>
        {/if}
    </div>
</div>
