<script lang="ts">
    import { Plus } from 'lucide-svelte';
    import { toast } from "svelte-sonner";
    import type { Character } from '$lib/utils/types';
    import { Button } from "$lib/components/ui/button";
    import LoadoutDetails from './LoadoutDetails.svelte';
    import { getManifestData } from '$lib/utils/indexedDB';
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { Card, CardContent } from "$lib/components/ui/card";
    import { snapshotLoadout } from '$lib/utils/loadoutActions';
    import { bngBaseUrl, itemPlaceHolder } from '$lib/utils/helpers';
    import { Tooltip, TooltipTrigger, TooltipContent } from '$lib/components/ui/tooltip';
    import type { 
        Loadout, 
        DestinyLoadoutColorDefinition, 
        DestinyLoadoutIconDefinition, 
        DestinyLoadoutNameDefinition 
    } from '$lib/utils/types';
    //props
    let { characters, loadouts } = $props<{ 
        characters: Record<string, Character>, 
        loadouts: Record<string, { loadouts: Loadout[] }> 
    }>();
    $inspect(loadouts);
    //state
    let selectedLoadout = $state<Loadout | null>(null);
    let selectedLoadoutIndex = $state<number | null>(null);
    let selectedCharacter = $state<Character | null>(null);
    let isDialogOpen = $state(false);

    const MAX_LOADOUTS = 12;
    const DEFAULT_COLOR_HASH = 1677044030; // Default color
    const DEFAULT_ICON_HASH = 797343696; // Default icon
    const DEFAULT_NAME_HASH = 752612103; // Default name

    async function getLoadoutDetails(loadout: Loadout) {
        const [colorDef, iconDef, nameDef] = await Promise.all([
            getManifestData<DestinyLoadoutColorDefinition>('DestinyLoadoutColorDefinition', loadout.colorHash),
            getManifestData<DestinyLoadoutIconDefinition>('DestinyLoadoutIconDefinition', loadout.iconHash),
            getManifestData<DestinyLoadoutNameDefinition>('DestinyLoadoutNameDefinition', loadout.nameHash)
        ]);
        return {
            color: colorDef?.colorImagePath,
            icon: iconDef?.iconImagePath,
            name: nameDef?.name
        };
    }

    function handleLoadoutClick(loadout: Loadout, character: Character, index: number) {
        selectedLoadout = loadout;
        selectedLoadoutIndex = index;
        selectedCharacter = character;
        isDialogOpen = true;
    }

    async function handleAddLoadout(characterId: string, index: number) {
        const character = characters[characterId];
        try {
            await snapshotLoadout(
                character.characterId, 
                character.membershipType, 
                index, 
                DEFAULT_COLOR_HASH, 
                DEFAULT_ICON_HASH, 
                DEFAULT_NAME_HASH
            );
            toast.success("New loadout created successfully");
        } catch (error) {
            console.error("Failed to create new loadout:", error);
            toast.error("Failed to create new loadout");
        }
    }

    function isEmptyLoadout(loadout: Loadout): boolean {
        return loadout.colorHash === itemPlaceHolder &&
               loadout.iconHash === itemPlaceHolder &&
               loadout.nameHash === itemPlaceHolder;
    }
</script>

<div class="p-4">
    <div class="space-y-4">
        {#each Object.entries(characters) as [characterId, character]}
            <Card>
                <CardContent>
                    <div class="flex flex-col">
                        <div class="p-4">
                            <h3 class="mb-2 text-lg font-semibold">Loadouts</h3>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {#each Array(MAX_LOADOUTS) as _, index}
                                    {#if loadouts[characterId]?.loadouts[index] && !isEmptyLoadout(loadouts[characterId].loadouts[index])}
                                        {#await getLoadoutDetails(loadouts[characterId].loadouts[index])}
                                            <div class="flex flex-col items-center">
                                                <Skeleton class="aspect-square w-full h-20" />
                                                <Skeleton class="h-4 w-3/4 mt-1" />
                                            </div>
                                        {:then details}
                                            <div class="flex flex-col items-center">
                                                <Button
                                                    variant="ghost"
                                                    class="aspect-square w-full h-20 p-2 flex items-center justify-center cursor-pointer rounded-lg transition-transform hover:scale-110"
                                                    style="background-image: url('{bngBaseUrl}{details.color}'); background-size: cover;"
                                                    onclick={() => handleLoadoutClick(loadouts[characterId].loadouts[index], character, index)}
                                                >
                                                    <img src="{bngBaseUrl}{details.icon}" alt="{details.name}" class="max-w-full max-h-full object-contain" />
                                                </Button>
                                                <span class="text-center text-xs mt-1 truncate w-full">{details.name}</span>
                                            </div>
                                        {:catch error}
                                            <div class="flex flex-col items-center">
                                                <div class="aspect-square w-full h-20 bg-red-200 flex items-center justify-center rounded-lg">
                                                    Error
                                                </div>
                                                <span class="text-center text-xs mt-1 text-red-500">Failed to load</span>
                                            </div>
                                        {/await}
                                    {:else}
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div class="flex flex-col items-center">
                                                    <Button
                                                        variant="ghost"
                                                        class="aspect-square w-full h-20 p-2 flex items-center justify-center cursor-pointer rounded-lg transition-transform hover:scale-105"
                                                        onclick={() => handleAddLoadout(characterId, index)}
                                                    >
                                                        <Plus class="w-1/2 h-1/2" />
                                                    </Button>
                                                    <span class="text-center text-xs mt-1 invisible">Placeholder</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Create new loadout from equipped items</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        {/each}
    </div>
</div>

{#if selectedLoadout && selectedLoadoutIndex !== null && selectedCharacter}
    <LoadoutDetails 
        loadout={selectedLoadout}
        loadoutIndex={selectedLoadoutIndex}
        character={selectedCharacter}
        bind:open={isDialogOpen}
    />
{/if}
