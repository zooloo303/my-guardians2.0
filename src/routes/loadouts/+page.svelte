<script lang="ts">
  import LoadoutList from '$lib/components/LoadoutList.svelte';
  import type { UserData, ProfileData } from '$lib/utils/types';
  let { data } = $props<{ data: { user: UserData | null; profileData: ProfileData | null } }>();

  let characters = $derived(data.profileData?.characters || {});
  let loadouts = $derived(data.profileData?.loadouts || []);
</script>

<LoadoutList {characters} {loadouts} />

