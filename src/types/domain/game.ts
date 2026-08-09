/**
 * Destiny: Rising — Domain Types
 *
 * Aligned with real Destiny: Rising mobile game systems.
 * Source: playdestinyrising.com, official patch notes, Destinypedia
 *
 * TRANSITION STATE (Phase 1):
 *   New real types are defined alongside legacy types.
 *   Legacy values are marked @deprecated and will be removed in Phase 2
 *   when static data files are replaced with real Destiny: Rising data.
 *
 * Key systems:
 *   - Elements: Solar, Arc, Void (+ Kinetic for weapon damage type)
 *   - Rarity: Mythic (5★), Legendary (4★), Rare (3★) — Exotic for weapons only
 *   - Roles: Offense, Defense, Support
 *   - Weapon Types: 6 Primary (infinite ammo) + 10 Power (limited ammo)
 */

// ═══════════════════════════════════════════════════════════════
// REAL DESTINY: RISING TYPES
// ═══════════════════════════════════════════════════════════════

// ─── Element ───
// Destiny: Rising uses three core elements from the Destiny franchise.
// Kinetic is used only for non-elemental weapon damage classification.

export type Element = "Solar" | "Arc" | "Void";
export type WeaponDamageType = "Kinetic" | Element;

// ─── Rarity ───
// Lightbearers (characters) come in Mythic and Legendary.
// Weapons additionally have Rare and Exotic tiers.

export type LightbearerRarity = "Mythic" | "Legendary";
export type WeaponRarity = "Exotic" | "Mythic" | "Legendary" | "Rare";
export type Rarity = LightbearerRarity | WeaponRarity;

// ─── Role ───
// Destiny: Rising uses three combat roles for Lightbearers.

export type Role = "Offense" | "Defense" | "Support";

// ─── Weapon Type ───
// Primary weapons have infinite ammo.
// Power weapons have limited ammo but deal heavy damage.

export type PrimaryWeaponType =
  | "Auto Rifle"
  | "Pulse Rifle"
  | "Scout Rifle"
  | "Fusion Rifle"
  | "Submachine Gun"
  | "Sidearm"
  | "Hand Cannon"
  | "Light Grenade Launcher"
  | "Bow";

export type PowerWeaponType =
  | "Sword"
  | "Shotgun"
  | "Sniper Rifle"
  | "Grenade Launcher"
  | "Rocket Launcher"
  | "Machine Gun"
  | "Linear Fusion Rifle"
  | "Auto Crossbow";

export type WeaponType = PrimaryWeaponType | PowerWeaponType;

export type WeaponCategory = "Primary" | "Power";

// ─── Combat Style ───
// Weapon combat styles determine effectiveness against Shinka (Champions).

export type CombatStyle = "Rapid-Fire" | "Spread" | "Piercing" | "Impact";

// ─── Artifact System ───
// Destiny: Rising artifacts have 4 slots per character.
// NO set bonuses — each artifact has individual attributes and effects.
// Sourced from: playdestinyrising.com, Reddit artifact guides
// NOTE: artifact.ts defines its own ArtifactSlot type (legacy Genshin-style).
// DRArtifactSlot will be used in Phase 2 when artifact system is rebuilt.

export type DRArtifactSlot = "artifact-1" | "artifact-2" | "artifact-3" | "artifact-4";

// ─── Ability Types ───

export type AbilityType =
  | "basic"
  | "ability-1"
  | "ability-2"
  | "ultimate"
  | "passive"
  | "relic";

// ─── Material Categories ───
// NOTE: material.ts defines its own MaterialCategory type.
// DRMaterialCategory will be used in Phase 2 when material system is rebuilt.

export type DRMaterialCategory =
  | "enhancement"
  | "infusion"
  | "lumenite"
  | "mod"
  | "artifact"
  | "currency"
  | "consumable"
  | "quest";

// ─── Activity / Game Mode Types ───
// NOTE: user.ts defines its own ActivityType for user actions.
// DRGameActivityType is for Destiny: Rising in-game activity modes.

export type DRGameActivityType =
  | "campaign"
  | "strike"
  | "gauntlet"
  | "blitz"
  | "shifting-gates"
  | "calamity-ops"
  | "realm-of-ix"
  | "front-lines"
  | "public-event"
  | "morgan's-prey"
  | "grandmaster";

// ═══════════════════════════════════════════════════════════════
// LEGACY TYPES — @deprecated, will be removed in Phase 2
// ═══════════════════════════════════════════════════════════════
// These exist ONLY to maintain compilation during the transition.
// Static data files still use these values. They will be replaced
// with real Destiny: Rising data in Phase 2, at which point these
// legacy types will be removed.

