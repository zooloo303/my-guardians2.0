<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import type { UserData } from '$lib/utils/types';
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';

	let { user } = $props<{ user: UserData | null }>();
</script>

<div class="mt-20 flex items-center justify-center bg-background">
	<Card>
		<CardHeader>
			<img src="/images/Bungie.svg" alt="Bungie Logo" class="mx-auto mb-4 w-32" />
			<CardTitle>Grant your permission...</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="mb-4">
				Please allow myGuardians to access your loot, we will not takes it, promise.
			</p>
			<Auth {user} />
		</CardContent>
		<CardFooter>
			myGuardians is not affiliated with Bungie. Destiny is a registered trademark of Bungie.
		</CardFooter>
	</Card>
</div>
