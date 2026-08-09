import { BaseEntity } from "./game";

/**
 * Artifact domain model.
 *
 * TRANSITION STATE:
 * Destiny: Rising artifacts have 4 slots per character with individual
 * attributes. NO set bonuses. Artifacts are sourced from Realm of the IX.
 *
 * The current types below are LEGACY (Genshin-style) and marked @deprecated.
 * They will be replaced with real Destiny: Rising artifact types in Phase 2
 * when the artifact data is rebuilt from verified game sources.
 */

// ═══════════════════════════════════════════════════════════════
// REAL DESTINY: RISING ARTIFACT SYSTEM (for Phase 2)
// ═══════════════════════════════════════════════════════════════

// DRArtifactSlot is defined in game.ts — imported when needed for Phase 2 migration

/**
 * Destiny: Rising artifact attributes — these are the real attribute types
 * found in-game. Sourced from Reddit artifact guides and playdestinyrising.com
 */
export type DRArtifactAttribute =
  // Defensive
  | "Health Boost"
  | "Shield Boost"
  | "Health Regen"
  | "Damage Resistance"
  | "Elemental Resistance"
  | "Overshield Bonus"
  | "Barrier Bonus"
  // Offensive
  | "Weapon Enhancement"
  | "Weapon Damage"
  | "Ability Strength"
  | "Signature Boost"
  | "Damage Bonus"
  | "Solar Boost"
  | "Arc Boost"
  | "Void Boost"
  | "Primary Weapon Damage"
  | "Power Weapon Damage"
  // Utility
  | "Ability Cooldown"
  | "Relic Ability"
  | "Ammo Reserve"
  | "Class Ability";

// ═══════════════════════════════════════════════════════════════
// LEGACY TYPES — @deprecated (Genshin-style, will be removed)
// ═══════════════════════════════════════════════════════════════

/** @deprecated — Destiny: Rising does not use flower/plume/sands/goblet/crown slots */
export type ArtifactSlot = "flower" | "plume" | "sands" | "goblet" | "crown";

/** @deprecated — Destiny: Rising uses Mythic/Legendary/Rare rarity, not star ratings */
export type ArtifactRarity = "1star" | "2star" | "3star" | "4star" | "5star";

/** @deprecated — Legacy stat names. Real DR attributes are different. */
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

/** @deprecated — Legacy sub-stat names */
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

// ═══════════════════════════════════════════════════════════════
// INTERFACES (legacy — will be redesigned in Phase 2)
// ═══════════════════════════════════════════════════════════════

/**
 * @deprecated — Destiny: Rising has NO artifact set bonuses.
 * Each artifact has individual attributes instead.
 */
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

/** @deprecated — Will be redesigned for real DR artifact system in Phase 2 */
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
  recommendedFor: string[];
  usedInBuilds: string[];

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
  rolls: number;
}

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
