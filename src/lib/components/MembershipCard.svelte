<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { membershipTypes } from '$lib/utils/helpers';
	import type { UserData, MembershipType } from '$lib/utils/types';

	let { user } = $props<{ user: UserData }>();

	const userName = user.destinyMemberships[0].bungieGlobalDisplayName;
	const displayName: MembershipType = user.destinyMemberships[0].displayName;
	const membershipTypeNumber: MembershipType = user.destinyMemberships[0].membershipType;
	const membershipTypeText = membershipTypes[membershipTypeNumber] ?? 'Unknown';
</script>

<Card>
	<CardHeader>
		<CardTitle>Membership Card for {userName}</CardTitle>
		<CardDescription>aka:- {displayName}</CardDescription>
	</CardHeader>
	<CardContent>
		<h1>Primary Membership</h1>
		<p>Membership Type: {membershipTypeText}</p>
	</CardContent>
</Card>
