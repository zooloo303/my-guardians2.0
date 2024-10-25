// User types
export interface BungieUserProfile {
	about: string;
	cachedBungieGlobalDisplayName: string;
	cachedBungieGlobalDisplayNameCode: number;
	context: {
		isFollowing: boolean;
		ignoreStatus: {
			isIgnored: boolean;
			ignoreFlags: number;
		};
	};
	displayName: string;
	firstAccess: string;
	isDeleted: boolean;
	lastUpdate: string;
	locale: string;
	localeInheritDefault: boolean;
	membershipId: string;
	profilePicture: number;
	profilePicturePath: string;
	profileTheme: number;
	profileThemeName: string;
	psnDisplayName: string;
	showActivity: boolean;
	showGroupMessaging: boolean;
	statusDate: string;
	statusText: string;
	steamDisplayName: string;
	successMessageFlags: string;
	twitchDisplayName: string;
	uniqueName: string;
	userTitle: number;
	userTitleDisplay: string;
}
export interface BungieNetUser {
	membershipId: string;
	displayName: string;
	profilePicturePath: string;
}
export interface DestinyMembership {
	LastSeenDisplayName: string;
	LastSeenDisplayNameType: number;
	applicableMembershipTypes: number[];
	bungieGlobalDisplayName: string;
	bungieGlobalDisplayNameCode: number;
	crossSaveOverride: number;
	displayName: string;
	iconPath: string;
	isPublic: boolean;
	membershipId: string;
	membershipType: MembershipType;
}
export interface UserData {
	bungieNetUser: BungieNetUser;
	destinyMemberships: DestinyMembership[];
}

// profileData
export interface ProfileData {
	characters: Character[];
	inventoryData: CompleteInventoryResponse;
	loadouts: Loadout[];
}
// Character types

export interface Character {
	characterId: string;
	membershipType: number;
	dateLastPlayed: string;
	minutesPlayedTotal: string;
	light: number;
	stats: { [key: string]: number };
	raceType: number;
	genderType: number;
	classType: ClassType;
	emblemPath: string;
	emblemBackgroundPath: string;
	emblemColor: {
		red: number;
		green: number;
		blue: number;
		alpha: number;
	};
}

export interface InventoryItem {
	itemHash: number;
	itemInstanceId: string;
	quantity: number;
	bindStatus: number;
	location: number;
	bucketHash: number;
	transferStatus: number;
	lockable: boolean;
	state: number;
	dismantlePermission: number;
	isWrapper: boolean;
	tooltipNotificationIndexes: number[];
	overrideStyleItemHash?: number;
}
export interface ItemComponents {
	instances: { data: { [itemInstanceId: string]: ItemInstance } };
	stats: { data: { [itemInstanceId: string]: { stats: ItemStats } } };
	sockets: { data: { [itemInstanceId: string]: ItemSockets } };
}
export interface ItemSockets {
	sockets: ItemSocket[];
}
export interface ItemSocket {
	plugHash: number;
	isEnabled: boolean;
	isVisible: boolean;
}
export interface InventoryItemWithComponents extends InventoryItem {
	instance?: ItemInstance;
	stats?: ItemStats;
	sockets?: ItemSockets;
}
export interface CompleteInventoryResponse {
	profileInventory: {
		items: InventoryItem[];
	};
	characterInventories: {
		[characterId: string]: {
			items: InventoryItem[];
		};
	};
	characterEquipment: {
		[characterId: string]: {
			items: InventoryItem[];
		};
	};
	itemComponents: ItemComponents;
}
export interface ItemInstance {
	damageType: number;
	damageTypeHash: number;
	primaryStat?: {
		statHash: number;
		value: number;
	};
	itemLevel: number;
	quality: number;
	isEquipped: boolean;
	canEquip: boolean;
	equipRequiredLevel: number;
	unlockHashesRequiredToEquip: number[];
	cannotEquipReason: number;
}
export interface ItemStat {
	statHash: number;
	value: number;
	minimum?: number;
	maximum?: number;
	displayMaximum?: number;
}
export interface ItemStats {
	[statHash: string]: ItemStat;
}
export interface DestinyItemTransferRequest {
	itemReferenceHash: number;
	stackSize: number;
	transferToVault: boolean;
	itemId: string;
	characterId: string;
	membershipType: number;
}
export interface DestinyPostmasterTransferRequest {
	itemReferenceHash: number;
	stackSize: number;
	itemId: string;
	characterId: string;
	membershipType: number;
}
export interface DestinyItemActionRequest {
	itemId: string;
	characterId: string;
	membershipType: number;
}
export interface DestinyItemSetActionRequest {
	itemIds: string[];
	characterId: string;
	membershipType: number;
}
export interface DestinyEquipItemResults {
	equipResults: {
		itemInstanceId: string;
		equipStatus: number;
	}[];
}
export type BungieApiRequestBody =
	| DestinyLoadoutActionRequest
	| DestinyLoadoutUpdateActionRequest
	| DestinyItemTransferRequest
	| DestinyPostmasterTransferRequest
	| DestinyItemActionRequest
	| DestinyItemSetActionRequest
	| Record<string, never>;

