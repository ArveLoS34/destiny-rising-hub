import { charactersDetail } from "@/data/games/destiny-rising/characters-detail";
import { weapons } from "@/data/games/destiny-rising/weapons";
import { builds } from "@/data/games/destiny-rising/builds";
import { teams } from "@/data/games/destiny-rising/teams";
import type { BuildScoreV2, Character, WeaponSummary, BuildSummary, TeamSummary } from "@/types/domain";

/**
 * Build Score v2 — Advanced Build Scoring System
 * 
 * Calculates comprehensive build scores with 10 sub-scores.
 * Each score is explained with reasoning.
 */

export interface BuildScoreInput {
  characterId: string;
  weaponId: string;
  buildId: string;
  teamIds: string[];
  artifactSetId?: string;
  artifactQuality?: number; // 0-100
  rotationEfficiency?: number; // 0-100
}

export function calculateBuildScoreV2(input: BuildScoreInput): BuildScoreV2 {
  const character = charactersDetail.find((c) => c.id === input.characterId);
  const weapon = weapons.find((w) => w.id === input.weaponId);
  const build = builds.find((b) => b.id === input.buildId);
  const teamMembers = input.teamIds.map((id) => teams.find((t) => t.id === id)).filter(Boolean) as TeamSummary[];

  if (!character || !weapon || !build) {
    return createDefaultScore();
  }

  // Calculate sub-scores
  const damage = calculateDamageScore(character, weapon, build);
  const survivability = calculateSurvivabilityScore(character, build);
  const energy = calculateEnergyScore(character, weapon, build);
  const consistency = calculateConsistencyScore(build);
  const accessibility = calculateAccessibilityScore(build);
  const teamSynergy = calculateTeamSynergyScore(character, teamMembers);
  const weaponEfficiency = calculateWeaponEfficiencyScore(character, weapon);
  const artifactQuality = input.artifactQuality || 70;
  const rotationEfficiency = input.rotationEfficiency || 75;
  const futureScaling = calculateFutureScalingScore(character, build);

  // Calculate weighted overall score
  const weights: Record<keyof BuildScoreV2["subscores"], number> = {
    damage: 0.20,
    survivability: 0.10,
    energy: 0.10,
    consistency: 0.10,
    accessibility: 0.10,
    teamSynergy: 0.15,
    weaponEfficiency: 0.10,
    artifactQuality: 0.05,
    rotation: 0.05,
    futureScaling: 0.05,
  };

  const overall = Math.round(
    damage * weights.damage +
    survivability * weights.survivability +
    energy * weights.energy +
    consistency * weights.consistency +
    accessibility * weights.accessibility +
    teamSynergy * weights.teamSynergy +
    weaponEfficiency * weights.weaponEfficiency +
    artifactQuality * weights.artifactQuality +
    rotationEfficiency * weights.rotation +
    futureScaling * weights.futureScaling
  );

  // Generate reasoning
  const reasoning = generateReasoning({
    damage,
    survivability,
    energy,
    consistency,
    accessibility,
    teamSynergy,
    weaponEfficiency,
    artifactQuality,
    rotation: rotationEfficiency,
    futureScaling,
  });

  return {
    overall,
    subscores: {
      damage,
      survivability,
      energy,
      consistency,
      accessibility,
      teamSynergy,
      weaponEfficiency,
      artifactQuality,
      rotation: rotationEfficiency,
      futureScaling,
    },
    weights,
    reasoning,
  };
}

function calculateDamageScore(character: Character, weapon: WeaponSummary, build: BuildSummary): number {
  let score = 50;

  // Character tier
  if (character.tierListPlacement?.overall === "S+") score += 20;
  else if (character.tierListPlacement?.overall === "S") score += 15;
  else if (character.tierListPlacement?.overall === "A+") score += 10;

  // Weapon match
  if (build.weapon?.id === weapon.id) score += 15;
  if (weapon.rarity === "SSR") score += 10;

  // Build tier
  if (build.tier === "S+") score += 15;
  else if (build.tier === "S") score += 10;

  // Role optimization
  if (character.role === "DPS" && build.buildType === "PvE") score += 10;

  return Math.min(100, score);
}

function calculateSurvivabilityScore(character: Character, build: BuildSummary): number {
  let score = 50;

  // Character base stats
  if (character.stats?.baseHP > 15000) score += 15;
  if (character.stats?.baseDEF > 250) score += 10;

  // Build focus
  if (build.tags?.includes("Tank")) score += 20;
  if (build.tags?.includes("Healer")) score += 15;

  return Math.min(100, score);
}

