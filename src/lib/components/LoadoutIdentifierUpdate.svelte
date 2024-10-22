<script lang="ts">
import { onMount } from "svelte";
import * as Drawer from "$lib/components/ui/drawer";
import { Button } from "$lib/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "$lib/components/ui/toggle-group";
import { updateLoadoutIdentifiers } from "$lib/utils/loadoutActions";
import { getManifestTable } from "$lib/utils/indexedDB";
import { bngBaseUrl } from "$lib/utils/helpers";
import type {
  Loadout,
  Character,
  DestinyLoadoutColorDefinition,
  DestinyLoadoutIconDefinition,
  DestinyLoadoutNameDefinition,
} from "$lib/utils/types";

let { loadout, loadoutIndex, character, open = $bindable(false) } = $props<{
  loadout: Loadout;
  loadoutIndex: number;
  character: Character;
  open: boolean;
}>();

let colors = $state<Record<number, DestinyLoadoutColorDefinition>>({});
let icons = $state<Record<number, DestinyLoadoutIconDefinition>>({});
let names = $state<Record<number, DestinyLoadoutNameDefinition>>({});

let selectedColor = $state(loadout.colorHash.toString());
let selectedIcon = $state(loadout.iconHash.toString());
let selectedName = $state(loadout.nameHash.toString());

$effect(() => {
  if (open) {
    selectedColor = loadout.colorHash.toString();
    selectedIcon = loadout.iconHash.toString();
    selectedName = loadout.nameHash.toString();
  }
});

onMount(async () => {
  colors = await getManifestTable<DestinyLoadoutColorDefinition>("DestinyLoadoutColorDefinition");
  icons = await getManifestTable<DestinyLoadoutIconDefinition>("DestinyLoadoutIconDefinition");
  names = await getManifestTable<DestinyLoadoutNameDefinition>("DestinyLoadoutNameDefinition");
});

async function handleSubmit() {
  await updateLoadoutIdentifiers(
    loadoutIndex,
    character.characterId,
    character.membershipType,
    parseInt(selectedColor),
    parseInt(selectedIcon),
    parseInt(selectedName)
  );
  open = false;
}
</script>

<Drawer.Root bind:open>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Update Loadout Identifiers</Drawer.Title>
    </Drawer.Header>
    <div class="space-y-4 p-4">
      <div>
        <h3 class="mb-2 text-lg font-semibold">Color</h3>
        <ToggleGroup type="single" bind:value={selectedColor} class="flex flex-wrap gap-2">
          {#each Object.entries(colors) as [hash, color]}
            <ToggleGroupItem value={hash}>
              <img
                src="{bngBaseUrl}{color.colorImagePath}"
                alt="Loadout Color"
                class="h-8 w-8 rounded"
              />
            </ToggleGroupItem>
          {/each}
        </ToggleGroup>
      </div>

      <div>
        <h3 class="mb-2 text-lg font-semibold">Icon</h3>
        <ToggleGroup type="single" bind:value={selectedIcon} class="flex flex-wrap gap-2">
          {#each Object.entries(icons) as [hash, icon]}
            <ToggleGroupItem value={hash}>
              <img
                src="{bngBaseUrl}{icon.iconImagePath}"
                alt="Loadout Icon"
                class="h-8 w-8"
              />
            </ToggleGroupItem>
          {/each}
        </ToggleGroup>
      </div>

      <div>
        <h3 class="mb-2 text-lg font-semibold">Name</h3>
        <ToggleGroup type="single" bind:value={selectedName} class="flex flex-wrap gap-2">
          {#each Object.entries(names) as [hash, name]}
            <ToggleGroupItem value={hash}>
              {name.name}
            </ToggleGroupItem>
          {/each}
        </ToggleGroup>
      </div>
    </div>
    <Drawer.Footer>
      <Button onclick={handleSubmit}>Update Loadout</Button>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
