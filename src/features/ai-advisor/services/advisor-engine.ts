import { characters } from "@/data/games/destiny-rising/characters";
import { weapons } from "@/data/games/destiny-rising/weapons";
import { builds } from "@/data/games/destiny-rising/builds";
import { teams } from "@/data/games/destiny-rising/teams";
import { getRecommendations } from "@/features/builds/services/build-service";
import { calculateSynergy } from "@/features/teams/services/synergy-engine";
import type { CharacterSummary, WeaponSummary, BuildSummary, TeamSummary } from "@/types/domain";

/**
 * AI Advisor v1 — Rule-Based Recommendation Engine
 *
 * Analyzes a character and provides comprehensive recommendations:
 * - Best build (with reasoning)
 * - Best weapon (with alternatives)
 * - Best team (with synergy scores)
 * - Materials priority (what to farm)
 * - Next goals (progression path)
 * - Alternative options
 *
 * This is Rule Engine v1. In Sprint 10+, it will be enhanced with
 * actual AI/ML models for more personalized recommendations.
 */

// ─── Response Types ───

export interface AdvisorRecommendation {
  character: CharacterSummary;
  bestBuild: BuildAnalysis;
  bestWeapon: WeaponAnalysis;
  bestTeam: TeamAnalysis;
  materialPriority: MaterialPriority[];
  progressionPath: ProgressionStep[];
  alternatives: AlternativeOption[];
  quickTips: string[];
  overallScore: number;
}

export interface BuildAnalysis {
  build: BuildSummary;
  reasoning: string[];
  scoreBreakdown: {
    damage: number;
    survivability: number;
    consistency: number;
    accessibility: number;
  };
}

export interface WeaponAnalysis {
  bestWeapon: WeaponSummary;
  alternatives: WeaponSummary[];
  reasoning: string[];
  upgradePriority: string;
}

export interface TeamAnalysis {
  bestTeam: TeamSummary;
  synergyScore: number;
  reasoning: string[];
  roleBreakdown: {
    mainCarry: string;
    subCarry: string;
    support: string;
    healer: string;
  };
}

export interface MaterialPriority {
  material: string;
  purpose: string;
  priority: "critical" | "high" | "medium" | "low";
  estimatedDays: number;
  source: string;
}

export interface ProgressionStep {
  step: number;
  title: string;
  description: string;
  estimatedTime: string;
  priority: "immediate" | "short-term" | "long-term";
  requirements: string[];
}

export interface AlternativeOption {
  type: "build" | "weapon" | "team";
  name: string;
  description: string;
  tradeoff: string;
  score: number;
}

// ─── AI Advisor Engine ───

export function getAdvisorRecommendation(characterId: string): AdvisorRecommendation | null {
  const character = characters.find((c) => c.id === characterId);
  if (!character) return null;

  const bestBuild = analyzeBestBuild(character);
  const bestWeapon = analyzeBestWeapon(character);
  const bestTeam = analyzeBestTeam(character);
  const materialPriority = analyzeMaterialPriority(character);
  const progressionPath = generateProgressionPath(character);
  const alternatives = generateAlternatives(character);
  const quickTips = generateQuickTips(character);
  const overallScore = calculateOverallScore(character, bestBuild, bestWeapon, bestTeam);

  return {
    character,
    bestBuild,
    bestWeapon,
    bestTeam,
    materialPriority,
    progressionPath,
    alternatives,
    quickTips,
    overallScore,
  };
}

// ─── Build Analysis ───

