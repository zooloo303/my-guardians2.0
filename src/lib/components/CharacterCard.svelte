<script lang="ts">
	import { bngBaseUrl } from '$lib/utils/helpers';
	import { getManifestData } from '$lib/utils/indexedDB';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { ClassType, RaceType, STAT_ORDER } from '$lib/utils/types';
	import type { Character, DestinyStatDefinition } from '$lib/utils/types';
	//props
	let { character } = $props<{ character: Character }>();
	//state
	let statDefinitions: Record<string, DestinyStatDefinition> = $state({});

	$effect(() => {
		loadStatDefinitions();
	});

	async function loadStatDefinitions() {
		for (const statHash of Object.keys(character.stats)) {
			const definition = await getManifestData<DestinyStatDefinition>('DestinyStatDefinition', parseInt(statHash));
			if (definition) {
				statDefinitions[statHash] = definition;
			}
		}
	}

	// Function to sort stats based on STAT_ORDER
	function sortedStats() {
		return STAT_ORDER
			.map(statHash => [statHash, character.stats[statHash]])
			.filter(([statHash, statValue]) => statValue !== undefined);
	}
</script>

<Card class="w-full">
	<CardContent class="p-0">
		<div
			class="h-16 bg-cover bg-center"
			style="background-image: url('{bngBaseUrl}{character.emblemBackgroundPath}')"
		>
			<div class="flex items-center justify-end h-full px-4 bg-black bg-opacity-50">
				<div class="text-right">
					<h2 class="text-lg font-bold text-white">
						{ClassType[character.classType]}
					</h2>
					<p class="text-sm text-gray-300">
						{RaceType[character.raceType]} 
					</p>
				</div>
			</div>
		</div>
		<div class="p-4">
			<h3 class="text-lg font-semibold mb-2">Stats</h3>
			<div class="grid grid-cols-3 gap-2">
				{#each sortedStats() as [statHash, statValue]}
					{#if statDefinitions[statHash]}
						<div class="flex items-center">
							<img
								src="{bngBaseUrl}{statDefinitions[statHash].displayProperties.icon}"
								alt="{statDefinitions[statHash].displayProperties.name}"
								class="w-6 h-6 mr-2"
							/>
							<span>{statValue}</span>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</CardContent>
</Card>
