import type { ComparisonResult, ComparisonInput } from "@/types/domain";
import { characters } from "@/data/games/destiny-rising/characters";
import { weapons } from "@/data/games/destiny-rising/weapons";

/**
 * Compare Anything — Universal Comparison Engine
 * 
 * Compares characters, weapons, artifacts, builds, and teams.
 * Uses real v7.3 baseline data for comparisons.
 * 
 * NOTE: Verified comparison stats (winRate, popularity, tier) are not
 * available for most items. Only data present in the v7.3 baseline is used.
 * No stats are estimated or fabricated.
 */

interface ItemWithStats {
  id: string;
  name: string;
  stats: Record<string, number>;
}

export function compareItems(input: ComparisonInput): ComparisonResult {
  const items = input.items.map((item) => getItemStats(item, input.comparisonType));
  
  if (items.length < 2) {
    return {
      items: [],
      winner: "",
      differences: [],
      reasoning: ["Need at least 2 items to compare."],
    };
  }

  // Determine winner based on overall stats
  const winner = determineWinner(items, input.comparisonType);

  // Calculate differences
  const differences = calculateDifferences(items, input.comparisonType);

  // Generate reasoning
  const reasoning = generateComparisonReasoning(items, winner, input.comparisonType);

  return {
    items,
    winner,
    differences,
    reasoning,
  };
}

function getItemStats(item: { id: string; name: string; type: string }, comparisonType: string): ItemWithStats {
  // Use real v7.3 baseline data
  if (comparisonType === "character") {
    const char = characters.find((c) => c.id === item.id);
    if (char) {
      return {
        id: char.id,
        name: char.name,
        stats: {
          // Only verified fields from v7.3 baseline
          // popularity and winRate are 0 (unverified) for all characters
        },
      };
    }
  }

  if (comparisonType === "weapon") {
    const weapon = weapons.find((w) => w.id === item.id);
    if (weapon) {
      return {
        id: weapon.id,
        name: weapon.name,
        stats: {
          // DPS from v7.3 baseline (null → 0 for comparison purposes)
          dps: weapon.dps ?? 0,
          // popularity and winRate are 0 (unverified) for all weapons
        },
      };
    }
  }

  // Builds: no verified build data in v7.3 baseline
  // Return empty stats
  return {
    id: item.id,
    name: item.name,
    stats: {},
  };
}

function determineWinner(items: ItemWithStats[], comparisonType: string): string {
  if (items.length === 0) return "";

  // Determine winner based on comparison type
  let winnerKey = "dps";
  if (comparisonType === "character") winnerKey = "popularity";
  else if (comparisonType === "weapon") winnerKey = "dps";
  else if (comparisonType === "build") winnerKey = "damage";

  let winner = items[0];
  let maxStat = winner.stats[winnerKey] || 0;

  items.forEach((item) => {
    const stat = item.stats[winnerKey] || 0;
    if (stat > maxStat) {
      maxStat = stat;
      winner = item;
    }
  });

  return winner.id;
}

function calculateDifferences(items: ItemWithStats[], comparisonType: string): { category: string; values: Record<string, number>; winner: string }[] {
  if (items.length < 2) return [];

  const categories = Object.keys(items[0].stats);
  if (categories.length === 0) return [];

  const differences: { category: string; values: Record<string, number>; winner: string }[] = [];

  categories.forEach((category) => {
    const values: Record<string, number> = {};
    items.forEach((item) => {
      values[item.id] = item.stats[category] || 0;
    });

    const max = Math.max(...Object.values(values));
    const winner = Object.entries(values).find(([, v]) => v === max)?.[0] || "";

    differences.push({
      category,
      values,
      winner,
    });
  });

  return differences;
}

function generateComparisonReasoning(items: ItemWithStats[], winner: string, comparisonType: string): string[] {
  const reasoning: string[] = [];
  const winnerItem = items.find((i) => i.id === winner);

  if (!winnerItem) return ["Unable to determine winner."];

  // Only generate reasoning based on verified data
  if (comparisonType === "weapon" && winnerItem.stats.dps > 0) {
    reasoning.push(`${winnerItem.name} has the highest verified DPS among compared weapons.`);
  } else if (comparisonType === "character") {
    reasoning.push(`${winnerItem.name} is included in the comparison. Verified meta stats are not yet available.`);
  } else if (comparisonType === "build") {
    reasoning.push(`No verified build data available for comparison.`);
  } else {
    reasoning.push(`${winnerItem.name} leads in available comparison metrics.`);
  }

  return reasoning;
}
