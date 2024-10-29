<script lang="ts">
  import { onMount } from 'svelte';
  import { Progress } from '$lib/components/ui/progress';
  import { getManifestVersion, storeManifestData } from '$lib/utils/indexedDB';
  import { invalidateAll } from '$app/navigation';
  import { checkApiStatus } from '$lib/utils/apiStatus';
  
  let isUpdatingManifest = $state(false);
  let progress = $state(0);
  
  async function checkAndUpdateManifest() {
    try {
      await checkApiStatus();
      
      const storedVersion = await getManifestVersion();
      const response = await fetch('/api/d2/manifest');
      
      if (!response.ok) return;
      
      const { version, tables } = await response.json();
      
      if (version !== storedVersion) {
        isUpdatingManifest = true;
        for (let i = 0; i <= 100; i += 10) {
          progress = i;
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
        
        await storeManifestData({ version, tables });
        await invalidateAll();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error handling manifest:', error);
    } finally {
      isUpdatingManifest = false;
      progress = 0;
    }
  }
  
  onMount(() => {
    checkAndUpdateManifest();
    const interval = setInterval(checkApiStatus, 60000);
    return () => clearInterval(interval);
  });
</script>

{#if isUpdatingManifest}
  <div class="fixed bottom-0 left-0 right-0 z-50 bg-background/80 p-4 backdrop-blur-sm">
    <div class="mx-auto max-w-md">
      <p class="mb-2 text-sm font-medium">Updating Manifest: {progress}%</p>
      <Progress value={progress} max={100} />
    </div>
  </div>
{/if}
