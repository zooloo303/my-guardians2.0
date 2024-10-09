<script lang="ts">
	import { goto } from '$app/navigation';
	import { LogOut } from 'lucide-svelte/icons';
	import { bngBaseUrl } from '$lib/utils/helpers';
	import type { UserData } from '$lib/utils/types';
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';

	// Props
	let { user } = $props<{ user: UserData | null }>();
	console.log('user in auth component :', user);

	// State
	let isLoading = $state(true);
	let avatarUrl = $derived(user?.bungieNetUser.profilePicturePath || '');
	let avatarFallback = $derived(user?.bungieNetUser.displayName.slice(0, 2).toUpperCase());

	function login() {
		window.location.href = '/api/auth/login';
	}

	async function logout() {
		isLoading = true;
		const response = await fetch('/api/auth/logout', { method: 'POST' });
		if (response.ok) {
			user = null;
			goto('/login');
		} else {
			console.error('Logout failed');
		}
		isLoading = false;
	}

	$effect(() => {
		isLoading = false;
	});
</script>

<div class="flex items-center space-x-4">
	{#if isLoading}
		<Button disabled>
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			Loading...
		</Button>
	{:else if user}
		<div class="flex items-center space-x-2">
			<Avatar>
				<AvatarImage src={`${bngBaseUrl}${avatarUrl}`} alt={user.bungieNetUser.displayName} />
				<AvatarFallback>{avatarFallback}</AvatarFallback>
			</Avatar>
			<span class="text-sm font-medium">{user.bungieNetUser.displayName}</span>
		</div>
		<Button variant="outline" onclick={logout}><LogOut />Log out</Button>
	{:else}
		<Button onclick={login}>Authenticate with Bungie</Button>
	{/if}
</div>
