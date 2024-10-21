import  { MembershipType } from '$lib/utils/types';
import type { ProfileData, InventoryItem, InventoryItemWithComponents, CompleteInventoryResponse } from './types';

export const membershipTypes: Record<MembershipType, string> = {
	[MembershipType.Xbox]: 'Xbox',
	[MembershipType.PlayStation]: 'PlayStation',
	[MembershipType.Steam]: 'Steam',
	[MembershipType.Blizzard]: 'Blizzard',
	[MembershipType.Stadia]: 'Stadia'
};
export const bngBaseUrl = 'https://www.bungie.net';
export const itemPlaceHolder = 2166136261;

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
    sockets: profileData.inventoryData.itemComponents.sockets.data[item.itemInstanceId],
    displayItemHash: item.overrideStyleItemHash || item.itemHash
  }));
  return uniqueItemsWithComponents;
}

export function findItemHashByInstanceId(profileData: ProfileData, itemInstanceId: string): number | undefined {
  const allItems = getUniqueInventoryItems(profileData);
  const item = allItems.find(item => item.itemInstanceId === itemInstanceId);
  return item ? item.itemHash : undefined;
}

export function findItemInInventory(
  inventoryData: CompleteInventoryResponse | null,
  itemInstanceId: string,
): { item: InventoryItem; location: string } | undefined {
  if (!inventoryData) return undefined;

  // Check profile inventory (vault)
  const vaultItem = inventoryData.profileInventory.items.find(
    (i) => i.itemInstanceId === itemInstanceId,
  );
  if (vaultItem) {
    return { item: vaultItem, location: "vault" };
  }
  // Check character inventories and equipment
  for (const [characterId, inventory] of Object.entries(
    inventoryData.characterInventories,
  )) {
    const inventoryItem = inventory.items.find(
      (i) => i.itemInstanceId === itemInstanceId,
    );
    if (inventoryItem) {
      return { item: inventoryItem, location: characterId };
    }
  }
  for (const [characterId, equipment] of Object.entries(
    inventoryData.characterEquipment,
  )) {
    const equipmentItem = equipment.items.find(
      (i) => i.itemInstanceId === itemInstanceId,
    );
    if (equipmentItem) {
      return { item: equipmentItem, location: characterId };
    }
  }
  return undefined;
}