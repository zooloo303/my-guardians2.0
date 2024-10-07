<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
</script>

<div class="flex min-h-screen items-center justify-center bg-background">
	<Card>
		<CardHeader>
			<img src="/images/Bungie.svg" alt="Bungie Logo" class="mx-auto mb-4 w-32" />
			<CardTitle>Grant your permission...</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="mb-4">
				Please allow myGuardians to access your loot, we will not takes it, promise.
			</p>
			<Auth />
		</CardContent>
		<CardFooter>
			myGuardians is not affiliated with Bungie. Destiny is a registered trademark of Bungie.
		</CardFooter>
	</Card>
</div>