function calculateEnergyScore(character: Character, weapon: WeaponSummary, build: BuildSummary): number {
  let score = 60;

  // Weapon energy generation
  if (weapon.element === "Lightning") score += 10;

  // Build optimization
  if (build.tags?.includes("Energy")) score += 15;

  return Math.min(100, score);
}

function calculateConsistencyScore(build: BuildSummary): number {
  let score = 70;

  // Build rating and votes
  if (build.rating >= 4.5) score += 15;
  if (build.votes > 1000) score += 10;

  // Difficulty
  if (build.difficulty === "easy") score += 10;
  if (build.difficulty === "expert") score -= 10;

  return Math.min(100, score);
}

function calculateAccessibilityScore(build: BuildSummary): number {
  let score = 60;

  // F2P friendly
  if (build.priority === "budget" || build.tags?.includes("F2P")) score += 25;

  // Weapon rarity
  if (build.weapon?.rarity === "R") score += 15;
  else if (build.weapon?.rarity === "SR") score += 10;
  else if (build.weapon?.rarity === "SSR") score -= 10;

  return Math.min(100, Math.max(0, score));
}

function calculateTeamSynergyScore(character: Character, teamMembers: TeamSummary[]): number {
  if (teamMembers.length === 0) return 50;

  let score = 60;

  // Team score
  const avgTeamScore = teamMembers.reduce((sum, t) => sum + t.score.overall, 0) / teamMembers.length;
  if (avgTeamScore > 80) score += 20;
  else if (avgTeamScore > 60) score += 10;

  return Math.min(100, score);
}

function calculateWeaponEfficiencyScore(character: Character, weapon: WeaponSummary): number {
  let score = 60;

  // Element match
  if (weapon.element === character.element) score += 20;

  // Weapon type match
  if (weapon.weaponType === character.weaponType) score += 15;

  // Rarity
  if (weapon.rarity === "SSR") score += 15;
  else if (weapon.rarity === "SR") score += 10;

  // ATK
  if (weapon.stats?.baseATK > 600) score += 10;

  return Math.min(100, score);
}

function calculateFutureScalingScore(character: Character, build: BuildSummary): number {
  let score = 70;

  // Character popularity (indicates long-term relevance)
  if (character.popularity > 80) score += 15;

  // Build popularity
  if (build.popularity > 80) score += 10;

  return Math.min(100, score);
}

function generateReasoning(subscores: BuildScoreV2["subscores"]): string[] {
  const reasoning: string[] = [];

  if (subscores.damage >= 85) {
    reasoning.push("Exceptional damage output with optimized weapon and build synergy.");
  } else if (subscores.damage >= 70) {
    reasoning.push("Good damage output. Consider upgrading weapon for better performance.");
  } else {
    reasoning.push("Damage output is below optimal. Review weapon and artifact choices.");
  }

  if (subscores.teamSynergy >= 80) {
    reasoning.push("Excellent team composition with strong elemental and role coverage.");
  } else if (subscores.teamSynergy >= 60) {
    reasoning.push("Team synergy is decent. Consider adding element coverage.");
  } else {
    reasoning.push("Team synergy needs improvement. Optimize team composition.");
  }

  if (subscores.accessibility >= 80) {
    reasoning.push("Highly accessible build suitable for F2P players.");
  } else if (subscores.accessibility < 50) {
    reasoning.push("Build requires significant investment (whale-friendly).");
  }

  if (subscores.weaponEfficiency >= 85) {
    reasoning.push("Weapon choice is optimal for this character.");
  }

  if (subscores.futureScaling >= 80) {
    reasoning.push("Build has strong long-term viability.");
  }

  return reasoning;
}

function createDefaultScore(): BuildScoreV2 {
  return {
    overall: 50,
    subscores: {
      damage: 50,
      survivability: 50,
      energy: 50,
      consistency: 50,
      accessibility: 50,
      teamSynergy: 50,
      weaponEfficiency: 50,
      artifactQuality: 50,
      rotation: 50,
      futureScaling: 50,
    },
    weights: {
      damage: 0.20,
      survivability: 0.10,
      energy: 0.10,
      consistency: 0.10,
      accessibility: 0.10,
      teamSynergy: 0.15,
      weaponEfficiency: 0.10,
      artifactQuality: 0.05,
      rotation: 0.05,
      futureScaling: 0.05,
    },
    reasoning: ["Default score - insufficient data for accurate calculation."],
  };
}