function analyzeBestBuild(character: CharacterSummary): BuildAnalysis {
  // Get all builds for this character
  const characterBuilds = builds.filter((b) => b.characterId === character.id);

  if (characterBuilds.length === 0) {
    // Fallback: recommend a generic build
    const topBuild = builds
      .filter((b) => b.buildType === "PvE")
      .sort((a, b) => b.popularity - a.popularity)[0];

    return {
      build: topBuild,
      reasoning: [
        "No specific builds found for this character yet",
        "Recommended based on general meta trends",
        "Check back after more builds are added",
      ],
      scoreBreakdown: {
        damage: topBuild.score.damage,
        survivability: topBuild.score.survivability,
        consistency: topBuild.score.consistency,
        accessibility: topBuild.score.accessibility,
      },
    };
  }

  // Score each build
  const scored = characterBuilds.map((build) => {
    let score = 0;
    const reasoning: string[] = [];

    // Popularity bonus
    if (build.popularity >= 90) {
      score += 15;
      reasoning.push("Highly popular among players");
    }

    // Tier bonus
    const tierScores: Record<string, number> = { "S+": 20, S: 15, "A+": 10, A: 8, "B+": 5, B: 3 };
    score += tierScores[build.tier] || 0;
    if (build.tier === "S+" || build.tier === "S") {
      reasoning.push(`Top tier build (${build.tier})`);
    }

    // Role match bonus
    if (character.role === "DPS" && (build.buildType === "PvE" || build.buildType === "Burst")) {
      score += 10;
      reasoning.push("Optimized for DPS playstyle");
    } else if (character.role === "Support" && build.buildType === "Support") {
      score += 10;
      reasoning.push("Optimized for support role");
    }

    // Accessibility bonus (for newer players)
    if (build.priority === "budget" || build.priority === "main") {
      score += 5;
      reasoning.push("Accessible build path");
    }

    // Overall score contribution
    score += Math.round(build.score.overall * 0.1);

    return { build, score, reasoning };
  });

  // Sort and pick best
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  return {
    build: best.build,
    reasoning: best.reasoning,
    scoreBreakdown: {
      damage: best.build.score.damage,
      survivability: best.build.score.survivability,
      consistency: best.build.score.consistency,
      accessibility: best.build.score.accessibility,
    },
  };
}

// ─── Weapon Analysis ───

function analyzeBestWeapon(character: CharacterSummary): WeaponAnalysis {
  // Find weapons matching character's weapon type
  const matchingWeapons = weapons.filter((w) => w.weaponType === character.weaponType);

  // Find the best weapon for this character (SSR, matching element preferred)
  const scored = matchingWeapons.map((weapon) => {
    let score = 0;
    const reasoning: string[] = [];

    // Rarity bonus
    if (weapon.rarity === "SSR") score += 20;
    else if (weapon.rarity === "SR") score += 10;

    // Element match bonus
    if (weapon.element === character.element) {
      score += 15;
      reasoning.push("Element matches character");
    }

    // Tier bonus
    const tierScores: Record<string, number> = { "S+": 20, S: 15, "A+": 10, A: 8 };
    score += tierScores[weapon.tier] || 0;

    // ATK bonus
    score += Math.min(20, Math.round(weapon.stats.baseATK / 35));

    // Popularity bonus
    if (weapon.popularity >= 90) {
      score += 10;
      reasoning.push("Meta-defining weapon");
    }

    return { weapon, score, reasoning };
  });

  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  const alternatives = scored.slice(1, 4).map((s) => s.weapon);

  return {
    bestWeapon: best.weapon,
    alternatives,
    reasoning: best.reasoning.length > 0
      ? best.reasoning
      : ["Best available weapon for this character type"],
    upgradePriority: best.weapon.rarity === "SSR" ? "Max priority" : "Upgrade when possible",
  };
}

// ─── Team Analysis ───

