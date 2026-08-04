import { BaseEntity, Rarity, Element, Role, WeaponType, Faction, DamageType, WeaknessCategory, StrengthCategory } from "./game";

/**
 * Character domain model.
 * Represents a playable character/hero in the game.
 */

export interface CharacterSkill {
  id: string;
  name: string;
  description: string;
  type: "basic" | "skill" | "ultimate" | "passive" | "leader";
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
  baseCR: number;    // Crit Rate
  baseCD: number;    // Crit Damage
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
  rarity: Rarity;
  element: Element;
  role: Role;
  weaponType: WeaponType;
  faction: Faction;
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

  // Faction
  factionRelation: CharacterFactionRelation;

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
  weaponType: WeaponType;
  faction: Faction;
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
  factions: Faction[];
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
