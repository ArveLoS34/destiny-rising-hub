import {
  BaseEntity,
  // Transition types — accept both real and legacy values during migration
  ElementValue as Element,
  RarityValue as Rarity,
  RoleValue as Role,
  WeaponTypeValue as WeaponType,
  DamageTypeValue as DamageType,
  AbilityType,
  WeaknessCategory,
  StrengthCategory,
} from "./game";

/**
 * Character domain model.
 *
 * TRANSITION STATE:
 * Destiny: Rising characters are called "Lightbearers".
 * Each has a fixed element (Solar/Arc/Void), rarity (Mythic/Legendary),
 * role (Offense/Defense/Support), and preferred weapon types.
 *
 * Destiny: Rising does NOT have a faction system.
 * The `faction` field is deprecated and will be removed.
 */

export interface CharacterSkill {
  id: string;
  name: string;
  description: string;
  type: "basic" | "ability-1" | "ability-2" | "ultimate" | "passive" | "relic";
  element: Element;
  damageType: DamageType;
  cooldown?: number;
  energyCost?: number;
  scaling: SkillScaling[];
  icon: string;
}

export interface SkillScaling {
  level: number;
  value: string;
  description: string;
}

export interface CharacterTalent {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  tier: number;
  effects: string[];
}

export interface CharacterStats {
  baseHP: number;
  baseATK: number;
  baseDEF: number;
  baseSPD: number;
  baseCR: number;
  baseCD: number;
  growthHP: number;
  growthATK: number;
  growthDEF: number;
  growthSPD: number;
}

export interface CharacterMaterial {
  materialId: string;
  name: string;
  quantity: number;
  purpose: "ascension" | "skill" | "awakening" | "breakthrough";
}

export interface CharacterBuild {
  id: string;
  name: string;
  description: string;
  weapons: string[];
  artifacts: string[];
  teamComposition: string[];
  playstyle: string;
  difficulty: "easy" | "medium" | "hard";
  author: string;
  rating: number;
  votes: number;
}

export interface CharacterWeakness {
  description: string;
  category: WeaknessCategory;
}

export interface CharacterStrength {
  description: string;
  category: StrengthCategory;
}

export interface CharacterFactionRelation {
  factionId: string;
  role: "leader" | "member" | "ally" | "rival" | "enemy";
  lore: string;
}

export interface Character extends BaseEntity {
  // Core Identity
  title: string;
  description?: string;
  rarity: Rarity;
  element: Element;
  role: Role;
  weaponType: WeaponType;
  /** @deprecated — Destiny: Rising has no faction system. Will be removed. */
  faction?: string;
  damageType: DamageType;

  // Visual
  portrait: string;
  icon: string;
  splashArt: string;
  colorTheme: string;

  // Stats
  stats: CharacterStats;

  // Combat
  skills: CharacterSkill[];
  talents: CharacterTalent[];
  ultimate: CharacterSkill;
  passive: CharacterSkill;

  // Progression
  ascensionMaterials: CharacterMaterial[];
  skillMaterials: CharacterMaterial[];
  maxLevel: number;
  maxAscension: number;

  // Relationships
  recommendedWeapons: string[];
  recommendedArtifacts: string[];
  synergies: string[];
  counters: string[];

  // Builds
  popularBuilds: CharacterBuild[];

  // Analysis
  strengths: CharacterStrength[];
  weaknesses: CharacterWeakness[];

  // Lore
  lore: string;
  voiceActors: {
    en: string;
    jp: string;
    kr: string;
    cn: string;
  };

  // Faction (deprecated)
  factionRelation?: CharacterFactionRelation;

  // Meta
  releaseVersion: string;
  tierListPlacement: {
    overall: string;
    dps: string;
    support: string;
    pve: string;
    pvp: string;
  };

  // User Engagement
  views?: number;
  popularity: number;
  pickRate: number;
  banRate?: number;
  winRate: number;
}

// ─── Character Summary (for list views) ───

export interface CharacterSummary {
  id: string;
  slug: string;
  name: string;
  title: string;
  rarity: Rarity;
  element: Element;
  role: Role;
  weaponType?: WeaponType;
  /** @deprecated — Destiny: Rising has no faction system. Will be removed. */
  faction?: string;
  icon: string;
  portrait: string;
  colorTheme: string;
  releaseVersion: string;
  tierListPlacement: string;
  popularity: number;
  winRate: number;
  verification: {
    verified: boolean;
    gameVersion: string;
  };
}

// ─── Character Filters ───

export interface CharacterFilters {
  elements: Element[];
  roles: Role[];
  rarities: Rarity[];
  weaponTypes: WeaponType[];
  factions: string[];
  damageTypes: DamageType[];
  search: string;
  sortBy: CharacterSortField;
  sortOrder: "asc" | "desc";
}

export type CharacterSortField =
  | "name"
  | "rarity"
  | "element"
  | "role"
  | "popularity"
  | "winRate"
  | "releaseDate"
  | "tierList";

export const defaultCharacterFilters: CharacterFilters = {
  elements: [],
  roles: [],
  rarities: [],
  weaponTypes: [],
  factions: [],
  damageTypes: [],
  search: "",
  sortBy: "popularity",
  sortOrder: "desc",
};
