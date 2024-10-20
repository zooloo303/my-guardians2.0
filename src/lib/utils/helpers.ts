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

// export function groupItemsBy<T, K extends string | number>(
//   items: T[],
//   keyFn: (item: T) => K,
// ): Record<K, T[]> {
//   return items.reduce(
//     (acc, item) => {
//       const key = keyFn(item);
//       if (!acc[key]) {
//         acc[key] = [];
//       }
//       acc[key].push(item);
//       return acc;
//     },
//     {} as Record<K, T[]>,
//   );
// }

// export function getLegendaryArmorForClass(
//   inventoryData: CompleteInventoryResponse,
//   classType: number,
//   manifestData: Record<string, DestinyInventoryItemDefinition>,
// ): SlimArmorPiece[] {
//   const result: SlimArmorPiece[] = [];

//   // Iterate through all inventory locations
//   const inventoryLocations = [
//     inventoryData.profileInventory,
//     ...Object.values(inventoryData.characterInventories),
//     ...Object.values(inventoryData.characterEquipment),
//   ];

//   for (const location of inventoryLocations) {
//     for (const item of location.items) {
//       const itemDef = manifestData[item.itemHash];

//       // Check if the item is legendary armor for the specified class
//       if (
//         itemDef &&
//         itemDef.itemType === 2 && // Armor
//         itemDef.inventory?.tierType === 5 && // Legendary
//         itemDef.classType === classType
//       ) {
//         const itemInstance =
//           inventoryData.itemComponents.instances.data[item.itemInstanceId];
//         const itemStats =
//           inventoryData.itemComponents.stats.data[item.itemInstanceId]?.stats;

//         if (itemInstance && itemStats) {
//           result.push({
//             itemHash: item.itemHash.toString(),
//             itemInstanceId: item.itemInstanceId,
//             name: itemDef.displayProperties.name,
//             itemTypeDisplayName: itemDef.itemTypeDisplayName,
//             stats: itemStats,
//           });
//         }
//       }
//     }
//   }

//   return result;
// }

// export function getArmorMods(): InventoryItem[] {
//   const manifestData = get(manifestStore).tables
//     .DestinyInventoryItemDefinition as Record<
//     string,
//     DestinyInventoryItemDefinition
//   >;

//   return Object.values(manifestData)
//     .filter(item => 
//       item.itemType === 19 && 
//       item.itemTypeDisplayName === "General Armor Mod" &&
//       item.itemCategoryHashes.includes(4104513227)
//     )
//     .map(item => ({
//       itemHash: item.hash,
//       name: item.displayProperties.name,
//       description: item.displayProperties.description,
//       icon: item.displayProperties.icon,
//       stats: item.investmentStats
//     }));
// }

// export function getSubclassFragments(itemTypeDisplayName: string) {
//   console.log(`getSubclassFragments called with itemTypeDisplayName:`, itemTypeDisplayName);
//   const manifestData = get(manifestStore).tables
//     .DestinyInventoryItemDefinition as Record<
//     string,
//     DestinyInventoryItemDefinition
//   >;

//   return Object.values(manifestData)
//     .filter(item => 
//       item.itemTypeDisplayName === itemTypeDisplayName 
//     )
//     .map(item => ({
//       itemHash: item.hash,
//       name: item.displayProperties.name,
//       description: item.displayProperties.description,
//       icon: item.displayProperties.icon,
//       stats: item.investmentStats
//     }));
// }