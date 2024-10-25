import { MembershipType } from '$lib/utils/types';
import { getManifestData, getManifestTable } from './indexedDB';
import type {
	ProfileData,
	InventoryItem,
	InventoryItemWithComponents,
	CompleteInventoryResponse,
	DestinyInventoryItemDefinition,
	ArmorPiece
} from './types';

export const membershipTypes: Record<MembershipType, string> = {
	[MembershipType.Xbox]: 'Xbox',
	[MembershipType.PlayStation]: 'PlayStation',
	[MembershipType.Steam]: 'Steam',
	[MembershipType.Blizzard]: 'Blizzard',
	[MembershipType.Stadia]: 'Stadia'
};
export const bngBaseUrl = 'https://www.bungie.net';
export const itemPlaceHolder = 2166136261;

export const warlockSubclasses: Record<number, string> = {
	3168997075: 'Stormcaller',
	3941205951: 'Dawnblade',
	2849050827: 'Voidwalker',
	3291545503: 'Shadebinder',
	4204413574: 'Broodweaver',
	3893112950: 'Prismatic Warlock'
};
export const hunterSubclasses: Record<number, string> = {
	2328211300: 'Arcstrider',
	2240888816: 'Gunslinger',
	2453351420: 'Nightstalker',
	873720784: 'Revenant',
	3785442599: 'Threadrunner',
	4282591831: 'Prismatic Hunter'
};
export const titanSubclasses: Record<number, string> = {
	2932390016: 'Striker',
	2550323932: 'Sunbreaker',
	2842471112: 'Sentinel',
	613647804: 'Behemoth',
	242419885: 'Berserker',
	1616346845: 'Prismatic Titan'
};

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
	uniqueItems.push(
		...profileData.inventoryData.profileInventory.items.filter((item) => item.itemInstanceId)
	);
	// Add items from characterInventories
	Object.values(profileData.inventoryData.characterInventories).forEach((inventory) => {
		uniqueItems.push(...inventory.items.filter((item) => item.itemInstanceId));
	});
	// Add items from characterEquipment
	Object.values(profileData.inventoryData.characterEquipment).forEach((equipment) => {
		uniqueItems.push(...equipment.items.filter((item) => item.itemInstanceId));
	});
	// Remove duplicates based on itemInstanceId
	const itemMap = new Map(uniqueItems.map((item) => [item.itemInstanceId, item]));
	const uniqueItemsWithComponents = Array.from(itemMap.values()).map((item) => ({
		...item,
		instance: profileData.inventoryData.itemComponents.instances.data[item.itemInstanceId],
		stats: profileData.inventoryData.itemComponents.stats.data[item.itemInstanceId]?.stats,
		sockets: profileData.inventoryData.itemComponents.sockets.data[item.itemInstanceId],
		displayItemHash: item.overrideStyleItemHash || item.itemHash
	}));
	return uniqueItemsWithComponents;
}

export function findItemHashByInstanceId(
	profileData: ProfileData,
	itemInstanceId: string
): number | undefined {
	const allItems = getUniqueInventoryItems(profileData);
	const item = allItems.find((item) => item.itemInstanceId === itemInstanceId);
	return item ? item.itemHash : undefined;
}

export function findItemInInventory(
	inventoryData: CompleteInventoryResponse | null,
	itemInstanceId: string
): { item: InventoryItem; location: string } | undefined {
	if (!inventoryData) return undefined;

	// Check profile inventory (vault)
	const vaultItem = inventoryData.profileInventory.items.find(
		(i) => i.itemInstanceId === itemInstanceId
	);
	if (vaultItem) {
		return { item: vaultItem, location: 'vault' };
	}
	// Check character inventories and equipment
	for (const [characterId, inventory] of Object.entries(inventoryData.characterInventories)) {
		const inventoryItem = inventory.items.find((i) => i.itemInstanceId === itemInstanceId);
		if (inventoryItem) {
			return { item: inventoryItem, location: characterId };
		}
	}
	for (const [characterId, equipment] of Object.entries(inventoryData.characterEquipment)) {
		const equipmentItem = equipment.items.find((i) => i.itemInstanceId === itemInstanceId);
		if (equipmentItem) {
			return { item: equipmentItem, location: characterId };
		}
	}
	return undefined;
}

