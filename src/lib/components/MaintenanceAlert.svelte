<script lang="ts">
  import { AlertTriangle } from "lucide-svelte";
  import * as Alert from "$lib/components/ui/alert";
  import { maintenanceStatus } from '$lib/utils/apiStatus';
</script>

{#if $maintenanceStatus.enabled}
  <Alert.Root variant="destructive" class="mb-4">
    <AlertTriangle class="h-4 w-4" />
    <Alert.Title>Bungie API Maintenance</Alert.Title>
    <Alert.Description>
      {$maintenanceStatus.message}
      {#if $maintenanceStatus.timestamp}
        <br>
        <span class="text-sm opacity-75">
          Started: {new Date($maintenanceStatus.timestamp).toLocaleString()}
        </span>
      {/if}
    </Alert.Description>
  </Alert.Root>
{/if}