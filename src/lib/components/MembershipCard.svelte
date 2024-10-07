<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { bngBaseUrl } from '$lib/utils/helpers';
	import { membershipTypes } from '$lib/utils/helpers';
	import type { UserData, MembershipType } from '$lib/utils/types';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';

	let { user } = $props<{ user: UserData }>();

	const userName = user.destinyMemberships[0].bungieGlobalDisplayName;
	const displayName: MembershipType = user.destinyMemberships[0].displayName;
	const profilePicture = user.bungieNetUser.profilePicturePath;
	const iconPath = user.destinyMemberships[0].iconPath;
	const membershipTypeNumber: MembershipType = user.destinyMemberships[0].membershipType;
	const membershipTypeText = membershipTypes[membershipTypeNumber] ?? 'Unknown';
</script>

<Card>
	<CardHeader>
		<CardTitle>Membership Card for {userName}</CardTitle>
		<CardDescription>aka:- {displayName}</CardDescription>
		<img src="{bngBaseUrl}{profilePicture}" alt="Bungie Logo" class="mx-auto mb-4" />
	</CardHeader>
	<CardContent>
		<h1>Primary Membership</h1>
		<Avatar>
			<AvatarImage src={`${bngBaseUrl}${iconPath}`} alt={user.bungieNetUser.displayName} />
			<AvatarFallback>{membershipTypeText}</AvatarFallback>
		</Avatar>
		<p>Membership Type: {membershipTypeText}</p>
	</CardContent>
</Card>
