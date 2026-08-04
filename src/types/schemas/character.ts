import { z } from "zod";

/**
 * Zod schemas for character data validation.
 * Ensures all character data conforms to the expected structure.
 */

export const DataVerificationSchema = z.object({
  source: z.string().min(1),
  gameVersion: z.string().min(1),
  verified: z.boolean(),
  verifiedAt: z.string().datetime(),
  lastUpdated: z.string().datetime(),
  contributor: z.string().optional(),
});

export const SkillScalingSchema = z.object({
  level: z.number().int().positive(),
  value: z.string(),
  description: z.string(),
});

export const CharacterSkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  type: z.enum(["basic", "skill", "ultimate", "passive", "leader"]),
  element: z.enum([
    "Fire", "Water", "Wind", "Earth",
    "Lightning", "Ice", "Light", "Dark", "Physical",
  ]),
  damageType: z.enum(["Single Target", "AoE", "Burst", "Sustained", "Hybrid"]),
  cooldown: z.number().optional(),
  energyCost: z.number().optional(),
  scaling: z.array(SkillScalingSchema),
  icon: z.string(),
});

export const CharacterTalentSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  unlockLevel: z.number().int().positive(),
  tier: z.number().int().positive(),
  effects: z.array(z.string()),
});

export const CharacterStatsSchema = z.object({
  baseHP: z.number().positive(),
  baseATK: z.number().positive(),
  baseDEF: z.number().positive(),
  baseSPD: z.number().positive(),
  baseCR: z.number().min(0).max(1),
  baseCD: z.number().positive(),
  growthHP: z.number().positive(),
  growthATK: z.number().positive(),
  growthDEF: z.number().positive(),
  growthSPD: z.number().positive(),
});

export const CharacterMaterialSchema = z.object({
  materialId: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  purpose: z.enum(["ascension", "skill", "awakening", "breakthrough"]),
});

export const CharacterStrengthSchema = z.object({
  description: z.string(),
  category: z.enum(["damage", "utility", "survivability", "synergy", "ease"]),
});

export const CharacterWeaknessSchema = z.object({
  description: z.string(),
  category: z.enum(["matchup", "mechanic", "resource", "playstyle"]),
});

export const CharacterBuildSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  weapons: z.array(z.string()),
  artifacts: z.array(z.string()),
  teamComposition: z.array(z.string()),
  playstyle: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  author: z.string(),
  rating: z.number().min(0).max(5),
  votes: z.number().int().nonnegative(),
});

export const CharacterSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  title: z.string(),
  rarity: z.enum(["SSR", "SR", "R", "N"]),
  element: z.enum([
    "Fire", "Water", "Wind", "Earth",
    "Lightning", "Ice", "Light", "Dark", "Physical",
  ]),
  role: z.enum(["DPS", "Sub-DPS", "Support", "Tank", "Healer", "Utility"]),
  weaponType: z.enum([
    "Sword", "Greatsword", "Spear", "Bow", "Gun",
    "Staff", "Dagger", "Cannon", "Fist", "Orb",
  ]),
  faction: z.enum(["Genesis", "Eclipse", "Nova", "Stellar", "Void", "Independent"]),
  icon: z.string(),
  portrait: z.string(),
  colorTheme: z.string(),
  releaseVersion: z.string(),
  tierListPlacement: z.string(),
  popularity: z.number().min(0).max(100),
  winRate: z.number().min(0).max(100),
  verification: z.object({
    verified: z.boolean(),
    gameVersion: z.string(),
  }),
});

export const CharacterListSchema = z.array(CharacterSummarySchema);
