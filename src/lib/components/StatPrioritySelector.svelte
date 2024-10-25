<script lang="ts">
    import { flip } from 'svelte/animate';
    import { bngBaseUrl } from "$lib/utils/helpers";
    import { Badge } from "$lib/components/ui/badge";
    import { getManifestData } from "$lib/utils/indexedDB";
    import { dndzone, type DndEvent } from 'svelte-dnd-action';
    import type { DestinyStatDefinition } from "$lib/utils/types";
    
    let { onPrioritiesChange } = $props<{
        onPrioritiesChange: (priorities: string[]) => void;
    }>();
    
    const flipDurationMs = 300;
    
    interface StatItem {
        id: string;
        hash: string;
    }
    
    let items = $state<StatItem[]>([
        { id: "1", hash: "2996146975" }, // Mobility
        { id: "2", hash: "392767087" },  // Resilience
        { id: "3", hash: "1943323491" }, // Recovery
        { id: "4", hash: "1735777505" }, // Discipline
        { id: "5", hash: "144602215" },  // Intellect
        { id: "6", hash: "4244567218" }, // Strength
    ]);
    
    let statDefinitions = $state<Record<string, DestinyStatDefinition>>({});
    
    $effect(() => {
        onPrioritiesChange(items.map(item => item.hash));
    });
    
    $effect(() => {
        loadStatDefinitions();
    });
    
    async function loadStatDefinitions() {
        for (const item of items) {
            const def = await getManifestData<DestinyStatDefinition>("DestinyStatDefinition", parseInt(item.hash));
            if (def) {
                statDefinitions[item.hash] = def;
            }
        }
    }
    
    function handleConsider(event: CustomEvent<DndEvent<StatItem>>) {
        items = event.detail.items;
    }
    
    function handleFinalize(event: CustomEvent<DndEvent<StatItem>>) {
        items = event.detail.items;
        onPrioritiesChange(items.map(item => item.hash));
    }
    </script>
    
    <div>
      <section
        use:dndzone="{{ items, flipDurationMs }}"
        onconsider={handleConsider}
        onfinalize={handleFinalize}
        class="flex flex-col space-y-2"
      >
        {#each items as item (item.id)}
          <div class="flex items-center space-x-2 p-2 bg-secondary rounded-md cursor-move" animate:flip="{{ duration: flipDurationMs }}">
            {#if statDefinitions[item.hash]}
              <img 
                src={`${bngBaseUrl}${statDefinitions[item.hash].displayProperties.icon}`} 
                alt={statDefinitions[item.hash].displayProperties.name} 
                class="w-6 h-6"
              />
              <Badge class="text-xs">{statDefinitions[item.hash].displayProperties.name}</Badge>
            {/if}
          </div>
        {/each}
      </section>
    </div>