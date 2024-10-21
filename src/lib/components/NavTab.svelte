<script lang="ts">
import { goto } from '$app/navigation';
import * as Tabs from "$lib/components/ui/tabs/index.js";
import { page } from '$app/stores';
import { getNavContext } from '$lib/utils/navContext';

let { currentPath } = $state(getNavContext());

$effect(() => {
  currentPath = $page.url.pathname;
});

function getTabValue(path: string) {
  if (path === '/') return 'home';
  if (path.startsWith('/loadouts')) return 'loadout';
  if (path.startsWith('/inventory')) return 'inventory';
  return 'home';
}
</script>

<Tabs.Root value={getTabValue(currentPath)} class="w-[400px]">
  <Tabs.List class="grid w-full grid-cols-3">
    <Tabs.Trigger value="home" onclick={() => goto('/')}>Characters</Tabs.Trigger>
    <Tabs.Trigger value="loadout" onclick={() => goto('/loadouts')}>Loadouts</Tabs.Trigger>
    <Tabs.Trigger value="inventory" onclick={() => goto('/inventory')}>Inventory</Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>
