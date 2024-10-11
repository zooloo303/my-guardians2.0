import  { MembershipType } from '$lib/utils/types';
import type { ProfileData, InventoryItem, InventoryItemWithComponents } from './types';

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
export function getUniqueInventoryItems(profileData: ProfileData): InventoryItemWithComponents[] {
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
  const itemMap = new Map(uniqueItems.map(item => [item.itemInstanceId, item]));
  const uniqueItemsWithComponents = Array.from(itemMap.values()).map(item => ({
    ...item,
    instance: profileData.inventoryData.itemComponents.instances.data[item.itemInstanceId],
    stats: profileData.inventoryData.itemComponents.stats.data[item.itemInstanceId]?.stats,
    displayItemHash: item.overrideStyleItemHash || item.itemHash
  }));
  return uniqueItemsWithComponents;
}