<script lang="ts">
    import { page } from '$app/stores';
    import Item from '$lib/components/Item.svelte';
    import { ITEM_ORDER } from '$lib/utils/types';
    import type { InventoryItemWithComponents, InventoryItem, Character } from '$lib/utils/types';

    let { character } = $props<{ character: Character }>();

    let profileData = $derived($page.data.profileData);
    let characterEquipment = $derived(profileData.inventoryData.characterEquipment[character.characterId]?.items || []);
    let itemComponents = $derived(profileData?.inventoryData.itemComponents);

    let equipmentItems = $derived(characterEquipment.map((item: InventoryItem) => ({
        ...item,
        instance: itemComponents?.instances.data[item.itemInstanceId],
        stats: itemComponents?.stats.data[item.itemInstanceId]?.stats,
        sockets: itemComponents?.sockets.data[item.itemInstanceId],
        displayItemHash: item.itemHash
    })).sort((a: InventoryItemWithComponents, b: InventoryItemWithComponents) => {
        const orderA = ITEM_ORDER.indexOf(a.bucketHash);
        const orderB = ITEM_ORDER.indexOf(b.bucketHash);
        return orderA - orderB;
    }) as InventoryItemWithComponents[]);
</script>

<div class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
    {#each equipmentItems as item (item.itemInstanceId)}
        <Item {item} />
    {/each}
</div>
