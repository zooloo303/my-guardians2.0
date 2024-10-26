<script lang="ts">
    import Item from '$lib/components/Item.svelte';
    import { bngBaseUrl } from '$lib/utils/helpers';
    import { Button } from '$lib/components/ui/button';
    import { Tooltip, TooltipTrigger, TooltipContent } from '$lib/components/ui/tooltip';
    import type { ArmorPiece, DestinyInventoryItemDefinition } from '$lib/utils/types';
    
    let { result } = $props<{
        result: {
            armorPieces: ArmorPiece[];
            mods: DestinyInventoryItemDefinition[];
            fragments: DestinyInventoryItemDefinition[];
            finalStats: { [statHash: string]: number };
        };
    }>();
    
    const statOrder = ['Mobility', 'Resilience', 'Recovery', 'Discipline', 'Intellect', 'Strength'];
    
    function calculateTotalStats() {
        const statHashes = {
            Mobility: '2996146975',
            Resilience: '392767087',
            Recovery: '1943323491',
            Discipline: '1735777505',
            Intellect: '144602215',
            Strength: '4244567218'
        };

        const totalStats = {
            Mobility: 0,
            Resilience: 0,
            Recovery: 0,
            Discipline: 0,
            Intellect: 0,
            Strength: 0
        };

        // Sum up base stats from armor pieces
        result.armorPieces.forEach(piece => {
            Object.entries(piece.stats).forEach(([statHash, statValue]) => {
                // Find which stat this hash corresponds to
                for (const [statName, hash] of Object.entries(statHashes)) {
                    if (statHash === hash) {
                        totalStats[statName] += statValue.value;
                    }
                }
            });
        });

        // Add stats from mods and fragments
        for (const [statHash, value] of Object.entries(result.finalStats || {})) {
            for (const [statName, hash] of Object.entries(statHashes)) {
                if (statHash === hash) {
                    totalStats[statName] = value;
                }
            }
        }

        console.log('Calculated total stats:', totalStats);
        return totalStats;
    }
    
    const totalStats = $derived(calculateTotalStats());
    
    const responsiveIconSize = "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10";
    </script>
    
    <div class="space-y-6">
        <h2 class="text-2xl font-bold">Optimized Armor Set</h2>
    
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {#each result.armorPieces as armorPiece}
                <div class="bg-secondary/50 rounded-lg p-4">
                    <Item item={armorPiece} />
                </div>
            {/each}
        </div>
    
        <div>
            <h3 class="text-xl font-semibold mb-2">Total Stats</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {#each statOrder as stat}
                    <div class="flex flex-col items-center">
                        <span class="font-semibold">{stat}</span>
                        <span class="text-2xl">{totalStats[stat]}</span>
                    </div>
                {/each}
            </div>
        </div>
    
        <div>
            <h3 class="text-xl font-semibold mb-2">Recommended Mods</h3>
            <div class="flex flex-wrap gap-2">
                {#each result.mods as mod}
                    <Tooltip>
                        <TooltipTrigger>
                            <img
                                src="{bngBaseUrl}{mod.displayProperties.icon}"
                                alt={mod.displayProperties.name}
                                class="{responsiveIconSize} object-contain"
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{mod.displayProperties.name}</p>
                        </TooltipContent>
                    </Tooltip>
                {/each}
            </div>
        </div>
    
        <div>
            <h3 class="text-xl font-semibold mb-2">Recommended Fragments</h3>
            <div class="flex flex-wrap gap-2">
                {#each result.fragments as fragment}
                    <Tooltip>
                        <TooltipTrigger>
                            <img
                                src="{bngBaseUrl}{fragment.displayProperties.icon}"
                                alt={fragment.displayProperties.name}
                                class="{responsiveIconSize} object-contain"
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{fragment.displayProperties.name}</p>
                        </TooltipContent>
                    </Tooltip>
                {/each}
            </div>
        </div>
    
        <div class="flex justify-center">
            <Button>Apply Loadout</Button>
        </div>
    </div>
