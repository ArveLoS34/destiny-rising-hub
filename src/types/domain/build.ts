import { BaseEntity, Rarity, BuildDifficulty } from "./game";

/**
 * Build domain model.
 * Represents a complete character build with weapon, team, rotation, and strategy.
 * This is the core decision-support entity of the platform.
 */

// ─── Build Types ───

export type BuildType =
  | "PvE"
  | "PvP"
  | "Raid"
  | "Boss"
  | "Farming"
  | "Support"
  | "Burst"
  | "F2P"
  | "Whale"
  | "Beginner"
  | "EndGame";

// BuildDifficulty is defined in game.ts

export type BuildPriority = "main" | "alternative" | "budget" | "endgame";

export type StatPriority = "CR" | "CD" | "ATK" | "HP" | "DEF" | "ER" | "EM" | "SPD";

// ─── Rotation Step ───

export interface RotationStep {
  id: string;
  order: number;
  action: string;
  skillName: string;
  skillType: "basic" | "skill" | "ultimate" | "passive" | "swap" | "wait";
  duration: string;
  description: string;
  isKeyStep: boolean;
}

// ─── Teammate Slot ───

export interface TeammateSlot {
  role: "Main DPS" | "Sub DPS" | "Support" | "Healer";
  characterId: string;
  reason: string;
  isRequired: boolean;
}

// ─── Material Requirement ───

export interface BuildMaterialRequirement {
  materialId: string;
  name: string;
  quantity: number;
  purpose: string;
  source: string;
  estimatedTime: string;
}

// ─── Stat Weight ───

export interface StatWeight {
  stat: StatPriority;
  weight: number;
  targetValue?: string;
  description: string;
}

// ─── Build Score ───

export interface BuildScore {
  overall: number;
  damage: number;
  survivability: number;
  consistency: number;
  accessibility: number;
  synergy: number;
  reasons: string[];
}

// ─── Build Summary (for list/card views) ───

export interface BuildSummary {
  id: string;
  slug: string;
  characterId: string;
  characterName: string;
  characterSlug: string;
  characterIcon: string;
  characterColor: string;
  buildType: BuildType;
  priority: BuildPriority;
  title: string;
  description: string;
  difficulty: BuildDifficulty;
  tier: string;
  rating: number;
  votes: number;
  popularity: number;
  recommended: boolean;
  tags: string[];
  weapon: {
    id: string;
    name: string;
    slug: string;
    rarity: Rarity;
    icon: string;
  };
  score: BuildScore;
  verification: {
    verified: boolean;
    gameVersion: string;
  };
}

// ─── Full Build ───

export interface Build extends BaseEntity {
  // Core Identity
  characterId: string;
  characterName: string;
  characterSlug: string;
  buildType: BuildType;
  priority: BuildPriority;
  difficulty: BuildDifficulty;

  // Display
  title: string;
  description: string;
  tags: string[];

  // Weapon
  weapon: {
    id: string;
    name: string;
    slug: string;
    rarity: Rarity;
    icon: string;
  };
  weaponAlternatives: {
    id: string;
    name: string;
    slug: string;
    rarity: Rarity;
    isSignature: boolean;
    note: string;
  }[];

  // Team
  teammates: TeammateSlot[];
  teamAlternatives: TeammateSlot[][];

  // Combat
  rotation: RotationStep[];
  rotationDescription: string;

  // Stats
  statsPriority: StatWeight[];
  subStats: StatWeight[];
  artifactSets: {
    id: string;
    name: string;
    pieces: number;
    effect: string;
  }[];

  // Materials
  materials: BuildMaterialRequirement[];

  // Analysis
  pros: string[];
  cons: string[];
  score: BuildScore;

  // Meta
  tier: string;
  rating: number;
  votes: number;
  popularity: number;
  recommended: boolean;

  // Versioning
  releaseVersion: string;
  lastUpdated: string;
}

// ─── Build Filters ───

export interface BuildFilters {
  characterIds: string[];
  buildTypes: BuildType[];
  difficulties: BuildDifficulty[];
  priorities: BuildPriority[];
  search: string;
  sortBy: BuildSortField;
  sortOrder: "asc" | "desc";
}

export type BuildSortField =
  | "popularity"
  | "rating"
  | "tier"
  | "difficulty"
  | "name"
  | "score";

export const defaultBuildFilters: BuildFilters = {
  characterIds: [],
  buildTypes: [],
  difficulties: [],
  priorities: [],
  search: "",
  sortBy: "popularity",
  sortOrder: "desc",
};

// ─── Build Comparison ───

export interface BuildComparison {
  buildA: BuildSummary;
  buildB: BuildSummary;
  differences: {
    category: string;
    buildAValue: string;
    buildBValue: string;
    winner: "A" | "B" | "tie";
  }[];
  recommendation: string;
}
