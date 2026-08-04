import type { SynergyPair, TeamMember, Element } from "@/types/domain";
import { characters } from "@/data/games/destiny-rising/characters";
import { logger } from "@/lib/logger";

const CONTEXT = "SynergyEngine";

/**
 * Synergy Engine v1 — Rule-Based Character Synergy Calculator
 *
 * Calculates synergy score (0-100) between any two characters
 * based on element combos, role synergy, faction bonuses, and meta patterns.
 *
 * Future: Will be replaced by AI Advisor.
 */

// ─── Element Reaction Map ───

const elementReactions: Record<string, { name: string; multiplier: number }> = {
  "Fire-Ice": { name: "Melt", multiplier: 1.5 },
  "Ice-Fire": { name: "Melt", multiplier: 1.5 },
  "Fire-Water": { name: "Vaporize", multiplier: 1.3 },
  "Water-Fire": { name: "Vaporize", multiplier: 1.3 },
  "Lightning-Water": { name: "Electro-Charge", multiplier: 1.2 },
  "Water-Lightning": { name: "Electro-Charge", multiplier: 1.2 },
  "Fire-Earth": { name: "Overloaded", multiplier: 1.4 },
  "Earth-Fire": { name: "Overloaded", multiplier: 1.4 },
  "Ice-Lightning": { name: "Superconductor", multiplier: 1.3 },
  "Lightning-Ice": { name: "Superconductor", multiplier: 1.3 },
  "Wind-Fire": { name: "Swirl", multiplier: 1.1 },
  "Fire-Wind": { name: "Swirl", multiplier: 1.1 },
  "Dark-Light": { name: "Annihilation", multiplier: 1.6 },
  "Light-Dark": { name: "Annihilation", multiplier: 1.6 },
  "Dark-Dark": { name: "Shadow Synergy", multiplier: 1.3 },
};

// ─── Role Synergy Matrix ───

const roleSynergy: Record<string, Record<string, number>> = {
  DPS: { "Sub-DPS": 85, Support: 90, Healer: 80, Tank: 75, Utility: 70, DPS: 40 },
  "Sub-DPS": { DPS: 85, Support: 80, Healer: 75, Tank: 70, Utility: 75, "Sub-DPS": 50 },
  Support: { DPS: 90, "Sub-DPS": 80, Healer: 85, Tank: 80, Utility: 85, Support: 45 },
  Healer: { DPS: 80, "Sub-DPS": 75, Support: 85, Tank: 90, Utility: 80, Healer: 35 },
  Tank: { DPS: 75, "Sub-DPS": 70, Support: 80, Healer: 90, Utility: 75, Tank: 40 },
  Utility: { DPS: 70, "Sub-DPS": 75, Support: 85, Healer: 80, Tank: 75, Utility: 50 },
};

// ─── Faction Bonus Map ───

const factionBonuses: Record<string, number> = {
  "Genesis-Genesis": 15,
  "Stellar-Stellar": 15,
  "Eclipse-Eclipse": 12,
  "Nova-Nova": 12,
  "Void-Void": 10,
};

/**
 * Calculate synergy score between two characters (0-100).
 */
export function calculateSynergy(
  charAId: string,
  charBId: string
): SynergyPair {
  const charA = characters.find((c) => c.id === charAId);
  const charB = characters.find((c) => c.id === charBId);

  if (!charA || !charB) {
    return {
      characterAId: charAId,
      characterBId: charBId,
      score: 50,
      reasons: ["Insufficient data for synergy calculation"],
    };
  }

  let score = 0;
  const reasons: string[] = [];

  // ─── Rule 1: Element Reaction (0-35 points) ───
  const reactionKey = `${charA.element}-${charB.element}`;
  const reaction = elementReactions[reactionKey];

  if (reaction) {
    const elementScore = Math.round(reaction.multiplier * 22);
    score += elementScore;
    reasons.push(`${reaction.name} reaction (${reaction.multiplier}x multiplier)`);
  } else if (charA.element === charB.element) {
    score += 12;
    reasons.push(`Same element resonance (+12)`);
  } else {
    score += 5;
    reasons.push("No elemental reaction available");
  }

  // ─── Rule 2: Role Synergy (0-30 points) ───
  const roleMatrix = roleSynergy[charA.role];
  if (roleMatrix && roleMatrix[charB.role] !== undefined) {
    const roleScore = Math.round(roleMatrix[charB.role] * 0.3);
    score += roleScore;
    if (roleScore >= 24) {
      reasons.push(`Excellent ${charA.role} + ${charB.role} role synergy`);
    } else if (roleScore >= 18) {
      reasons.push(`Good ${charA.role} + ${charB.role} compatibility`);
    }
  }

  // ─── Rule 3: Faction Bonus (0-15 points) ───
  const factionKey = `${charA.faction}-${charB.faction}`;
  const factionBonus = factionBonuses[factionKey];
  if (factionBonus) {
    score += factionBonus;
    reasons.push(`${charA.faction} faction synergy (+${factionBonus})`);
  }

  // ─── Rule 4: Tier Bonus (0-10 points) ───
  const tierMap: Record<string, number> = { "S+": 10, S: 8, "A+": 6, A: 5, "B+": 3, B: 2, C: 1 };
  const avgTier = ((tierMap[charA.tierListPlacement] || 0) + (tierMap[charB.tierListPlacement] || 0)) / 2;
  score += Math.round(avgTier);
  if (avgTier >= 7) {
    reasons.push("Both characters are top-tier");
  }

  // ─── Rule 5: Rarity Match (0-10 points) ───
  if (charA.rarity === charB.rarity) {
    score += charA.rarity === "SSR" ? 10 : 5;
    reasons.push(`Matching ${charA.rarity} rarity`);
  } else {
    score += 3;
  }

  // Cap at 100
  score = Math.min(100, Math.max(0, score));

  const elementCombo = reaction?.name;

  logger.debug(CONTEXT, `Synergy calculated: ${charA.name} ↔ ${charB.name}`, { score, reasons });

  return {
    characterAId: charAId,
    characterBId: charBId,
    score,
    reasons,
    elementCombo,
  };
}

/**
 * Calculate team synergy from all member pairs.
 */
export function calculateTeamSynergy(members: TeamMember[]): {
  overallSynergy: number;
  pairs: SynergyPair[];
} {
  const pairs: SynergyPair[] = [];

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      pairs.push(calculateSynergy(members[i].characterId, members[j].characterId));
    }
  }

  const overallSynergy = pairs.length > 0
    ? Math.round(pairs.reduce((sum, p) => sum + p.score, 0) / pairs.length)
    : 0;

  return { overallSynergy, pairs };
}

/**
 * Get top synergy partners for a character.
 */
export function getTopSynergyPartners(characterId: string, limit: number = 5): SynergyPair[] {
  const allCharacters = characters.filter((c) => c.id !== characterId);

  const synergies = allCharacters.map((c) =>
    calculateSynergy(characterId, c.id)
  );

  return synergies.sort((a, b) => b.score - a.score).slice(0, limit);
}
