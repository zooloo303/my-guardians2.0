import { MembershipType } from '$lib/utils/types';

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