export async function getArmorForClass(
	inventoryData: CompleteInventoryResponse,
	classType: number,
	tierType: number
): Promise<ArmorPiece[]> {
	console.log('getArmorForClass inputs:', { classType, tierType });

	const result: ArmorPiece[] = [];

	const inventoryLocations = [
		inventoryData.profileInventory,
		...Object.values(inventoryData.characterInventories),
		...Object.values(inventoryData.characterEquipment)
	];

	for (const location of inventoryLocations) {
		if (!location) {
			console.warn('Encountered undefined inventory location');
			continue;
		}
		if (!location.items) {
			console.warn('Location has no items array');
			continue;
		}
		for (const item of location.items) {
			const itemDef = await getManifestData<DestinyInventoryItemDefinition>(
				'DestinyInventoryItemDefinition',
				item.itemHash
			);
			if (!itemDef) {
				console.warn(`No item definition found for hash ${item.itemHash}`);
				continue;
			}
			if (
				itemDef &&
				itemDef.itemType === 2 && // Armor
				itemDef.inventory?.tierType === tierType &&
				itemDef.classType === classType
			) {
				const itemInstance = inventoryData.itemComponents.instances.data[item.itemInstanceId];
				const itemStats = inventoryData.itemComponents.stats.data[item.itemInstanceId]?.stats;

				if (itemInstance && itemStats) {
					result.push({
						itemHash: item.itemHash,
						itemInstanceId: item.itemInstanceId,
						name: itemDef.displayProperties.name,
						itemTypeDisplayName: itemDef.itemTypeDisplayName,
						stats: itemStats,
						icon: itemDef.displayProperties.icon,
						tierType: itemDef.inventory?.tierType
					});
				}
			}
		}
	}

	console.log('getArmorForClass result:', result);

	return result;
}

export async function getArmorMods(): Promise<DestinyInventoryItemDefinition[]> {
	const table = await getManifestTable<DestinyInventoryItemDefinition>(
		'DestinyInventoryItemDefinition'
	);

	return Object.values(table).filter(
		(item) =>
			item.itemType === 19 &&
			item.itemTypeDisplayName === 'General Armor Mod' &&
			item.itemCategoryHashes.includes(4104513227)
	);
}

export function getSubclassFragmentType(subclassHash: string): string {
	switch (subclassHash) {
		case '3168997075':
		case '2328211300':
		case '2932390016':
			return 'Arc Fragment';
		case '3941205951':
		case '2240888816':
		case '2550323932':
			return 'Solar Fragment';
		case '2849050827':
		case '2453351420':
		case '2842471112':
			return 'Void Fragment';
		case '3291545503':
		case '873720784':
		case '613647804':
			return 'Stasis Fragment';
		case '4204413574':
		case '3785442599':
		case '242419885':
			return 'Strand Fragment';
		case '3893112950':
		case '4282591831':
		case '1616346845':
			return 'Prismatic Fragment';
		default:
			console.error('Unknown subclass hash:', subclassHash);
			return 'Unknown Fragment';
	}
}

export async function getSubclassFragments(
	subclassHash: string
): Promise<DestinyInventoryItemDefinition[]> {
	const fragmentType = getSubclassFragmentType(subclassHash);
	const table = await getManifestTable<DestinyInventoryItemDefinition>(
		'DestinyInventoryItemDefinition'
	);

	return Object.values(table).filter(
		(item) =>
			item.itemType === 19 && // Mod
			item.itemTypeDisplayName === fragmentType
	);
}