function analyzeBestTeam(character: CharacterSummary): TeamAnalysis {
  // Find teams that include this character
  const characterTeams = teams.filter((t) =>
    t.members.some((m) => m.characterId === character.id)
  );

  if (characterTeams.length > 0) {
    // Sort by team score
    characterTeams.sort((a, b) => b.score.overall - a.score.overall);
    const best = characterTeams[0];

    const mainCarry = best.members.find((m) => m.slot === "mainCarry");
    const subCarry = best.members.find((m) => m.slot === "subCarry");
    const support = best.members.find((m) => m.slot === "support");
    const healer = best.members.find((m) => m.slot === "healer");

    return {
      bestTeam: best,
      synergyScore: best.score.overall,
      reasoning: [
        `Team score: ${best.score.overall}/100`,
        `Template: ${best.template}`,
        `Element coverage: ${best.elementCoverage.length} elements`,
        best.score.damage >= 90 ? "Exceptional damage output" : "Balanced damage",
      ],
      roleBreakdown: {
        mainCarry: mainCarry?.characterName || "TBD",
        subCarry: subCarry?.characterName || "TBD",
        support: support?.characterName || "TBD",
        healer: healer?.characterName || "TBD",
      },
    };
  }

  // Fallback: Build a recommended team using synergy engine
  const allChars = characters.filter((c) => c.id !== character.id);

  // Find best sub-dps
  const subDps = allChars
    .filter((c) => c.role === "Sub-DPS")
    .map((c) => ({ char: c, synergy: calculateSynergy(character.id, c.id) }))
    .sort((a, b) => b.synergy.score - a.synergy.score)[0];

  // Find best support
  const supportChar = allChars
    .filter((c) => c.role === "Support")
    .map((c) => ({ char: c, synergy: calculateSynergy(character.id, c.id) }))
    .sort((a, b) => b.synergy.score - a.synergy.score)[0];

  // Find best healer
  const healerChar = allChars
    .filter((c) => c.role === "Healer")
    .map((c) => ({ char: c, synergy: calculateSynergy(character.id, c.id) }))
    .sort((a, b) => b.synergy.score - a.synergy.score)[0];

  const avgSynergy = subDps && supportChar && healerChar
    ? Math.round((subDps.synergy.score + supportChar.synergy.score + healerChar.synergy.score) / 3)
    : 50;

  return {
    bestTeam: {
      id: "generated",
      slug: "generated-team",
      title: `Recommended Team for ${character.name}`,
      description: "AI-generated team based on synergy analysis",
      template: "PvE",
      tier: avgSynergy >= 80 ? "S" : avgSynergy >= 60 ? "A" : "B",
      rating: 4.0,
      votes: 0,
      popularity: 0,
      members: [
        {
          characterId: character.id,
          characterName: character.name,
          characterSlug: character.slug,
          characterIcon: character.icon,
          characterColor: character.colorTheme,
          element: character.element,
          role: character.role,
          rarity: character.rarity,
          slot: "mainCarry",
          weaponId: "",
          weaponName: "Best available",
        },
        ...(subDps ? [{
          characterId: subDps.char.id,
          characterName: subDps.char.name,
          characterSlug: subDps.char.slug,
          characterIcon: subDps.char.icon,
          characterColor: subDps.char.colorTheme,
          element: subDps.char.element,
          role: subDps.char.role,
          rarity: subDps.char.rarity,
          slot: "subCarry" as const,
          weaponId: "",
          weaponName: "Best available",
        }] : []),
        ...(supportChar ? [{
          characterId: supportChar.char.id,
          characterName: supportChar.char.name,
          characterSlug: supportChar.char.slug,
          characterIcon: supportChar.char.icon,
          characterColor: supportChar.char.colorTheme,
          element: supportChar.char.element,
          role: supportChar.char.role,
          rarity: supportChar.char.rarity,
          slot: "support" as const,
          weaponId: "",
          weaponName: "Best available",
        }] : []),
        ...(healerChar ? [{
          characterId: healerChar.char.id,
          characterName: healerChar.char.name,
          characterSlug: healerChar.char.slug,
          characterIcon: healerChar.char.icon,
          characterColor: healerChar.char.colorTheme,
          element: healerChar.char.element,
          role: healerChar.char.role,
          rarity: healerChar.char.rarity,
          slot: "healer" as const,
          weaponId: "",
          weaponName: "Best available",
        }] : []),
      ],
      elementCoverage: [character.element],
      score: {
        overall: avgSynergy,
        damage: 70,
        support: 75,
        control: 65,
        survivability: 70,
        energy: 70,
        consistency: 70,
        accessibility: 80,
        reasons: ["AI-generated based on synergy analysis"],
      },
      tags: ["AI Recommended"],
      verification: { verified: false, gameVersion: "1.4.0" },
    },
    synergyScore: avgSynergy,
    reasoning: [
      "Team generated based on synergy analysis",
      subDps ? `Sub-DPS synergy: ${subDps.synergy.score}/100` : "Sub-DPS slot open",
      supportChar ? `Support synergy: ${supportChar.synergy.score}/100` : "Support slot open",
      healerChar ? `Healer synergy: ${healerChar.synergy.score}/100` : "Healer slot open",
    ],
    roleBreakdown: {
      mainCarry: character.name,
      subCarry: subDps?.char.name || "TBD",
      support: supportChar?.char.name || "TBD",
      healer: healerChar?.char.name || "TBD",
    },
  };
}

