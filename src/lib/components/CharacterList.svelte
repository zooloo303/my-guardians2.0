<script lang="ts">
    import type { Character } from '$lib/utils/types';
    import CharacterCard from '$lib/components/CharacterCard.svelte';
    import CharacterEquipment from '$lib/components/CharacterEquipment.svelte';

    let { characters } = $props<{ characters: Record<string, Character> }>();
    let characterArray = $derived(Object.values(characters) as Character[]);

</script>

<div class="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each characterArray as character (character.characterId)}
        <CharacterCard {character} />
    {/each}
</div>
<div class="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each characterArray as character (character.characterId)}
        <CharacterEquipment {character} />
    {/each}
</div>
