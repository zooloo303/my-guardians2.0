<script lang="ts">
    import { Avatar, AvatarImage } from '$lib/components/ui/avatar';
    import { Button } from '$lib/components/ui/button';
    import type { Character } from '$lib/utils/types';
    import { bngBaseUrl } from '$lib/utils/helpers';
    import { ClassType } from '$lib/utils/types';
    
    let { characters, onSelect } = $props<{
        characters: Record<string, Character>;
        onSelect: (character: Character) => void;
    }>();
    
    let characterArray = $derived(Object.values(characters) as Character[]);
    
    function handleSelect(character: Character) {
        onSelect(character);
    }
</script>

<div class="flex flex-wrap gap-4 justify-center">
    {#each characterArray as character (character.characterId)}
        <Button
            variant="ghost"
            class="flex flex-col items-center p-2"
            on:click={() => handleSelect(character)}
        >
            <Avatar class="w-16 h-16 mb-2">
                <AvatarImage src={bngBaseUrl + character.emblemPath} alt={ClassType[character.classType]} />
            </Avatar>
            <span class="text-sm font-semibold">{ClassType[character.classType]}</span>
        </Button>
    {/each}
</div>
