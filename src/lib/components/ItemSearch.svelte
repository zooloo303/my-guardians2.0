<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Select } from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { getManifestData } from '$lib/utils/indexedDB';
	import type { DestinyInventoryBucketDefinition } from '$lib/utils/types';
	import { DamageType, TierType, DestinyItemType } from '$lib/utils/types';

	let { onSearch } = $props<{ onSearch: (criteria: SearchCriteria) => void }>();

	let itemName = $state('');
	let itemType = $state<DestinyItemType | null>(null);
	let damageType = $state<DamageType | null>(null);
	let bucketType = $state<number | null>(null);
	let tierType = $state<TierType | null>(null);

	let buckets = $state<DestinyInventoryBucketDefinition[]>([]);

	$effect(() => {
		loadBuckets();
	});

	async function loadBuckets() {
		const allBuckets = await getManifestData<Record<string, DestinyInventoryBucketDefinition>>(
			'DestinyInventoryBucketDefinition',
			0
		);
		if (allBuckets) {
			buckets = Object.values(allBuckets).filter((bucket) => bucket.enabled);
		}
	}

	function search() {
		onSearch({ itemName, itemType, damageType, bucketType, tierType });
	}

	function reset() {
		itemName = '';
		itemType = null;
		damageType = null;
		bucketType = null;
		tierType = null;
	}
</script>

<div class="space-y-4">
	<div class="flex space-x-2">
		<div class="flex-grow">
			<Label for="itemName">Item Name</Label>
			<Input id="itemName" bind:value={itemName} placeholder="Search items..." />
		</div>
		<div>
			<Label for="itemType">Item Type</Label>
			<Select id="itemType" bind:value={itemType}>
				<option value={null}>Any</option>
				{#each Object.entries(DestinyItemType) as [key, value]}
					{#if typeof value === 'number'}
						<option {value}>{key}</option>
					{/if}
				{/each}
			</Select>
		</div>
	</div>

	<div class="flex space-x-2">
		<div>
			<Label for="damageType">Damage Type</Label>
			<Select id="damageType" bind:value={damageType}>
				<option value={null}>Any</option>
				{#each Object.entries(DamageType) as [key, value]}
					{#if typeof value === 'number'}
						<option {value}>{key}</option>
					{/if}
				{/each}
			</Select>
		</div>
		<div>
			<Label for="bucketType">Inventory Bucket</Label>
			<Select id="bucketType" bind:value={bucketType}>
				<option value={null}>Any</option>
				{#each buckets as bucket}
					<option value={bucket.hash}>{bucket.displayProperties.name}</option>
				{/each}
			</Select>
		</div>
		<div>
			<Label for="tierType">Tier Type</Label>
			<Select id="tierType" bind:value={tierType}>
				<option value={null}>Any</option>
				{#each Object.entries(TierType) as [key, value]}
					{#if typeof value === 'number'}
						<option {value}>{key}</option>
					{/if}
				{/each}
			</Select>
		</div>
	</div>

	<div class="flex justify-end space-x-2">
		<Button variant="outline" onclick={reset}>Reset</Button>
		<Button onclick={search}>Search</Button>
	</div>
</div>
