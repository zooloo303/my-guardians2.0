import  { MembershipType } from '$lib/utils/types';
import type { ProfileData, InventoryItem } from './types';

export const membershipTypes: Record<MembershipType, string> = {
	[MembershipType.Xbox]: 'Xbox',
	[MembershipType.PlayStation]: 'PlayStation',
	[MembershipType.Steam]: 'Steam',
	[MembershipType.Blizzard]: 'Blizzard',
	[MembershipType.Stadia]: 'Stadia'
};
export const bngBaseUrl = 'https://www.bungie.net';
export const manifestTables = [
	'DestinyClassDefinition',
	'DestinyDamageTypeDefinition',
	'DestinyInventoryBucketDefinition',
	'DestinyInventoryItemDefinition',
	'DestinyItemCategoryDefinition',
	'DestinyLoadoutColorDefinition',
	'DestinyLoadoutConstantsDefinition',
	'DestinyLoadoutIconDefinition',
	'DestinyLoadoutNameDefinition',
	'DestinyStatDefinition'
];


// Inventory Item Helper Functions
export function getUniqueInventoryItems(profileData: ProfileData): InventoryItem[] {
  const uniqueItems: InventoryItem[] = [];

  // Add items from profileInventory
  uniqueItems.push(...profileData.inventoryData.profileInventory.items.filter(item => item.itemInstanceId));
  // Add items from characterInventories
  Object.values(profileData.inventoryData.characterInventories).forEach(inventory => {
    uniqueItems.push(...inventory.items.filter(item => item.itemInstanceId));
  });
  // Add items from characterEquipment
  Object.values(profileData.inventoryData.characterEquipment).forEach(equipment => {
    uniqueItems.push(...equipment.items.filter(item => item.itemInstanceId));
  });
  // Remove duplicates based on itemInstanceId
  return Array.from(new Map(uniqueItems.map(item => [item.itemInstanceId, item])).values());
}