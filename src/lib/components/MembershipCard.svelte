<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
		CardFooter
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { bngBaseUrl, membershipTypes } from '$lib/utils/helpers';
	import type { UserData, MembershipType } from '$lib/utils/types';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';

	let { user } = $props<{ user: UserData }>();

	const primaryMembership = user.destinyMemberships[0];
	const userName = primaryMembership.bungieGlobalDisplayName;
	const displayName: string = primaryMembership.displayName;
	const profilePicture = user.bungieNetUser.profilePicturePath;
	const iconPath = primaryMembership.iconPath;
	const membershipTypeNumber: MembershipType = primaryMembership.membershipType;
	const membershipTypeText = membershipTypes[membershipTypeNumber] ?? 'Unknown';

	const additionalMemberships = user.destinyMemberships.slice(1);
</script>

<Card class="w-full max-w-md">
	<CardHeader>
		<div class="flex items-center space-x-4">
			<Avatar class="h-16 w-16">
				<AvatarImage src="{bngBaseUrl}{profilePicture}" alt={userName} />
				<AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
			</Avatar>
			<div>
				<CardTitle>{userName}</CardTitle>
				<CardDescription>{displayName}</CardDescription>
			</div>
		</div>
	</CardHeader>
	<CardContent>
		<div class="space-y-4">
			<div>
				<h3 class="text-sm font-medium">Primary Membership</h3>
				<div class="mt-1 flex items-center space-x-2">
					<Avatar class="h-8 w-8">
						<AvatarImage src={`${bngBaseUrl}${iconPath}`} alt={membershipTypeText} />
						<AvatarFallback>{membershipTypeText[0]}</AvatarFallback>
					</Avatar>
					<Badge>{membershipTypeText}</Badge>
				</div>
			</div>
			{#if additionalMemberships.length > 0}
				<Separator />
				<div>
					<h3 class="mb-2 text-sm font-medium">Additional Memberships</h3>
					<div class="flex flex-wrap gap-2">
						{#each additionalMemberships as membership}
							<Badge variant="outline">
								{membershipTypes[membership.membershipType as MembershipType] ?? 'Unknown'}
							</Badge>
						{/each}
					</div>
				</div>
			{/if}
			<Separator />
			<div>
				<h3 class="mb-2 text-sm font-medium">Account Details</h3>
				<p class="text-sm">Bungie ID: {user.bungieNetUser.membershipId}</p>
				<p class="text-sm">
					Cross Save: {primaryMembership.crossSaveOverride ? 'Enabled' : 'Disabled'}
				</p>
			</div>
		</div>
	</CardContent>
	<CardFooter>
		<Button variant="outline" class="w-full">View Full Profile</Button>
	</CardFooter>
</Card>
