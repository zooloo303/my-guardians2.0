<script lang="ts">
import { page } from '$app/stores';
import { optimizeArmor } from '$lib/utils/armorOptimizer';
import SubclassSelector from './SubclassSelector.svelte';
import CharacterSelector from './CharacterSelector.svelte';
import ExoticArmorSelector from './ExoticArmorSelector.svelte';
import StatPrioritySelector from './StatPrioritySelector.svelte';
import type { Character, Loadout, ArmorPiece } from '$lib/utils/types';

// We'll import our sub-components here
// import OptimizationResult from './OptimizationResult.svelte';

let selectedCharacter = $state<Character | null>(null);
let selectedSubclass = $state<string | null>(null);
let selectedExotic = $state<ArmorPiece | null>(null);
let statPriority = $state<string[]>([]);
let optimizationResult = $state<Loadout | null>(null);

let characters = $derived($page.data.profileData.characters);
let inventoryData = $derived($page.data.profileData.inventoryData);

function handleCharacterSelect(character: Character) {
    selectedCharacter = character;
    // Reset other selections when character changes
    selectedSubclass = null;
    selectedExotic = null;
    statPriority = [];
    optimizationResult = null;
}

function handleSubclassSelect(subclassHash: string) {
    selectedSubclass = subclassHash;
    // Reset subsequent selections
    selectedExotic = null;
    statPriority = [];
    optimizationResult = null;
}

function handleExoticSelect(exotic: ArmorPiece) {
    selectedExotic = exotic;
    // Reset subsequent selections
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
        statPriority,
        
    );
}
</script>

<div class="armor-optimizer space-y-8 p-4">
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
                character={selectedCharacter} 
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
            <button 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onclick={handleOptimizeArmor}
            >
                Optimize Armor
            </button>
        </section>
    {/if}
    
    {#if optimizationResult}
        <section class="space-y-4">
            <h2 class="text-xl font-semibold">Optimization Result</h2>
            <!-- <OptimizationResult result={optimizationResult} /> -->
        </section>
    {/if}
</div>
