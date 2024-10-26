import type { ArmorPiece, DestinyInventoryItemDefinition, CompleteInventoryResponse } from './types';
import { getArmorForClass, getArmorMods, getSubclassFragments } from './helpers';

interface StatTotal {
  [statHash: string]: number;
}

function calculateBaseStats(armor: ArmorPiece[]): StatTotal {
  const totals: StatTotal = {};
  
  armor.forEach(piece => {
    Object.entries(piece.stats).forEach(([statHash, stat]) => {
      totals[statHash] = (totals[statHash] || 0) + stat.value;
    });
  });
  
  console.log('Calculated base stats:', totals);
  return totals;
}

function findBestArmorForStat(
  availableArmor: ArmorPiece[],
  targetStatHash: string,
  excludeSlots: string[] = []
): ArmorPiece | null {
  console.log(`Finding best armor for stat ${targetStatHash}. Excluded slots:`, excludeSlots);
  console.log('Available armor pieces:', availableArmor.length);

  const filteredArmor = availableArmor.filter(piece => !excludeSlots.includes(piece.itemTypeDisplayName));
  console.log('Filtered armor pieces:', filteredArmor.length);

  const bestPiece = filteredArmor.reduce((best, current) => {
    const bestValue = best?.stats[targetStatHash]?.value || 0;
    const currentValue = current.stats[targetStatHash]?.value || 0;
    
    const currentTotal = Object.values(current.stats).reduce((sum, stat) => sum + stat.value, 0);
    console.log(`Evaluating piece: ${current.name}, stat value: ${currentValue}, total stats: ${currentTotal}`);
    
    if (currentTotal < 60 && currentValue < 25) {
      console.log(`Skipping piece due to low stats: ${current.name}`);
      return best;
    }
    
    if (currentValue > bestValue) {
      console.log(`Found better piece: ${current.name} (${currentValue} > ${bestValue})`);
      return current;
    }
    return best;
  }, null as ArmorPiece | null);

  console.log('Best piece found:', bestPiece?.name || 'None');
  return bestPiece;
}

function selectArmorSet(
  availableArmor: ArmorPiece[],
  exoticPiece: ArmorPiece,
  statPriorities: string[]
): ArmorPiece[] {
  console.log('Starting armor set selection');
  console.log('Exotic piece:', exoticPiece.name);
  console.log('Stat priorities:', statPriorities);
  console.log('Available armor pieces:', availableArmor.length);

  const selectedPieces: ArmorPiece[] = [exoticPiece];
  const excludeSlots = [exoticPiece.itemTypeDisplayName];
  
  for (const statHash of statPriorities) {
    console.log(`\nProcessing priority stat: ${statHash}`);
    const bestPiece = findBestArmorForStat(availableArmor, statHash, excludeSlots);
    if (bestPiece) {
      console.log(`Selected piece for ${statHash}:`, bestPiece.name);
      selectedPieces.push(bestPiece);
      excludeSlots.push(bestPiece.itemTypeDisplayName);
    }
    
    if (excludeSlots.length === 4) {
      console.log('All main armor slots filled');
      break;
    }
  }
  
  while (excludeSlots.length < 4) {
    console.log('\nFilling remaining slots with highest priority stat:', statPriorities[0]);
    const bestPiece = findBestArmorForStat(availableArmor, statPriorities[0], excludeSlots);
    if (bestPiece) {
      console.log('Selected additional piece:', bestPiece.name);
      selectedPieces.push(bestPiece);
      excludeSlots.push(bestPiece.itemTypeDisplayName);
    } else {
      console.log('No more suitable pieces found');
      break;
    }
  }
  
  const classItem = availableArmor.find(piece => 
    piece.itemTypeDisplayName === 'Warlock Bond' || 
    piece.itemTypeDisplayName === 'Hunter Cloak' ||
    piece.itemTypeDisplayName === 'Titan Mark'
  );
  if (classItem) {
    console.log('Added class item:', classItem.name);
    selectedPieces.push(classItem);
  } else {
    console.log('No class item found');
  }
  
  console.log('\nFinal selected pieces:', selectedPieces.map(p => p.name));
  return selectedPieces;
}

