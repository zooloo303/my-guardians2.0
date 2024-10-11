<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import type { UserData } from '$lib/utils/types';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';

	let { user } = $props<{ user: UserData | null }>();
</script>

<div class="mt-20 flex items-center justify-center bg-background">
	<Card class="flex flex-col items-center">
		<CardHeader class="text-center">
			<img src="/images/Bungie.svg" alt="Bungie Logo" class="mx-auto mb-4 w-32" />
			<CardTitle>Grant your permission...</CardTitle>
		</CardHeader>
		<CardContent class="flex flex-col items-center">
			<p class="mb-4 text-center">
				Please allow myGuardians to access your loot, we will not takes it, promise.
			</p>
			<Auth {user} />
		</CardContent>
		<CardFooter class="text-center">
			myGuardians is not affiliated with Bungie. Destiny is a registered trademark of Bungie.
		</CardFooter>
	</Card>
</div>
