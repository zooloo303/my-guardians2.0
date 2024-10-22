import { invalidateAll } from '$app/navigation';

let lastRefreshTime = 0;
const REFRESH_COOLDOWN = 10000; // 10 seconds cooldown

export async function refreshProfileData() {
  const now = Date.now();
  if (now - lastRefreshTime < REFRESH_COOLDOWN) {
    console.log('Refresh on cooldown');
    return;
  }

  try {
    await invalidateAll();
    lastRefreshTime = now;
    console.log('Profile data refreshed');
  } catch (error) {
    console.error('Failed to refresh profile data:', error);
  }
}