// Loadout types
export interface DestinyLoadoutColorDefinition {
	colorImagePath: string;
	hash: number;
}
export interface DestinyLoadoutIconDefinition {
	iconImagePath: string;
	hash: number;
}
export interface DestinyLoadoutNameDefinition {
	name: string;
	hash: number;
}
export interface Loadout {
	colorHash: number;
	iconHash: number;
	nameHash: number;
	items: LoadoutItem[];
}
export interface CharacterLoadouts {
	[characterId: string]: {
		loadouts: Loadout[];
	};
}
export interface LoadoutItem {
	itemInstanceId: string;
	plugItemHashes: number[];
}
export interface LoadoutItemWithComponents extends InventoryItemWithComponents {
	plugItemHashes: number[];
	name?: string;
	icon?: string;
  }
export interface DestinyLoadoutActionRequest {
	loadoutIndex: number;
	characterId: string;
	membershipType: number;
}
export interface DestinyLoadoutUpdateActionRequest extends DestinyLoadoutActionRequest {
	colorHash?: number;
	iconHash?: number;
	nameHash?: number;
}
export interface LoadoutActionResponse {
	Response: number;
	ErrorCode: number;
	ThrottleSeconds: number;
	ErrorStatus: string;
	Message: string;
	MessageData: { [key: string]: string };
	DetailedErrorTrace?: string;
}

// Definition types
export interface DestinyInventoryItemDefinition {
	hash: number;
	displayProperties: {
		name: string;
		icon: string;
		description: string;
	};
	itemType: number;
	itemTypeDisplayName: string;
	itemSubType: number;
	classType: number;
	breakerType: number;
	stats: ItemStats;
	investmentStats: [statTypeHash: number, value: number, isConditionallyActive: boolean];
	inventory?: {
		bucketTypeHash: number;
		tierType: number;
		tierTypeName: string;
	};
	itemCategoryHashes: number[];
	defaultDamageTypeHash?: number;
	flavorText?: string;
	screenshot?: string;
	sockets?: {
		socketEntries: Array<{
			reusablePlugItems: Array<{
				plugItemHash: number;
			}>;
		}>;
	};
	hasDisplayableStats: boolean;
	primaryBaseStatHash: number;
}
export interface DestinyInventoryBucketDefinition {
	hash: number;
	displayProperties: {
		name: string;
		icon: string;
		description: string;
	};
	scope: number;
	category: number;
	bucketOrder: number;
	location: number;
	enabled: boolean;
}

export interface DestinyDamageTypeDefinition {
	displayProperties: {
		name: string;
		description: string;
		icon: string;
	};
}
export interface DestinyStatDefinition {
	displayProperties: {
		name: string;
		description: string;
		icon: string;
	};
	aggregationType: number;
	hasComputedBlock: boolean;
	statCategory: number;
	interpolate: boolean;
}
//other types
export interface SearchCriteria {
	itemName: string;
	itemType: { value: DestinyItemType; label: string } | null;
	itemSubType: { value: DestinyItemSubType; label: string } | null;
	damageType: { value: DamageType; label: string } | null;
	breakerType: { value: BreakerType; label: string } | null;
	classType: { value: ClassType; label: string } | null; // Changed from bucketType to classType
	tierType: { value: TierType; label: string } | null;
}
export interface ArmorPiece {
	itemHash: number;
	itemInstanceId: string;
	name: string;
	icon: string;
	itemTypeDisplayName: string;
	stats: ItemStats;
	tierType?: number;
  }
  