function optimizeModsAndFragments(
  baseStats: StatTotal,
  statPriorities: string[],
  availableMods: DestinyInventoryItemDefinition[],
  availableFragments: DestinyInventoryItemDefinition[]
): {
  selectedMods: DestinyInventoryItemDefinition[];
  selectedFragments: DestinyInventoryItemDefinition[];
  finalStats: StatTotal;
} {
  const selectedMods: DestinyInventoryItemDefinition[] = [];
  const selectedFragments: DestinyInventoryItemDefinition[] = [];
  const finalStats = { ...baseStats };

  // First try to use fragments that boost the stats we want
  for (const statHash of statPriorities) {
    if (selectedFragments.length >= 3) break;

    // Try to find fragments that boost this stat
    const usefulFragments = availableFragments
      .filter(f => !selectedFragments.includes(f))
      .filter(f => {
        // Make sure investmentStats exists and is an array
        if (!Array.isArray(f.investmentStats)) {
          return false;
        }
        
        return f.investmentStats.some(stat => 
          stat?.statTypeHash?.toString() === statHash && 
          stat.value > 0 && 
          stat.isConditionallyActive
        );
      });

    for (const fragment of usefulFragments) {
      if (selectedFragments.length >= 3) break;
      
      // Find the stat bonus value for this stat
      const statBonus = fragment.investmentStats?.find(stat => 
        stat?.statTypeHash?.toString() === statHash && 
        stat.isConditionallyActive
      )?.value || 0;
      
      if (statBonus > 0) {
        selectedFragments.push(fragment);
        // Apply all stat changes from this fragment
        fragment.investmentStats?.forEach(stat => {
          if (stat.isConditionallyActive) {
            const statHashStr = stat.statTypeHash.toString();
            finalStats[statHashStr] = (finalStats[statHashStr] || 0) + stat.value;
          }
        });
      }
    }
  }

  // Then use mods to fill in the gaps, focusing on highest priority stats first
  for (const statHash of statPriorities) {
    const currentValue = finalStats[statHash] || 0;
    const neededForMax = 100 - currentValue;
    
    if (neededForMax <= 0) continue;
    
    // Get stat name for mod matching
    const statName = {
      '2996146975': 'Mobility',
      '392767087': 'Resilience',
      '1943323491': 'Recovery',
      '1735777505': 'Discipline',
      '144602215': 'Intellect',
      '4244567218': 'Strength'
    }[statHash];

    console.log(`Looking for mods for ${statName}, need ${neededForMax} more points`);
    
    // We can add up to 5 mods (one per armor piece)
    const modsNeeded = Math.min(Math.ceil(neededForMax / 10), 5 - selectedMods.length);
    
    for (let i = 0; i < modsNeeded; i++) {
      if (selectedMods.length >= 5) break;
      
      // Look for major (+10) mods first
      const majorMod = availableMods.find(m => 
        m.displayProperties.name === `${statName} Mod` && 
        !selectedMods.includes(m)
      );
      
      if (majorMod) {
        console.log(`Selected +10 mod: ${majorMod.displayProperties.name}`);
        selectedMods.push(majorMod);
        finalStats[statHash] = (finalStats[statHash] || 0) + 10;
      } else {
        // Fall back to minor (+5) mods if no major mod is available
        const minorMod = availableMods.find(m => 
          m.displayProperties.name === `Minor ${statName} Mod` && 
          !selectedMods.includes(m)
        );
        
        if (minorMod) {
          console.log(`Selected +5 mod: ${minorMod.displayProperties.name}`);
          selectedMods.push(minorMod);
          finalStats[statHash] = (finalStats[statHash] || 0) + 5;
        } else {
          console.log(`No mods available for ${statName}`);
          break;
        }
      }
    }
  }
  
  console.log('Selected mods:', selectedMods.map(m => m.displayProperties.name));
  console.log('Selected fragments:', selectedFragments.map(f => f.displayProperties.name));
  console.log('Final stats:', finalStats);

  return {
    selectedMods,
    selectedFragments,
    finalStats
  };
}

export async function optimizeArmor(
  inventoryData: CompleteInventoryResponse,
  characterClass: number,
  subclassHash: string,
  exoticArmorPiece: ArmorPiece,
  statPriorities: string[]
): Promise<{
  armorPieces: ArmorPiece[];
  mods: DestinyInventoryItemDefinition[];
  fragments: DestinyInventoryItemDefinition[];
  finalStats: StatTotal;
}> {
  console.log('\n=== Starting Armor Optimization ===');
  console.log('Character Class:', characterClass);
  console.log('Subclass Hash:', subclassHash);
  console.log('Exotic Piece:', exoticArmorPiece.name);
  console.log('Stat Priorities:', statPriorities);

  const legendaryArmor = await getArmorForClass(inventoryData, characterClass, 5);
  console.log('Found legendary armor pieces:', legendaryArmor.length);
  
  const availableArmor = legendaryArmor.filter(
    piece => piece.itemTypeDisplayName !== exoticArmorPiece.itemTypeDisplayName
  );
  console.log('Available armor after exotic filter:', availableArmor.length);
  
  const selectedArmor = selectArmorSet(availableArmor, exoticArmorPiece, statPriorities);
  console.log('Selected armor pieces:', selectedArmor.length);
  
  const baseStats = calculateBaseStats(selectedArmor);
  console.log('Base stats for selected armor:', baseStats);
  
  console.log('\nFetching mods and fragments...');
  const [availableMods, availableFragments] = await Promise.all([
    getArmorMods(),
    getSubclassFragments(subclassHash)
  ]);
  console.log('Available mods:', availableMods.length);
  console.log('Available fragments:', availableFragments.length);
  
  const { selectedMods, selectedFragments, finalStats } = optimizeModsAndFragments(
    baseStats,
    statPriorities,
    availableMods,
    availableFragments
  );
  
  console.log('\n=== Optimization Results ===');
  console.log('Selected mods:', selectedMods.map(m => m.displayProperties.name));
  console.log('Selected fragments:', selectedFragments.map(f => f.displayProperties.name));
  console.log('Final stats:', finalStats);
  
  return {
    armorPieces: selectedArmor,
    mods: selectedMods,
    fragments: selectedFragments,
    finalStats
  };
}
