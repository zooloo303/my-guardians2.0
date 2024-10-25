import { getArmorForClass, getArmorMods, getSubclassFragments } from './helpers';
import type { ArmorPiece, DestinyInventoryItemDefinition, CompleteInventoryResponse } from './types';

export async function optimizeArmor(
  inventoryData: CompleteInventoryResponse,
  characterClass: number,
  subclassHash: string,
  exoticArmorPiece: ArmorPiece,
  statPriorities: string[]
): Promise<{
  armorPieces: ArmorPiece[],
  mods: DestinyInventoryItemDefinition[],
  fragments: DestinyInventoryItemDefinition[]
}> {
  console.log('Optimizing armor with inputs:', {
    inventoryData,
    characterClass,
    subclassHash,
    exoticArmorPiece,
    statPriorities
  });
//   console.log('Inventory data structure:', Object.keys(inventoryData));

  // 1. Get all legendary armor pieces for the character class
  const legendaryArmor = await getArmorForClass(inventoryData, characterClass, 5); // 5 is for Legendary tier

  // 2. Filter out armor pieces that occupy the same slot as the exotic
  const availableArmor = legendaryArmor.filter(piece => piece.itemTypeDisplayName !== exoticArmorPiece.itemTypeDisplayName);

  // 3. Select the best armor pieces based on stat priorities
  const selectedArmor = selectBestArmorPieces(availableArmor, exoticArmorPiece, statPriorities);

  // 4. Get available armor mods
  const allMods = await getArmorMods();
  const availableMods = allMods.filter(mod => mod.displayProperties.name.includes('Major') || mod.displayProperties.name.includes('Minor'));

  // 5. Select and apply mods to boost priority stats
  const selectedMods = selectAndApplyMods(selectedArmor, availableMods, statPriorities);

  // 6. Get and select subclass fragments
  const allFragments = await getSubclassFragments(subclassHash);
  const selectedFragments = selectFragments(allFragments, statPriorities);

  return {
    armorPieces: selectedArmor,
    mods: selectedMods,
    fragments: selectedFragments
  };
}

function selectBestArmorPieces(availableArmor: ArmorPiece[], exoticArmor: ArmorPiece, statPriorities: string[]): ArmorPiece[] {
  const armorSlots = ['Helmet', 'Gauntlets', 'Chest Armor', 'Leg Armor'];
  const selectedArmor: ArmorPiece[] = [exoticArmor];

  // Group armor by slot
  const armorBySlot = armorSlots.reduce((acc, slot) => {
    acc[slot] = availableArmor.filter(piece => piece.itemTypeDisplayName === slot);
    return acc;
  }, {} as Record<string, ArmorPiece[]>);

  // Select the best piece for each remaining slot
  for (const slot of armorSlots) {
    if (exoticArmor.itemTypeDisplayName !== slot) {
      const bestPiece = armorBySlot[slot].reduce((best, current) => {
        const bestScore = calculateArmorScore(best, statPriorities);
        const currentScore = calculateArmorScore(current, statPriorities);
        return currentScore > bestScore ? current : best;
      });
      selectedArmor.push(bestPiece);
    }
  }

  return selectedArmor;
}

function calculateArmorScore(armor: ArmorPiece, statPriorities: string[]): number {
  return statPriorities.reduce((score, stat, index) => {
    const statValue = armor.stats[stat]?.value || 0;
    return score + statValue * (3 - index); // Weight stats by priority
  }, 0);
}

function selectAndApplyMods(armor: ArmorPiece[], availableMods: DestinyInventoryItemDefinition[], statPriorities: string[]): DestinyInventoryItemDefinition[] {
  const selectedMods: DestinyInventoryItemDefinition[] = [];
  const remainingStats = [...statPriorities];

  for (const armorPiece of armor) {
    if (remainingStats.length === 0) break;

    const bestMod = availableMods.reduce((best, current) => {
      const bestScore = calculateModScore(best, remainingStats);
      const currentScore = calculateModScore(current, remainingStats);
      return currentScore > bestScore ? current : best;
    });

    if (bestMod) {
      selectedMods.push(bestMod);
      // Remove the stat that was just boosted from remainingStats
      const boostedStat = getBoostedStat(bestMod);
      if (boostedStat) {
        const index = remainingStats.indexOf(boostedStat);
        if (index > -1) remainingStats.splice(index, 1);
      }
    }
  }

  return selectedMods;
}

function calculateModScore(mod: DestinyInventoryItemDefinition, remainingStats: string[]): number {
  const boostedStat = getBoostedStat(mod);
  if (!boostedStat) return 0;
  const statIndex = remainingStats.indexOf(boostedStat);
  return statIndex > -1 ? remainingStats.length - statIndex : 0;
}

function getBoostedStat(mod: DestinyInventoryItemDefinition): string | null {
  // This is a placeholder. You'll need to implement logic to determine which stat a mod boosts
  // based on your game's data structure
  return null;
}

function selectFragments(fragments: DestinyInventoryItemDefinition[], statPriorities: string[]): DestinyInventoryItemDefinition[] {
  const scoredFragments = fragments.map(fragment => ({
    fragment,
    score: calculateFragmentScore(fragment, statPriorities)
  }));

  scoredFragments.sort((a, b) => b.score - a.score);

  return scoredFragments.slice(0, 3).map(sf => sf.fragment);
}

function calculateFragmentScore(fragment: DestinyInventoryItemDefinition, statPriorities: string[]): number {
  // This is a placeholder. You'll need to implement logic to calculate a score based on
  // how well the fragment aligns with the stat priorities
  return 0;
}
