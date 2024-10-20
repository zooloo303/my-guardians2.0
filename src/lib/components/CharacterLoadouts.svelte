<script lang="ts">
	import { toast } from 'svelte-sonner';
    import { bngBaseUrl } from '$lib/utils/helpers';
	import { ClassType, RaceType } from '$lib/utils/types';
    import type { Character, Loadout } from '$lib/utils/types';
	import LoadoutGrid from '$lib/components/LoadoutGrid.svelte';
	import { Avatar, AvatarImage } from '$lib/components/ui/avatar';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	//props 
	let { character, loadouts } = $props<{
		character: Character;
		loadouts: Record<string, { loadouts: Loadout[] }>;
	}>();
</script>

<Card>
	<CardHeader>
		<div class="flex flex-row items-center justify-between gap-2">
			<Avatar>
				<AvatarImage src={bngBaseUrl + character.emblemPath} />
			</Avatar>
			<div class="flex flex-col">
				<h2 class="text-2xl font-bold">{ClassType[character.classType]}</h2>
				<p class="text-sm">{RaceType[character.raceType]}</p>
			</div>
		</div>
	</CardHeader>
	<CardContent class="p-4">
		<LoadoutGrid characters={{ [character.characterId]: character }} {loadouts} />
	</CardContent>
</Card>
