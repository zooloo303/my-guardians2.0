<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import { bngBaseUrl } from '$lib/utils/helpers';
	import type { UserData } from '$lib/utils/types';
	import { LogOut, RefreshCw } from 'lucide-svelte';
	import NavTab from '$lib/components/NavTab.svelte';
	import { Button } from '$lib/components/ui/button';
	import Hamburger from '$lib/components/Hamburger.svelte';
	import { refreshProfileData } from '$lib/utils/dataRefresh';
	import MembershipCard from '$lib/components/MembershipCard.svelte';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { Popover, PopoverTrigger, PopoverContent } from '$lib/components/ui/popover';
	// Props
	let { user, sidebarOpen = $bindable(false) } = $props<{ 
		user: UserData | null; 
		sidebarOpen: boolean 
	}>();
	let isLoading = $state(false);

	async function logout() {
		const response = await fetch('/api/auth/logout', { method: 'POST' });
		if (response.ok) {
			window.location.href = '/login';
		} else {
			console.error('Logout failed');
		}
	}

	async function handleRefresh() {
		isLoading = true;
		try {
			await refreshProfileData();
		} finally {
			isLoading = false;
		}
	}
</script>

<header class="mb-4 border-b p-4">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex flex-row space-x-2">
			<Hamburger bind:open={sidebarOpen} />
			<!-- <LightSwitch /> -->
			<h1 class="text-2xl font-bold">myGuardians</h1>
		</div>
		
		<!-- Hide NavTab on small screens (below md breakpoint) -->
		<div class="hidden md:block">
			<NavTab />
		</div>

		{#if user}
			<div class="flex items-center space-x-4">
				<Popover>
					<PopoverTrigger>
						<div class="flex cursor-pointer items-center space-x-2">
							<Avatar>
								<AvatarImage
									src={`${bngBaseUrl}${user.bungieNetUser.profilePicturePath}`}
									alt={user.bungieNetUser.displayName}
								/>
								<AvatarFallback
									>{user.bungieNetUser.displayName.slice(0, 2).toUpperCase()}</AvatarFallback
								>
							</Avatar>
							<span class="hidden sm:inline-block text-sm font-medium">{user.bungieNetUser.displayName}</span>
						</div>
					</PopoverTrigger>
					<PopoverContent class="w-80">
						<MembershipCard {user} />
					</PopoverContent>
				</Popover>
				<Button variant="outline" onclick={logout}>
					<LogOut class="mr-2 h-4 w-4" />
					<span class="hidden sm:inline-block">Log out</span>
				</Button>
				<Button onclick={handleRefresh} variant="ghost" size="icon" disabled={isLoading}>
						{#if isLoading}
							<RefreshCw class="h-[1.2rem] w-[1.2rem] animate-spin" />
						{:else}
							<RefreshCw class="h-[1.2rem] w-[1.2rem]" />
						{/if}
				</Button>
			</div>
		{:else}
			<Auth {user} />
		{/if}
	</div>
</header>
