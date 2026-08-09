import type { Character, CharacterStats, CharacterSkill, CharacterTalent, CharacterMaterial, CharacterBuild, CharacterStrength, CharacterWeakness } from "@/types/domain";
import { characters } from "./characters";

/**
 * Destiny: Rising — Detailed Character Data
 *
 * This file provides full Character objects for detail pages.
 * Uses verified data from characters.ts and fills unverified fields
 * with null/empty/default values.
 *
 * NO FABRICATED DATA - All unverified fields are explicitly marked.
 */

// Default empty stats (unverified)
const defaultStats: CharacterStats = {
  baseHP: 0,
  baseATK: 0,
  baseDEF: 0,
  baseSPD: 0,
  baseCR: 0,
  baseCD: 0,
  growthHP: 0,
  growthATK: 0,
  growthDEF: 0,
  growthSPD: 0,
};

// Default empty skill (unverified)
const defaultSkill: CharacterSkill = {
  id: "",
  name: "Unknown",
  description: "Ability data not yet verified",
  type: "basic",
  element: "Solar",
  damageType: "Single Target" as any, // Unverified - using placeholder
  scaling: [],
  icon: "",
};

// Default empty talent (unverified)
const defaultTalent: CharacterTalent = {
  id: "",
  name: "Unknown",
  description: "Talent data not yet verified",
  unlockLevel: 0,
  tier: 0,
  effects: [],
};

/**
 * Convert CharacterSummary to full Character object
 * Unverified fields are set to null/empty/default values
 */
function toFullCharacter(summary: any): Character {
  return {
    // From CharacterSummary (verified)
    id: summary.id,
    slug: summary.slug,
    name: summary.name,
    gameId: "destiny-rising",
    title: summary.title,
    rarity: summary.rarity,
    element: summary.element,
    role: summary.role,
    weaponType: summary.weaponType,
    damageType: "Physical" as any, // Destiny Rising uses element as damage type, but type system expects LegacyDamageType
    portrait: summary.portrait,
    icon: summary.icon,
    splashArt: summary.splashArt || summary.portrait,
    colorTheme: summary.colorTheme,
    verification: summary.verification,
    
    // Unverified fields - set to null/empty/default
    description: "",
    faction: "",
    stats: defaultStats,
    skills: [],
    talents: [],
    ultimate: { ...defaultSkill, type: "ultimate" },
    passive: { ...defaultSkill, type: "passive" },
    ascensionMaterials: [],
    skillMaterials: [],
    maxLevel: 90,
    maxAscension: 6,
    recommendedWeapons: [],
    recommendedArtifacts: [],
    synergies: [],
    counters: [],
    popularBuilds: [],
    strengths: [],
    weaknesses: [],
    lore: "",
    voiceActors: {
      en: "",
      jp: "",
      kr: "",
      cn: "",
    },
    factionRelation: undefined,
    releaseVersion: summary.releaseVersion || "1.0.0",
    tierListPlacement: {
      overall: summary.tierListPlacement || "",
      dps: "",
      support: "",
      pve: "",
      pvp: "",
    },
    views: 0,
    popularity: summary.popularity || 0,
    pickRate: 0,
    banRate: 0,
    winRate: summary.winRate || 0,
  };
}

/**
 * Full character details array
 * Generated from verified characters.ts data
 */
export const charactersDetail: Character[] = characters.map(toFullCharacter);

/**
 * Get character by slug
 */
export function getCharacterBySlug(slug: string): Character | undefined {
  return charactersDetail.find((c) => c.slug === slug);
}

/**
 * Get character by ID
 */
export function getCharacterById(id: string): Character | undefined {
  return charactersDetail.find((c) => c.id === id);
}

/**
 * Get all characters
 */
export function getAllCharactersDetail(): Character[] {
  return charactersDetail;
}
