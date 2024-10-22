<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { refreshProfileData } from '$lib/utils/dataRefresh';
    
    let lastRefreshTime = $state(Date.now());
    let isActive = $state(true);
    
    $effect(() => {
      const intervalId = setInterval(() => {
        if (isActive && Date.now() - lastRefreshTime >= 180000) { // 3 minutes
          refreshProfileData();
          lastRefreshTime = Date.now();
        }
      }, 60000); // Check every minute
    
      return () => clearInterval(intervalId);
    });
    
    onMount(() => {
      const handleVisibilityChange = () => {
        isActive = !document.hidden;
        if (isActive && Date.now() - lastRefreshTime >= 180000) {
          refreshProfileData();
          lastRefreshTime = Date.now();
        }
      };
    
      document.addEventListener('visibilitychange', handleVisibilityChange);
    
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    });
    
    $effect(() => {
      if ($page.data.profileData) {
        lastRefreshTime = Date.now();
      }
    });
    </script>