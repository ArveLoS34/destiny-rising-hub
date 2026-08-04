import {
  BaseEntity,
  Rarity,
  Element,
  WeaponType,
  DamageType,
  MaterialPurpose,
  BuildDifficulty,
} from "./game";

/**
 * Weapon domain model.
 * Represents a weapon/equipment in the game.
 * Fully relational with characters, builds, materials, and teams.
 */

export interface WeaponStats {
  baseATK: number;
  baseDEF: number;
  baseHP: number;
  baseCR: number;     // Crit Rate
  baseCD: number;     // Crit Damage
  baseER: number;     // Energy Recharge
  baseEM: number;     // Elemental Mastery
  growthATK: number;
  growthDEF: number;
  growthHP: number;
}

export interface WeaponStatScaling {
  level: number;
  atk: number;
  subStat: number;
}

export interface WeaponPerk {
  id: string;
  name: string;
  description: string;
  type: "passive" | "active" | "conditional";
  scaling: WeaponPerkScaling[];
}

export interface WeaponPerkScaling {
  refinement: number;
  value: string;
  description: string;
}

export interface WeaponTrait {
  id: string;
  name: string;
  description: string;
  category: "elemental" | "combat" | "utility" | "defensive";
  appliesTo: string[]; // Character IDs or roles
}

export interface WeaponMaterial {
  materialId: string;
  name: string;
  quantity: number;
  purpose: MaterialPurpose;
  level?: number;
}

export interface WeaponUpgradeNode {
  id: string;
  level: number;
  statBonus: Partial<WeaponStats>;
  materials: WeaponMaterial[];
  goldCost: number;
  unlockRequirement?: string;
}

export interface WeaponVersion {
  version: string;
  date: string;
  changes: string[];
}

export interface WeaponObtainMethod {
  method: string;
  location: string;
  dropRate?: string;
  guaranteed?: boolean;
  notes?: string;
}

export interface WeaponBuild {
  id: string;
  name: string;
  description: string;
  characterIds: string[];
  artifacts: string[];
  playstyle: string;
  difficulty: BuildDifficulty;
  rating: number;
  votes: number;
}

export interface Weapon extends BaseEntity {
  // Core Identity
  weaponType: WeaponType;
  manufacturer: string;
  element: Element;
  damageType: DamageType;

  // Visual
  icon: string;
  splashArt: string;
  gallery: string[];
  colorTheme: string;

  // Content
  description: string;
  lore: string;

  // Acquisition
  obtainMethods: WeaponObtainMethod[];
  availability: "permanent" | "limited" | "event" | "craftable" | "shop";
  releaseDate: string;

  // Stats
  rarity: Rarity;
  stats: WeaponStats;
  statScaling: WeaponStatScaling[];
  subStatType: string;

  // Combat
  perks: WeaponPerk[];
  traits: WeaponTrait[];

  // Progression
  upgradeTree: WeaponUpgradeNode[];
  upgradeMaterials: WeaponMaterial[];
  ascensionMaterials: WeaponMaterial[];
  maxLevel: number;
  maxRefinement: number;

  // Meta
  tier: string;
  popularity: number;
  pickRate: number;
  winRate: number;

  // Relationships
  recommendedCharacterIds: string[];
  popularBuilds: WeaponBuild[];
  similarWeaponIds: string[];

  // History
  versionHistory: WeaponVersion[];
}

// ─── Weapon Summary (for list views) ───

export interface WeaponSummary {
  id: string;
  slug: string;
  name: string;
  rarity: Rarity;
  weaponType: WeaponType;
  manufacturer: string;
  element: Element;
  damageType: DamageType;
  icon: string;
  splashArt: string;
  colorTheme: string;
  releaseVersion: string;
  tier: string;
  popularity: number;
  winRate: number;
  stats: {
    baseATK: number;
  };
  verification: {
    verified: boolean;
    gameVersion: string;
  };
}

// ─── Weapon Filters ───

export interface WeaponFilters {
  weaponTypes: WeaponType[];
  rarities: Rarity[];
  elements: Element[];
  damageTypes: DamageType[];
  manufacturers: string[];
  availability: string[];
  search: string;
  sortBy: WeaponSortField;
  sortOrder: "asc" | "desc";
}

export type WeaponSortField =
  | "name"
  | "rarity"
  | "weaponType"
  | "element"
  | "baseATK"
  | "popularity"
  | "winRate"
  | "releaseDate"
  | "tier";

export const defaultWeaponFilters: WeaponFilters = {
  weaponTypes: [],
  rarities: [],
  elements: [],
  damageTypes: [],
  manufacturers: [],
  availability: [],
  search: "",
  sortBy: "popularity",
  sortOrder: "desc",
};

// ─── Weapon List View Mode ───

export type WeaponViewMode = "grid" | "list";
