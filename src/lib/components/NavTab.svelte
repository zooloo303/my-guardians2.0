<script lang="ts">

import { goto } from '$app/navigation';
import * as Tabs from "$lib/components/ui/tabs/index.js";

</script>

<Tabs.Root value="home" class="w-[400px]">
    <Tabs.List class="grid w-full grid-cols-3">
      <Tabs.Trigger value="home" onclick={() => goto('/')}>Characters</Tabs.Trigger>
      <Tabs.Trigger value="loadout" onclick={() => goto('/loadouts')}>Loadouts</Tabs.Trigger>
      <Tabs.Trigger value="inventory" onclick={() => goto('/inventory')}>Inventory</Tabs.Trigger>
    </Tabs.List>
  </Tabs.Root>