//   export interface ModsAndFragments {
// 	itemHash: number;
// 	name: string;
// 	description: string;
// 	investmentStats: [number, number, boolean][];
//   }
// enum types
export enum MembershipType {
	Xbox = 1,
	PlayStation = 2,
	Steam = 3,
	Blizzard = 4,
	Stadia = 5
}
export enum ClassType {
	Titan = 0,
	Hunter = 1,
	Warlock = 2,
	Unknown = 3
}
export enum RaceType {
	Human = 0,
	Awoken = 1,
	Exo = 2,
	Unknown = 3
}
export enum DestinyItemType {
	Armor = 2,
	Weapon = 3,
	Emblem = 14,
	Subclass = 16,
	Ship = 21,
	Vehicle = 22,
	Ghost = 24
}
export enum DestinyItemSubType {
	AutoRifle = 6,
	Shotgun = 7,
	Machinegun = 8,
	HandCannon = 9,
	RocketLauncher = 10,
	FusionRifle = 11,
	SniperRifle = 12,
	PulseRifle = 13,
	ScoutRifle = 14,
	Sidearm = 17,
	Sword = 18,
	Mask = 19,
	LinearFusionRifle = 22,
	GrenadeLauncher = 23,
	SubmachineGun = 24,
	TraceRifle = 25,
	HelmetArmor = 26,
	GauntletsArmor = 27,
	ChestArmor = 28,
	LegArmor = 29,
	ClassArmor = 30,
	Bow = 31,
	Glaive = 33
}
export enum DamageType {
	None = 0,
	Kinetic = 1,
	Arc = 2,
	Solar = 3,
	Void = 4,
	Raid = 5,
	Stasis = 6,
	Strand = 7
}
export enum TierType {
	Basic = 2,
	Common = 3,
	Rare = 4,
	Legendary = 5,
	Exotic = 6
}
export enum BreakerType {
	AntiBarrier = 1,
	Overload = 2,
	Unstoppable = 3
}
export enum DestinyItemLocation {
	Unknown = 0,
	Inventory = 1,
	Vault = 2,
	Vendor = 3,
	Postmaster = 4
}

//hashes I cannot be bothered to get from manifest
export const BUCKET_HASH: { [key: number]: string } = {
	3448274439: "Helmet",
	3551918588: "Gauntlets",
	14239492: "Chest Armor",
	20886954: "Leg Armor",
	1585787867: "Class Armor",
	1498876634: "Kinetic Weapon",
	2465295065: "Energy Weapon",
	953998645: "Power Weapon",
	4023194814: "Ghost",
	138197802: "General",
};
export const SUBCLASS_BUCKET_HASH = [
	3284755031, // subclass
];
export const ARMOR_BUCKET_HASH = [
	3448274439, // Helmet
	3551918588, // Gauntlets
	14239492, // Chest Armor
	20886954, // Leg Armor
	1585787867, // Class Armor
];
export const WEAPON_BUCKET_HASH = [
	1498876634, // Kinetic Weapon
	2465295065, // Energy Weapon
	953998645, // Power Weapon
	4023194814, // Ghost
];
export const UNWANTED_BUCKET_HASH = [
	3284755031, 444348033, 497170007, 1801258597, 2401704334, 2422292810,
	3621873013,
];
export const STAT_ORDER = [
	"1935470627", // Power
	"2996146975", // Mobility
	"392767087", // Resilience
	"1943323491", // Recovery
	"1735777505", // Discipline
	"144602215", // Intellect
	"4244567218", // Strength
];
export const DEFAULT_STAT_ORDER = [
	"2996146975", // Mobility
	"392767087", // Resilience
	"1943323491", // Recovery
	"1735777505", // Discipline
	"144602215", // Intellect
	"4244567218", // Strength
];
export const ITEM_ORDER = [
	1498876634, // Kinetic Weapons
	2465295065, // Energy Weapons
	953998645, // Power Weapons
	4023194814, // Ghost
	3448274439, // Helmet
	3551918588, // Gauntlets
	14239492, // Chest Armor
	20886954, // Leg Armor
	1585787867, // Class Armor
	2025709351, // Vehicle
	284967655, // Ships
	4274335291, // Emblems
	3683254069, // Finishers
	375726501, // Engrams
	1345459588, // Quests
];
