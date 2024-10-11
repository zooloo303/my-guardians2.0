<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import type { UserData } from '$lib/utils/types';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import MembershipCard from '$lib/components/MembershipCard.svelte';
	import { Popover, PopoverTrigger, PopoverContent } from '$lib/components/ui/popover';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { LogOut } from 'lucide-svelte';
	import { bngBaseUrl } from '$lib/utils/helpers';

	// Props
	let { user } = $props<{ user: UserData | null }>();

	async function logout() {
		const response = await fetch('/api/auth/logout', { method: 'POST' });
		if (response.ok) {
			window.location.href = '/login';
		} else {
			console.error('Logout failed');
		}
	}
</script>

<header class="mb-4 border-b p-4">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex flex-row space-x-2">
			<LightSwitch />
			<h1 class="text-2xl font-bold">myGuardians</h1>
		</div>
		{#if user}
			<div class="flex items-center space-x-4">
				<Popover>
					<PopoverTrigger>
						<div class="flex items-center space-x-2 cursor-pointer">
							<Avatar>
								<AvatarImage src={`${bngBaseUrl}${user.bungieNetUser.profilePicturePath}`} alt={user.bungieNetUser.displayName} />
								<AvatarFallback>{user.bungieNetUser.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
							</Avatar>
							<span class="text-sm font-medium">{user.bungieNetUser.displayName}</span>
						</div>
					</PopoverTrigger>
					<PopoverContent class="w-80">
						<MembershipCard {user} />
					</PopoverContent>
				</Popover>
				<Button variant="outline" onclick={logout}>
					<LogOut class="mr-2 h-4 w-4" />
					Log out
				</Button>
			</div>
		{:else}
			<Auth {user} />
		{/if}
	</div>
</header>
