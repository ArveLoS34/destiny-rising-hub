import { BaseEntity, Element } from "./game";

/**
 * Team domain model.
 * Represents a complete team composition with synergy analysis.
 * Core entity for the decision-support system.
 */

// ─── Team Types ───

export type TeamTemplate =
  | "Boss"
  | "Raid"
  | "PvE"
  | "PvP"
  | "Beginner"
  | "F2P"
  | "Whale"
  | "EndGame";

export type TeamSlot = "mainCarry" | "subCarry" | "support" | "healer" | "flex";

// ─── Team Member ───

export interface TeamMember {
  characterId: string;
  characterName: string;
  characterSlug: string;
  characterIcon: string;
  characterColor: string;
  element: Element;
  role: string;
  rarity: string;
  slot: TeamSlot;
  weaponId: string;
  weaponName: string;
  buildId?: string;
  buildSlug?: string;
}

// ─── Synergy Pair ───

export interface SynergyPair {
  characterAId: string;
  characterBId: string;
  score: number;
  reasons: string[];
  elementCombo?: string;
}

// ─── Team Score ───

export interface TeamScore {
  overall: number;
  damage: number;
  support: number;
  control: number;
  survivability: number;
  energy: number;
  consistency: number;
  accessibility: number;
  reasons: string[];
}

// ─── Team Strength/Weakness ───

export interface TeamStrength {
  description: string;
  category: "damage" | "utility" | "survivability" | "synergy" | "control";
}

export interface TeamWeakness {
  description: string;
  category: "matchup" | "element" | "role" | "resource";
}

// ─── Team Counter ───

export interface TeamCounter {
  teamOrCharacter: string;
  type: "strongAgainst" | "weakAgainst";
  reason: string;
}

// ─── Team Summary ───

export interface TeamSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  template: TeamTemplate;
  tier: string;
  rating: number;
  votes: number;
  popularity: number;
  members: TeamMember[];
  elementCoverage: Element[];
  score: TeamScore;
  tags: string[];
  verification: {
    verified: boolean;
    gameVersion: string;
  };
}

// ─── Full Team ───

export interface Team extends BaseEntity {
  title: string;
  description: string;
  template: TeamTemplate;

  // Members
  mainCarry: TeamMember;
  subCarry: TeamMember;
  support: TeamMember;
  healer: TeamMember;
  flex?: TeamMember;

  // Coverage
  elementCoverage: Element[];
  roleCoverage: string[];

  // Synergy
  synergyPairs: SynergyPair[];
  overallSynergy: number;

  // Analysis
  strengths: TeamStrength[];
  weaknesses: TeamWeakness[];
  counters: TeamCounter[];

  // Builds
  memberBuilds: {
    characterId: string;
    buildId: string;
    buildName: string;
    buildSlug: string;
  }[];

  // Score
  score: TeamScore;

  // Meta
  tier: string;
  rating: number;
  votes: number;
  popularity: number;
  tags: string[];

  // Versioning
  releaseVersion: string;
  lastUpdated: string;
}

// ─── Team Filters ───

export interface TeamFilters {
  templates: TeamTemplate[];
  elements: Element[];
  search: string;
  sortBy: TeamSortField;
  sortOrder: "asc" | "desc";
}

export type TeamSortField = "popularity" | "rating" | "tier" | "score" | "name";

export const defaultTeamFilters: TeamFilters = {
  templates: [],
  elements: [],
  search: "",
  sortBy: "popularity",
  sortOrder: "desc",
};

// ─── Team Comparison ───

export interface TeamComparison {
  teamA: TeamSummary;
  teamB: TeamSummary;
  differences: {
    category: string;
    teamAValue: string;
    teamBValue: string;
    winner: "A" | "B" | "tie";
  }[];
  recommendation: string;
}