/** @deprecated — Use Element ("Solar" | "Arc" | "Void") */
export type LegacyElement =
  | "Fire" | "Water" | "Wind" | "Earth"
  | "Lightning" | "Ice" | "Light" | "Dark" | "Physical";

/** @deprecated — Use LightbearerRarity or WeaponRarity */
export type LegacyRarity = "SSR" | "SR" | "R" | "N";

/** @deprecated — Use Role ("Offense" | "Defense" | "Support") */
export type LegacyRole = "DPS" | "Sub-DPS" | "Support" | "Tank" | "Healer" | "Utility";

/** @deprecated — Use WeaponType (real Destiny weapon types) */
export type LegacyWeaponType =
  | "Greatsword" | "Spear" | "Gun" | "Staff"
  | "Dagger" | "Cannon" | "Fist" | "Orb" | "Bow";

/** @deprecated — Destiny: Rising has no faction system like this */
export type LegacyFaction =
  | "Genesis" | "Eclipse" | "Nova" | "Stellar" | "Void" | "Independent";

/** @deprecated — Destiny: Rising foundry system is different from manufacturer.
 *  Foundry mapping (weapon → foundry) is 0/139 verified in v7.3 baseline.
 *  Known foundries: Black Armory, Heron, Jiangshi Steelworks, Riviks & Wright, Eclipse Monolith.
 *  This type is kept only as an empty transition placeholder. */
export type LegacyManufacturer = string;

/** @deprecated — Generic RPG damage types */
export type LegacyDamageType =
  | "Single Target" | "AoE" | "Burst" | "Sustained" | "Hybrid";

// ═══════════════════════════════════════════════════════════════
// TRANSITION TYPES — Union of real + legacy (temporary)
// ═══════════════════════════════════════════════════════════════
// During Phase 1-2 transition, these unions accept both real and
// legacy values. Once data files are migrated to real data, the
// legacy values will be removed from these unions.

/** @transition — Will become Element after Phase 2 */
export type ElementValue = Element | LegacyElement;

/** @transition — Will become Rarity after Phase 2 */
export type RarityValue = Rarity | LegacyRarity;

/** @transition — Will become Role after Phase 2 */
export type RoleValue = Role | LegacyRole;

/** @transition — Will become WeaponType after Phase 2 */
export type WeaponTypeValue = WeaponType | LegacyWeaponType;

/** @transition — Will be removed after Phase 2 */
export type FactionValue = LegacyFaction;

/** @transition — Will be removed after Phase 2 */
export type DamageTypeValue = LegacyDamageType;

// ═══════════════════════════════════════════════════════════════
// COMMON INTERFACES
// ═══════════════════════════════════════════════════════════════

export interface DataVerification {
  source: string;
  sourceUrl?: string;
  gameVersion: string;
  verified: boolean;
  verifiedAt: string;
  lastUpdated: string;
  contributor?: string;
}

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

export interface BaseEntity {
  id: string;
  slug: string;
  name: string;
  gameId: string;
  verification: DataVerification;
  createdAt?: Date;
  updatedAt?: Date;
}

// ═══════════════════════════════════════════════════════════════
// BACKWARD-COMPATIBLE ALIASES (for existing code during transition)
// ═══════════════════════════════════════════════════════════════
// These aliases ensure existing code continues to compile.
// They will be removed in Phase 2.

/** @deprecated Use ElementValue — will be removed in Phase 2 */
export type Element_ = ElementValue;

/** @deprecated — Will be removed after Phase 2 */
export type Faction = FactionValue;

/** @deprecated — Will be removed after Phase 2 */
export type DamageType = DamageTypeValue;

/** @deprecated — Will be removed after Phase 2 */
export type MaterialPurpose = "ascension" | "skill" | "awakening" | "breakthrough";

/** @deprecated — Will be removed after Phase 2 */
export type BuildDifficulty = "easy" | "medium" | "hard" | "expert";

/** @deprecated — Will be removed after Phase 2 */
export type StrengthCategory = "damage" | "utility" | "survivability" | "synergy" | "ease";

/** @deprecated — Will be removed after Phase 2 */
export type WeaknessCategory = "matchup" | "mechanic" | "resource" | "playstyle" | "damage" | "survivability";

/** @deprecated — Will be removed after Phase 2 */
export type FactionRole = "leader" | "member" | "ally" | "rival" | "enemy";

/** @deprecated — Will be removed after Phase 2 */
export type SkillType = "basic" | "skill" | "ultimate" | "passive" | "leader";
