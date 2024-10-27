<script lang="ts">
 import { afterNavigate } from '$app/navigation';
 let { open = $bindable(false) } = $props();

 // Close sidebar after navigation
 afterNavigate(() => {
     open = false;
 });

 function handleClickOutside(event: MouseEvent) {
     const sidebar = event.target as HTMLElement;
     if (open && !sidebar.closest('aside') && !sidebar.closest('button')) {
         open = false;
     }
 }
</script>

<svelte:window on:click={handleClickOutside} />

<aside class="fixed top-[73px] left-0 z-30 h-[calc(100vh-73px)] w-64 transform bg-background border-r-2 shadow-lg transition-transform" 
       class:translate-x-0={open} 
       class:-translate-x-full={!open}>
	<nav class="p-12 text-xl space-y-4">
		<a class="block" href="/">Characters</a>
		<div class="space-y-2">
			<a class="block" href="/loadouts">Loadouts</a>
			<a class="block pl-4 text-muted-foreground" href="/loadouts/optimizer">Optimizer</a>
		</div>
		<a class="block" href="/inventory">Inventory</a>
	</nav>
</aside>

<style>
	/* Remove the previous styles since we're using Tailwind transforms */
</style>
