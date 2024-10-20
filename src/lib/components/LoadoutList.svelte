<script lang="ts">
    import type { Character, Loadout } from '$lib/utils/types';
    import CharacterLoadouts from '$lib/components/CharacterLoadouts.svelte';

    let { characters, loadouts } = $props<{ characters: Record<string, Character>, loadouts: Loadout[] }>();
    let characterArray = $derived(Object.values(characters) as Character[]);

</script>

<div class="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each characterArray as character (character.characterId)}
        <CharacterLoadouts {character} {loadouts} />
    {/each}
</div>
<div class="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each characterArray as character (character.characterId)}
        <!-- <CharacterEquipment {character} /> -->
    {/each}
</div>