// ─── Material Priority ───

function analyzeMaterialPriority(character: CharacterSummary): MaterialPriority[] {
  const priorities: MaterialPriority[] = [];

  // Character ascension materials (critical)
  priorities.push({
    material: "Character Ascension Materials",
    purpose: `Ascend ${character.name} to max level`,
    priority: "critical",
    estimatedDays: 7,
    source: "Boss drops + Weekly rewards",
  });

  // Weapon upgrade materials
  priorities.push({
    material: "Weapon Enhancement Ore",
    purpose: "Upgrade weapon to max level",
    priority: "high",
    estimatedDays: 5,
    source: "Daily missions + Domain rewards",
  });

  // Skill upgrade materials
  priorities.push({
    material: "Skill Upgrade Crystals",
    purpose: "Level up key skills",
    priority: "high",
    estimatedDays: 4,
    source: "Weekly boss + Shop",
  });

  // Artifact materials
  priorities.push({
    material: "Artifact Enhancement Materials",
    purpose: "Max out artifact set",
    priority: "medium",
    estimatedDays: 10,
    source: "Artifact domains",
  });

  // Team materials
  priorities.push({
    material: "Team Support Materials",
    purpose: "Upgrade support characters",
    priority: "low",
    estimatedDays: 14,
    source: "Various sources",
  });

  return priorities;
}

// ─── Progression Path ───

function generateProgressionPath(character: CharacterSummary): ProgressionStep[] {
  return [
    {
      step: 1,
      title: "Level Up to 60",
      description: `Focus on leveling ${character.name} to 60 first`,
      estimatedTime: "3-5 days",
      priority: "immediate",
      requirements: ["Character EXP materials", "Gold"],
    },
    {
      step: 2,
      title: "Ascend to Phase 4",
      description: "Unlock new abilities and stat caps",
      estimatedTime: "5-7 days",
      priority: "immediate",
      requirements: ["Ascension materials", "Boss drops"],
    },
    {
      step: 3,
      title: "Get Signature Weapon",
      description: "Acquire the best weapon for this character",
      estimatedTime: "1-2 weeks",
      priority: "short-term",
      requirements: ["Gacha currency or crafting materials"],
    },
    {
      step: 4,
      title: "Max Key Skills",
      description: "Level up primary damage/utility skills",
      estimatedTime: "1-2 weeks",
      priority: "short-term",
      requirements: ["Skill upgrade materials", "Gold"],
    },
    {
      step: 5,
      title: "Build Complete Team",
      description: "Develop support characters for optimal team",
      estimatedTime: "2-4 weeks",
      priority: "long-term",
      requirements: ["Team character materials", "Weapon materials"],
    },
    {
      step: 6,
      title: "Max Artifacts",
      description: "Get perfect artifact rolls for this build",
      estimatedTime: "4-8 weeks",
      priority: "long-term",
      requirements: ["Artifact resin/stamina", "Enhancement materials"],
    },
  ];
}

