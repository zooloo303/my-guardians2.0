<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import type { SearchCriteria } from '$lib/utils/types';
	import { BUCKET_HASH, DamageType, TierType, BreakerType, DestinyItemType, DestinyItemSubType, ClassType } from '$lib/utils/types';
	
	let { onSearch, 
		  itemName = $bindable(''), 
		  itemType = $bindable<DestinyItemType | null>(null),
		  itemSubType = $bindable<DestinyItemSubType | null>(null),
		  damageType = $bindable<DamageType | null>(null),
		  breakerType = $bindable<BreakerType | null>(null),
		  classType = $bindable<ClassType | null>(null),
		  tierType = $bindable<TierType | null>(null)
		} = $props<{ 
			onSearch: (criteria: SearchCriteria) => void, 
			itemName: string, 
			itemType: DestinyItemType | null, 
			itemSubType: DestinyItemSubType | null,
			damageType: DamageType | null,
			breakerType: BreakerType | null,
			classType: ClassType | null,
			tierType: TierType | null
		}>();

	function search() {
		onSearch({ itemName, itemType, itemSubType, damageType, classType, tierType, breakerType });
	}

	function reset() {
		itemName = '';
		itemType = null;
		itemSubType = null;
		damageType = null;
		classType = null;
		tierType = null;
		breakerType = null;
		search()
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			search();
		}
	}
</script>


<div class="space-y-4">
    <div>
        <Label for="itemName">Item Name</Label>
        <Input id="itemName" bind:value={itemName} placeholder="Search items..." on:keydown={handleKeydown} />
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div>
            <Label for="itemType">Type</Label>
            <Select.Root bind:selected={itemType}>
                <Select.Trigger class="w-full">
                    <Select.Value placeholder="Select item type" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Item Types</Select.Label>
                        <Select.Item value={null}>Any</Select.Item>
                        {#each Object.entries(DestinyItemType) as [key, value]}
                            {#if typeof value === 'number'}
                                <Select.Item {value}>{key}</Select.Item>
                            {/if}
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </div>
        <div>
            <Label for="itemSubType">Subtype</Label>
            <Select.Root bind:selected={itemSubType}>
                <Select.Trigger class="w-full">
                    <Select.Value placeholder="Select item subtype" />
                </Select.Trigger>
                <Select.Content class="max-h-[300px] overflow-y-auto">
                    <Select.Group>
                        <Select.Label>Item Subtypes</Select.Label>
                        <Select.Item value={null}>Any</Select.Item>
                        {#each Object.entries(DestinyItemSubType) as [key, value]}
                            {#if typeof value === 'number'}
                                <Select.Item {value}>{key}</Select.Item>
                            {/if}
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </div>
        <div>
            <Label for="damageType">Damage Type</Label>
            <Select.Root bind:selected={damageType}>
                <Select.Trigger class="w-full">
                    <Select.Value placeholder="Select damage type" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Damage Types</Select.Label>
                        <Select.Item value={null}>Any</Select.Item>
                        {#each Object.entries(DamageType) as [key, value]}
                            {#if typeof value === 'number'}
                                <Select.Item {value}>{key}</Select.Item>
                            {/if}
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </div>
        <div>
            <Label for="classType">Class Type</Label>
            <Select.Root bind:selected={classType}>
                <Select.Trigger class="w-full">
                    <Select.Value placeholder="Select class type" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Class Types</Select.Label>
                        <Select.Item value={null}>Any</Select.Item>
                        {#each Object.entries(ClassType) as [key, value]}
                            {#if typeof value === 'number'}
                                <Select.Item {value}>{key}</Select.Item>
                            {/if}
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </div>
        <div>
            <Label for="tierType">Tier Type</Label>
            <Select.Root bind:selected={tierType}>
                <Select.Trigger class="w-full">
                    <Select.Value placeholder="Select tier type" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Tier Types</Select.Label>
                        <Select.Item value={null}>Any</Select.Item>
                        {#each Object.entries(TierType) as [key, value]}
                            {#if typeof value === 'number'}
                                <Select.Item {value}>{key}</Select.Item>
                            {/if}
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </div>
		<div>
            <Label for="breakerType">Breaker Type</Label>
            <Select.Root bind:selected={breakerType}>
                <Select.Trigger class="w-full">
                    <Select.Value placeholder="Select breaker type" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Breaker Types</Select.Label>
                        <Select.Item value={null}>Any</Select.Item>
                        {#each Object.entries(BreakerType) as [key, value]}
                            {#if typeof value === 'number'}
                                <Select.Item {value}>{key}</Select.Item>
                            {/if}
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
        </div>
    </div>

    <div class="flex justify-end space-x-2">
        <Button variant="outline" onclick={reset}>Reset</Button>
        <Button onclick={search}>Search</Button>
    </div>
</div>
