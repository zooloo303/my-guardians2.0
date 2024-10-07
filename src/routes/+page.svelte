<script lang="ts">
	import MembershipCard from '$lib/components/MembershipCard.svelte';
	import type { UserData } from '$lib/utils/types';

	let { data } = $props<{ data: { user: UserData } }>();
</script>

<MembershipCard user={data.user} />
