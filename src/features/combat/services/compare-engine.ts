import type { ComparisonResult, ComparisonInput } from "@/types/domain";

/**
 * Compare Anything — Universal Comparison Engine
 * 
 * Compares characters, weapons, artifacts, builds, and teams.
 * Uses a unified comparison infrastructure.
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
  // In production, fetch actual data from services
  // For now, return mock stats
  const mockStats: Record<string, Record<string, Record<string, number>>> = {
    character: {
      "dr-char-001": { damage: 95, survivability: 70, utility: 85, popularity: 92, winRate: 58 },
      "dr-char-002": { damage: 88, survivability: 65, utility: 80, popularity: 88, winRate: 56 },
      "dr-char-003": { damage: 75, survivability: 90, utility: 95, popularity: 95, winRate: 61 },
    },
    weapon: {
      "dr-weap-001": { atk: 674, critRate: 30, critDamage: 60, popularity: 94, winRate: 59 },
      "dr-weap-002": { atk: 655, critRate: 25, critDamage: 55, popularity: 87, winRate: 57 },
      "dr-weap-003": { atk: 590, critRate: 20, critDamage: 50, popularity: 91, winRate: 58 },
    },
    build: {
      "build-nova-01": { damage: 93, survivability: 72, consistency: 88, accessibility: 65, synergy: 95 },
      "build-nova-02": { damage: 72, survivability: 75, consistency: 80, accessibility: 98, synergy: 65 },
      "build-nova-03": { damage: 97, survivability: 78, consistency: 95, accessibility: 15, synergy: 98 },
    },
  };

  return {
    id: item.id,
    name: item.name,
    stats: mockStats[comparisonType]?.[item.id] || {},
  };
}

function determineWinner(items: ItemWithStats[], comparisonType: string): string {
  if (items.length === 0) return "";

  // Determine winner based on comparison type
  let winnerKey = "damage";
  if (comparisonType === "character") winnerKey = "winRate";
  else if (comparisonType === "weapon") winnerKey = "atk";
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

  reasoning.push(`${winnerItem.name} wins with overall superior stats.`);

  // Add specific reasoning based on type
  if (comparisonType === "character") {
    if (winnerItem.stats.winRate > 55) {
      reasoning.push("Higher win rate indicates better performance in current meta.");
    }
  } else if (comparisonType === "weapon") {
    if (winnerItem.stats.atk > 650) {
      reasoning.push("Higher base ATK provides better damage output.");
    }
  } else if (comparisonType === "build") {
    if (winnerItem.stats.damage > 90) {
      reasoning.push("Optimized for maximum damage output.");
    }
  }

  return reasoning;
}
