/**
 * Game-agnostic domain types.
 * These types form the foundation for supporting multiple games
 * on the same platform infrastructure.
 */

// ─── Common Type Aliases (String Literal Types for JSON compatibility) ───

export type Rarity = "SSR" | "SR" | "R" | "N";

export type Element =
  | "Fire"
  | "Water"
  | "Wind"
  | "Earth"
  | "Lightning"
  | "Ice"
  | "Light"
  | "Dark"
  | "Physical";

export type Role = "DPS" | "Sub-DPS" | "Support" | "Tank" | "Healer" | "Utility";

export type WeaponType =
  | "Sword"
  | "Greatsword"
  | "Spear"
  | "Bow"
  | "Gun"
  | "Staff"
  | "Dagger"
  | "Cannon"
  | "Fist"
  | "Orb";

export type Faction =
  | "Genesis"
  | "Eclipse"
  | "Nova"
  | "Stellar"
  | "Void"
  | "Independent";

export type DamageType =
  | "Single Target"
  | "AoE"
  | "Burst"
  | "Sustained"
  | "Hybrid";

export type SkillType = "basic" | "skill" | "ultimate" | "passive" | "leader";

export type MaterialPurpose = "ascension" | "skill" | "awakening" | "breakthrough";

export type BuildDifficulty = "easy" | "medium" | "hard";

export type StrengthCategory = "damage" | "utility" | "survivability" | "synergy" | "ease";

export type WeaknessCategory = "matchup" | "mechanic" | "resource" | "playstyle" | "damage" | "survivability";

export type FactionRole = "leader" | "member" | "ally" | "rival" | "enemy";

// ─── Game Entity ───

export interface Game {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  developer: string;
  publisher: string;
  genre: string;
  platform: string[];
  releaseDate: string;
  currentVersion: string;
  status: "active" | "upcoming" | "ended";
  coverImage: string;
  accentColor: string;
  modules: GameModule[];
}

export interface GameModule {
  id: string;
  name: string;
  slug: string;
  description: string;
  enabled: boolean;
  order: number;
}

// ─── Data Verification ───

export interface DataVerification {
  source: string;
  gameVersion: string;
  verified: boolean;
  verifiedAt: string;
  lastUpdated: string;
  contributor?: string;
}

// ─── Base Entity ───

export interface BaseEntity {
  id: string;
  slug: string;
  name: string;
  gameId: string;
  verification: DataVerification;
}
