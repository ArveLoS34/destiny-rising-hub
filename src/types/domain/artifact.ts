import { BaseEntity } from "./game";

/**
 * Artifact domain model.
 * Represents equippable artifacts that provide stats and set bonuses.
 */

// ─── Artifact Types ───

export type ArtifactSlot = "flower" | "plume" | "sands" | "goblet" | "crown";

export type ArtifactRarity = "1star" | "2star" | "3star" | "4star" | "5star";

export type ArtifactMainStat =
  | "HP"
  | "HP%"
  | "ATK"
  | "ATK%"
  | "DEF"
  | "DEF%"
  | "Elemental Mastery"
  | "Energy Recharge%"
  | "Crit Rate%"
  | "Crit Damage%"
  | "Fire Damage Bonus%"
  | "Ice Damage Bonus%"
  | "Lightning Damage Bonus%"
  | "Wind Damage Bonus%"
  | "Earth Damage Bonus%"
  | "Dark Damage Bonus%"
  | "Light Damage Bonus%"
  | "Healing Bonus%"
  | "Physical Damage Bonus%";

export type ArtifactSubStat =
  | "HP"
  | "HP%"
  | "ATK"
  | "ATK%"
  | "DEF"
  | "DEF%"
  | "Elemental Mastery"
  | "Energy Recharge%"
  | "Crit Rate%"
  | "Crit Damage%";

// ─── Artifact Set ───

export interface ArtifactSet {
  id: string;
  slug: string;
  name: string;
  description: string;
  bonuses: {
    "2pc": string;
    "4pc": string;
  };
  icon: string;
  verification: {
    source: string;
    gameVersion: string;
    verified: boolean;
    verifiedAt: string;
    lastUpdated: string;
  };
}

// ─── Artifact ───

export interface Artifact {
  id: string;
  slug: string;
  name: string;
  icon: string;
  rarity: ArtifactRarity;
  slot: ArtifactSlot;
  setId: string;
  setName: string;
  setSlug: string;

  // Stats
  mainStat: ArtifactMainStat;
  mainStatValue: number;
  subStats: ArtifactSubStatInstance[];

  // Leveling
  level: number;
  maxLevel: number;
  expRequired: number;

  // Acquisition
  dropSource: string;
  domain: string;
  bossName?: string;

  // Relationships
  recommendedFor: string[]; // Character IDs
  usedInBuilds: string[]; // Build IDs

  // Meta
  verification: {
    source: string;
    gameVersion: string;
    verified: boolean;
    verifiedAt: string;
    lastUpdated: string;
  };
}

export interface ArtifactSubStatInstance {
  stat: ArtifactSubStat;
  value: number;
  rolls: number; // Number of times this sub-stat was upgraded
}

// ─── Artifact Summary (for list views) ───

export interface ArtifactSummary {
  id: string;
  slug: string;
  name: string;
  icon: string;
  rarity: ArtifactRarity;
  slot: ArtifactSlot;
  setId: string;
  setName: string;
  mainStat: ArtifactMainStat;
  verification: {
    verified: boolean;
    gameVersion: string;
  };
}

// ─── Artifact Filters ───

export interface ArtifactFilters {
  sets: string[];
  slots: ArtifactSlot[];
  rarities: ArtifactRarity[];
  mainStats: ArtifactMainStat[];
  search: string;
}

export const defaultArtifactFilters: ArtifactFilters = {
  sets: [],
  slots: [],
  rarities: [],
  mainStats: [],
  search: "",
};
