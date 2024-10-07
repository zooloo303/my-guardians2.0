<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
</script>

<header class="mb-4 border-b p-4">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex flex-row space-x-2">
			<LightSwitch />
			<h1 class="text-2xl font-bold">myGuardians</h1>
		</div>
		<Auth />
	</div>
</header>