// ─── Alternatives ───

function generateAlternatives(character: CharacterSummary): AlternativeOption[] {
  const alternatives: AlternativeOption[] = [];

  // Alternative builds
  const charBuilds = builds.filter((b) => b.characterId === character.id);
  if (charBuilds.length > 1) {
    const altBuild = charBuilds.sort((a, b) => b.score.overall - a.score.overall)[1];
    alternatives.push({
      type: "build",
      name: altBuild.title,
      description: altBuild.description,
      tradeoff: altBuild.priority === "budget"
        ? "Lower damage but more accessible"
        : "Different playstyle, situational use",
      score: altBuild.score.overall,
    });
  }

  // Alternative weapons
  const altWeapons = weapons
    .filter((w) => w.weaponType === character.weaponType && w.rarity !== "SSR")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 2);

  altWeapons.forEach((w) => {
    alternatives.push({
      type: "weapon",
      name: w.name,
      description: `${w.rarity} ${w.weaponType} — ${w.element} element`,
      tradeoff: w.rarity === "SR" ? "Good F2P alternative" : "Budget option",
      score: Math.round(w.stats.baseATK / 7),
    });
  });

  // Alternative teams
  const altTeams = teams
    .filter((t) => t.template !== "EndGame" && t.template !== "Whale")
    .sort((a, b) => b.score.overall - a.score.overall)
    .slice(0, 2);

  altTeams.forEach((t) => {
    alternatives.push({
      type: "team",
      name: t.title,
      description: t.description,
      tradeoff: `${t.template} focused team`,
      score: t.score.overall,
    });
  });

  return alternatives.slice(0, 6);
}

// ─── Quick Tips ───

function generateQuickTips(character: CharacterSummary): string[] {
  const tips: string[] = [];

  // Role-based tips
  switch (character.role) {
    case "DPS":
      tips.push("Focus on CR/CD artifacts for maximum damage output");
      tips.push("Pair with a support character for damage amplification");
      break;
    case "Sub-DPS":
      tips.push("Build for off-field damage and elemental application");
      tips.push("Energy Recharge is crucial for uptime");
      break;
    case "Support":
      tips.push("Build for maximum buff duration and strength");
      tips.push("Coordinate with main DPS for optimal buff windows");
      break;
    case "Healer":
      tips.push("Build for maximum healing output and survivability");
      tips.push("Keep healer behind shield characters in combat");
      break;
    case "Tank":
      tips.push("Build for maximum HP and DEF");
      tips.push("Use taunt skills to protect squishy teammates");
      break;
  }

  // Element-based tips
  switch (character.element) {
    case "Fire":
      tips.push("Fire pairs well with Ice for Melt reactions");
      break;
    case "Ice":
      tips.push("Ice can freeze enemies, creating safe damage windows");
      break;
    case "Lightning":
      tips.push("Lightning excels at rapid damage and energy generation");
      break;
    case "Dark":
      tips.push("Dark element has strong burst potential");
      break;
    case "Wind":
      tips.push("Wind provides excellent crowd control and swirl reactions");
      break;
  }

  // General tips
  tips.push("Always check patch notes for balance changes");
  tips.push("Save resources for banner characters you really want");

  return tips;
}

// ─── Overall Score ───

function calculateOverallScore(
  character: CharacterSummary,
  build: BuildAnalysis,
  weapon: WeaponAnalysis,
  team: TeamAnalysis
): number {
  const buildScore = build.build.score.overall * 0.3;
  const weaponScore = (weapon.bestWeapon.stats.baseATK / 7) * 0.25;
  const teamScore = team.synergyScore * 0.25;
  const characterScore = (character.popularity + character.winRate) * 0.2;

  return Math.round(buildScore + weaponScore + teamScore + characterScore);
}

// ─── Get All Characters for Advisor ───

export function getAdvisorCharacters(): CharacterSummary[] {
  return characters.sort((a, b) => b.popularity - a.popularity);
}
