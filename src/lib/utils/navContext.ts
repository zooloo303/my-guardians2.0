import { getContext, setContext } from 'svelte';

export const NAV_CONTEXT_KEY = 'navContext';

export function setNavContext(currentPath: string) {
  setContext(NAV_CONTEXT_KEY, { currentPath });
}

export function getNavContext() {
  return getContext<{ currentPath: string }>(NAV_CONTEXT_KEY);
}