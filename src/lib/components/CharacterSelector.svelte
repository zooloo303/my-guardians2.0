<script lang="ts">
    import { ClassType } from '$lib/utils/types';
    import { bngBaseUrl } from '$lib/utils/helpers';
    import type { Character } from '$lib/utils/types';
    import { Button } from '$lib/components/ui/button';
    import { Avatar, AvatarImage } from '$lib/components/ui/avatar';
    import { Tooltip, TooltipTrigger, TooltipContent } from '$lib/components/ui/tooltip';
    
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
        <Tooltip>
            <TooltipTrigger>
                <Button
                    variant="ghost"
                    class="flex flex-col items-center p-2"
                    onclick={() => handleSelect(character)}
                >
                    <Avatar class="w-16 h-16">
                        <AvatarImage src={bngBaseUrl + character.emblemPath} alt={ClassType[character.classType]} />
                    </Avatar>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{ClassType[character.classType]}</p>
            </TooltipContent>
        </Tooltip>
    {/each}
</div>
