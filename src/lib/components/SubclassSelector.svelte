<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import type { Character } from '$lib/utils/types';
    import { bngBaseUrl, warlockSubclasses, hunterSubclasses, titanSubclasses  } from '$lib/utils/helpers';
    import { getManifestData } from '$lib/utils/indexedDB';
    import type { DestinyInventoryItemDefinition } from '$lib/utils/types';

    
    let { character, onSelect } = $props<{
        character: Character;
        onSelect: (subclass: string) => void;
    }>();
    
    let subclasses = $state<{hash: number, name: string, icon: string}[]>([]);

    $effect(() => {
        loadSubclasses();
    });

    async function loadSubclasses() {
        let subclassHashes: Record<number, string>;
        switch (character.classType) {
            case 0: // Titan
                subclassHashes = titanSubclasses;
                break;
            case 1: // Hunter
                subclassHashes = hunterSubclasses;
                break;
            case 2: // Warlock
                subclassHashes = warlockSubclasses;
                break;
            default:
                console.error('Unknown class type');
                return;
        }

        const loadedSubclasses = await Promise.all(
            Object.entries(subclassHashes).map(async ([hash, name]) => {
                const definition = await getManifestData<DestinyInventoryItemDefinition>(
                    'DestinyInventoryItemDefinition',
                    parseInt(hash)
                );
                return {
                    hash: parseInt(hash),
                    name: definition?.displayProperties.name || name,
                    icon: definition?.displayProperties.icon || ''
                };
            })
        );

        subclasses = loadedSubclasses;
    }

    function handleSelect(subclassHash: number) {
        onSelect(subclassHash.toString());
    }
    </script>
    
    <div class="flex flex-wrap gap-4 justify-center">
        {#each subclasses as subclass (subclass.hash)}
            <Button
                variant="ghost"
                class="flex flex-col items-center p-2"
                on:click={() => handleSelect(subclass.hash)}
            >
                <img src={bngBaseUrl + subclass.icon} alt={subclass.name} class="w-12 h-12 mb-2" />
                <span class="text-sm font-semibold">{subclass.name}</span>
            </Button>
        {/each}
    </div>
