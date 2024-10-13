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
export enum MembershipType {
	Xbox = 1,
	PlayStation = 2,
	Steam = 3,
	Blizzard = 4,
	Stadia = 5
}

// profileData
export interface ProfileData {
	characters: Character[];
	inventoryData: CompleteInventoryResponse;
	loadouts: Loadout[];
}
// Character types
export enum ClassType {
	Titan = 0,
	Hunter = 1,
	Warlock = 2,
	Unknown = 3
}
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

// Item types
export enum DestinyItemType {
	None = 0,
	Currency = 1,
	Armor = 2,
	Weapon = 3,
	Message = 7,
	Engram = 8,
	Consumable = 9,
	ExchangeMaterial = 10,
	MissionReward = 11,
	QuestStep = 12,
	QuestStepComplete = 13,
	Emblem = 14,
	Quest = 15,
	Subclass = 16,
	ClanBanner = 17,
	Aura = 18,
	Mod = 19,
	Dummy = 20,
	Ship = 21,
	Vehicle = 22,
	Emote = 23,
	Ghost = 24,
	Package = 25,
	Bounty = 26,
	Wrapper = 27,
	SeasonalArtifact = 28,
	Finisher = 29,
	Pattern = 30
}
export enum DamageType {
	None = 0,
	Kinetic = 1,
	Arc = 2,
	Thermal = 3,
	Void = 4,
	Raid = 5,
	Stasis = 6,
	Strand = 7
}
export enum TierType {
	Unknown = 0,
	Currency = 1,
	Basic = 2,
	Common = 3,
	Rare = 4,
	Superior = 5,
	Exotic = 6
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
