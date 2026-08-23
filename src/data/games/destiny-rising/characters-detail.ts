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
 * Verified deep-detail overrides, keyed by character slug.
 * Only characters with real, source-verified data go here.
 * Sources: destinypedia.com, game8.co, sportskeeda.com (cross-checked 2026-08-23).
 * Everything not listed here still falls back to the "unverified" defaults above.
 */
const characterOverrides: Record<string, Partial<Character>> = {
  wolf: {
    description:
      "Wolf is the player's starting Lightbearer and the protagonist of Destiny: Rising's campaign. A Solar close-range fighter, Wolf pairs an Auto Rifle with a Grenade Launcher and leans on a stacking passive resource, Lupine Nature, to power up his strikes and keep himself alive with self-generated overshields.",
    faction: "",
    stats: {
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
    },
    skills: [
      {
        id: "wolf-signature-1",
        name: "Wolf's Strike",
        description:
          "A short-range melee strike dealt to combatants directly ahead of Wolf. Landing a final blow with this ability immediately recharges it, letting Wolf chain kills without waiting on cooldown.",
        type: "ability-1",
        element: "Solar",
        damageType: "Single Target" as any,
        scaling: [],
        icon: "",
      },
      {
        id: "wolf-signature-2",
        name: "Wolf's Flames",
        description:
          "Wolf fires a projectile up to 50m that explodes on impact, dealing area Solar damage and applying Wolf's Ignition (a damage-over-time burn) plus Corrupt, which reduces the target's healing and increases damage they take. Using this ability also grants Wolf a short burst of movement speed (Wolf's Dash). Once Lupine Nature is full, the cooldown resets and the ability is enhanced — firing twice with a larger blast radius and granting Wolf a temporary overshield.",
        type: "ability-2",
        element: "Solar",
        damageType: "AoE" as any,
        scaling: [],
        icon: "",
      },
    ],
    talents: [],
    ultimate: {
      id: "wolf-ultimate",
      name: "Wolf's Butchery",
      description:
        "Wolf's Super. He wields his Solar blade two-handed for a three-hit AoE combo against nearby combatants. Repeatedly hitting the same target within a short window increases the damage of each successive strike, stacking up to a large total bonus. Using this Super instantly maxes out Lupine Nature and shares a movement-speed buff (Wolf's Dash) with nearby allies; Wolf also gains bonus movement speed and damage resistance for the Super's duration.",
      type: "ultimate",
      element: "Solar",
      damageType: "AoE" as any,
      scaling: [],
      icon: "",
    },
    passive: {
      id: "wolf-passive",
      name: "Lupine Nature",
      description:
        "Wolf passively builds a resource called Lupine Nature (LN) — 3 per second in combat, 4 per second out of combat — and gains bonus LN for finishing off enemies (more for elites and other Lightbearers). At 120 LN, Wolf's Strike is enhanced with greatly increased range and damage, grants Wolf a temporary overshield, and resets the LN counter.",
      type: "passive",
      element: "Solar",
      damageType: "Single Target" as any,
      scaling: [],
      icon: "",
    },
    recommendedWeapons: ["Satiyaaliksni Smart Bomb"],
    recommendedArtifacts: ["Ring of Abundance", "Nimble Veil", "Healing Radiation"],
    synergies: ["finnala", "ikora"],
    strengths: [
      { description: "Strong, self-sufficient sustained damage with a stacking combo multiplier", category: "damage" as any },
      { description: "Generates its own overshields through Lupine Nature, giving good solo survivability", category: "survivability" as any },
    ],
    weaknesses: [
      { description: "Kit is melee/close-range focused, which is harder to land consistently against skilled PvP opponents", category: "playstyle" as any },
    ],
    tierListPlacement: {
      overall: "S",
      dps: "S",
      support: "",
      pve: "S",
      pvp: "A",
    },
  },
  "tan-2": {
    description:
      "Tan-2 is the game's only five-star Solar Support, a long-range Lightbearer who wields a Scout Rifle and a Sniper Rifle. He splits his kit between two stances — Duskstar for damage and Dawnstar for healing — and swaps freely between them to cover whatever his team needs.",
    faction: "",
    stats: {
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
    },
    skills: [
      {
        id: "tan2-sunset",
        name: "Sunset",
        description:
          "Duskstar-mode ability. Tan-2 launches a fireball that damages enemies on impact and applies Sunset Scorch, a Solar damage-over-time burn, along with Corrupt, which weakens the target and increases the damage they take.",
        type: "ability-1",
        element: "Solar",
        damageType: "AoE" as any,
        scaling: [],
        icon: "",
      },
      {
        id: "tan2-sunrise",
        name: "Sunrise",
        description:
          "Dawnstar-mode ability. Tan-2 launches a healing orb that quickly restores health to nearby teammates. Tan-2 can swap between Sunset and Sunrise (Twilight Shift) on a short cooldown to move between damage and support as the fight demands.",
        type: "ability-2",
        element: "Solar",
        damageType: "Support" as any,
        scaling: [],
        icon: "",
      },
    ],
    talents: [],
    ultimate: {
      id: "tan2-ultimate",
      name: "Blessing of Dusk / Blessing of Dawn",
      description:
        "Tan-2's Super, its effect depending on his current stance. He leaps into the air and plunges his relic, Parhelion Wing, into the ground to create a blessed zone. In Duskstar (Blessing of Dusk), the zone grants allies a large outgoing damage bonus — a core reason Tan-2 is considered near-essential for raid teams. In Dawnstar (Blessing of Dawn), the zone instead provides strong team healing.",
      type: "ultimate",
      element: "Solar",
      damageType: "Support" as any,
      scaling: [],
      icon: "",
    },
    passive: {
      id: "tan2-passive",
      name: "Flare",
      description:
        "Dealing weapon damage builds Flare, a meter separate for each stance — Scout Rifle hits build it faster per-shot than Sniper Rifle hits, but sniper precision hits build more per hit. Once Flare is full, Tan-2's next Sunset or Sunrise is enhanced and instantly recharged; casting the enhanced version grants Tan-2 Phosphorus, a short buff that boosts his weapon damage.",
      type: "passive",
      element: "Solar",
      damageType: "Single Target" as any,
      scaling: [],
      icon: "",
    },
    recommendedWeapons: ["Polaris Lance", "Borealis", "Izanagi's Burden"],
    recommendedArtifacts: [],
    synergies: [],
    strengths: [
      { description: "Only 5-star Support in the game; near-mandatory for fast raid clears thanks to his team damage buff", category: "utility" as any },
      { description: "Flexible — can fully swap between healing and high single-target sniper damage mid-fight", category: "versatility" as any },
    ],
    weaknesses: [
      { description: "Sniper-reliant damage output requires consistent precision hits, which is punishing for less accurate players", category: "skill-floor" as any },
      { description: "Low mobility makes him an easy target if caught alone in PvP", category: "survivability" as any },
    ],
    tierListPlacement: {
      overall: "S",
      dps: "A",
      support: "S",
      pve: "S",
      pvp: "A",
    },
  },
  gwynn: {
    description:
      "Gwynn is a Void close-range assassin who fights with a dual-wielded Sidearm and a Shotgun, backed by her relic scythe, Verdict. Her entire kit loops around Void Spirits — orbs dropped by her kills that she rushes in to collect for healing and bonus damage, turning aggressive play into her main source of sustain.",
    faction: "",
    stats: {
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
    },
    skills: [
      {
        id: "gwynn-signature-1",
        name: "Void Dance",
        description:
          "Gwynn whirls with her scythe, dealing Void damage to combatants within about 6 meters and healing herself. Any Void Spirits within range, including ones already picked up, are pulled in and detonated for bonus damage.",
        type: "ability-1",
        element: "Void",
        damageType: "AoE" as any,
        scaling: [],
        icon: "",
      },
      {
        id: "gwynn-signature-2",
        name: "Soul Assault",
        description:
          "After a brief delay, Gwynn blinks roughly 12 meters toward her target, gaining temporary damage resistance during the cast. On arrival she deals Void damage to nearby enemies and inflicts Confined, a short crowd-control effect — useful for both closing distance and escaping danger.",
        type: "ability-2",
        element: "Void",
        damageType: "AoE" as any,
        scaling: [],
        icon: "",
      },
    ],
    talents: [],
    ultimate: {
      id: "gwynn-ultimate",
      name: "Soul Harvest",
      description:
        "Gwynn summons her relic, Verdict, and enters her Super with six Void Spirits instantly banked. While the Super is active, any further Void Spirits she generates are automatically drawn to her, letting Gwynn chain continuous scythe strikes without breaking to collect them manually.",
      type: "ultimate",
      element: "Void",
      damageType: "AoE" as any,
      scaling: [],
      icon: "",
    },
    passive: {
      id: "gwynn-passive",
      name: "Energy Severance",
      description:
        "Final blows — from abilities, weapons, finishers, or melee — drop a Void Spirit at the target's location (1-second internal cooldown). Walking over a Void Spirit collects it and restores health, giving Gwynn a built-in sustain loop as long as she keeps landing kills.",
      type: "passive",
      element: "Void",
      damageType: "Single Target" as any,
      scaling: [],
      icon: "",
    },
    recommendedWeapons: ["Octant Riot Disperser", "Concerto", "Eternal Retribution"],
    recommendedArtifacts: [],
    synergies: ["attal", "jolder", "ning-fei"],
    strengths: [
      { description: "Fully self-sufficient: kills generate her own healing and damage amplification", category: "sustain" as any },
      { description: "Strong solo and aggressive-clear character even at a single copy", category: "damage" as any },
    ],
    weaknesses: [
      { description: "Was a limited-banner-only character at release, making her hard for free-to-play accounts to acquire", category: "acquisition" as any },
      { description: "Close-range kit forces risky positioning against ranged or high-burst enemies", category: "playstyle" as any },
    ],
    tierListPlacement: {
      overall: "S",
      dps: "S",
      support: "",
      pve: "S",
      pvp: "S",
    },
  },
};

/**
 * Convert CharacterSummary to full Character object
 * Unverified fields are set to null/empty/default values,
 * except where a verified override exists in characterOverrides.
 */
function toFullCharacter(summary: any): Character {
  const override = characterOverrides[summary.slug] || {};
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
    ...override,
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
