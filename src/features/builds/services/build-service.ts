import type { BuildSummary, BuildFilters, BuildSortField, BuildComparison } from "@/types/domain";
import { builds } from "@/data/games/destiny-rising/builds";
import { logger } from "@/lib/logger";

const CONTEXT = "BuildService";

/**
 * Build Service — Main API for build data operations.
 * Includes the Recommendation Engine v1 (rule-based).
 */

// ─── Repository Layer ───

export function getAllBuilds(): BuildSummary[] {
  logger.debug(CONTEXT, "Fetching all builds", { count: builds.length });
  return [...builds];
}

export function getBuildBySlug(slug: string): BuildSummary | undefined {
  return builds.find((b) => b.slug === slug);
}

export function getBuildsByCharacter(characterId: string): BuildSummary[] {
  return builds.filter((b) => b.characterId === characterId);
}

export function getBuildsByCharacterSlug(slug: string): BuildSummary[] {
  const build = builds.find((b) => b.characterSlug === slug);
  if (!build) return [];
  return builds.filter((b) => b.characterId === build.characterId);
}

export function getBuildCount(): number {
  return builds.length;
}

export function getBuildSlugs(): string[] {
  return builds.map((b) => b.slug);
}

// ─── Filter & Sort ───

export function filterBuilds(
  buildList: BuildSummary[],
  filters: BuildFilters
): BuildSummary[] {
  let result = [...buildList];

  if (filters.search.trim()) {
    const query = filters.search.toLowerCase().trim();
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.characterName.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (filters.characterIds.length > 0) {
    result = result.filter((b) => filters.characterIds.includes(b.characterId));
  }

  if (filters.buildTypes.length > 0) {
    result = result.filter((b) => filters.buildTypes.includes(b.buildType));
  }

  if (filters.difficulties.length > 0) {
    result = result.filter((b) => filters.difficulties.includes(b.difficulty));
  }

  if (filters.priorities.length > 0) {
    result = result.filter((b) => filters.priorities.includes(b.priority));
  }

  result = sortBuilds(result, filters.sortBy, filters.sortOrder);

  return result;
}

export function sortBuilds(
  buildList: BuildSummary[],
  sortBy: BuildSortField,
  order: "asc" | "desc" = "desc"
): BuildSummary[] {
  return [...buildList].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "popularity": comparison = a.popularity - b.popularity; break;
      case "rating": comparison = a.rating - b.rating; break;
      case "score": comparison = a.score.overall - b.score.overall; break;
      case "tier": {
        const tierOrder: Record<string, number> = { "S+": 7, S: 6, "A+": 5, A: 4, "B+": 3, B: 2, C: 1 };
        comparison = (tierOrder[a.tier] || 0) - (tierOrder[b.tier] || 0);
        break;
      }
      case "difficulty": {
        const diffOrder: Record<string, number> = { easy: 1, medium: 2, hard: 3, expert: 4 };
        comparison = diffOrder[a.difficulty] - diffOrder[b.difficulty];
        break;
      }
      case "name": comparison = a.title.localeCompare(b.title); break;
      default: comparison = 0;
    }
    return order === "desc" ? -comparison : comparison;
  });
}

// ─── Filter Options ───

export function getBuildFilterOptions() {
  return {
    characters: [...new Set(builds.map((b) => ({ id: b.characterId, name: b.characterName, slug: b.characterSlug })))],
    buildTypes: [...new Set(builds.map((b) => b.buildType))],
    difficulties: [...new Set(builds.map((b) => b.difficulty))],
    priorities: [...new Set(builds.map((b) => b.priority))],
  };
}

// ═══════════════════════════════════════════════════════════════
// RECOMMENDATION ENGINE v1 — Rule-Based System
// ═══════════════════════════════════════════════════════════════

export interface RecommendationInput {
  characterId: string;
  characterName: string;
  element: string;
  role: string;
  playstyle?: string;
  availableWeapons?: string[];
}

export interface Recommendation {
  build: BuildSummary;
  matchScore: number;
  matchReasons: string[];
  isTopPick: boolean;
}

/**
 * Recommendation Engine v1
 * Rule-based system that recommends builds based on character properties.
 * Future: Will be replaced by AI Advisor.
 */
export function getRecommendations(input: RecommendationInput): Recommendation[] {
  const characterBuilds = builds.filter((b) => b.characterId === input.characterId);

  if (characterBuilds.length === 0) {
    // Fallback: find builds for similar characters
    return builds
      .filter((b) => b.buildType === "PvE")
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3)
      .map((build, index) => ({
        build,
        matchScore: 50 - index * 5,
        matchReasons: ["General popular build"],
        isTopPick: index === 0,
      }));
  }

  // Score each build based on rules
  const scored = characterBuilds.map((build) => {
    let matchScore = 0;
    const matchReasons: string[] = [];

    // Rule 1: Recommended builds get +30
    if (build.recommended) {
      matchScore += 30;
      matchReasons.push("Community recommended");
    }

    // Rule 2: Higher tier = higher score
    const tierScores: Record<string, number> = { "S+": 25, S: 20, "A+": 15, A: 10, "B+": 5, B: 0 };
    const tierScore = tierScores[build.tier] || 0;
    matchScore += tierScore;
    if (tierScore >= 20) matchReasons.push(`Top tier (${build.tier})`);

    // Rule 3: Higher overall score = higher match
    matchScore += Math.round(build.score.overall * 0.2);
    if (build.score.overall >= 90) matchReasons.push("Exceptional build score");

    // Rule 4: Role-based matching
    if (input.role === "DPS" && (build.buildType === "PvE" || build.buildType === "Burst" || build.buildType === "Boss")) {
      matchScore += 15;
      matchReasons.push("Optimized for DPS playstyle");
    }
    if (input.role === "Support" && build.buildType === "Support") {
      matchScore += 15;
      matchReasons.push("Optimized for support playstyle");
    }
    if (input.role === "Tank" && build.tags.includes("Tank")) {
      matchScore += 15;
      matchReasons.push("Optimized for tank playstyle");
    }
    if (input.role === "Healer" && build.tags.includes("Healer")) {
      matchScore += 15;
      matchReasons.push("Optimized for healer playstyle");
    }

    // Rule 5: Popularity bonus
    if (build.popularity >= 90) {
      matchScore += 5;
      matchReasons.push("Widely used by top players");
    }

    // Rule 6: Priority bonus
    if (build.priority === "main") {
      matchScore += 10;
      matchReasons.push("Primary build path");
    }

    return {
      build,
      matchScore: Math.min(100, matchScore),
      matchReasons,
      isTopPick: false,
    };
  });

  // Sort by match score and mark top pick
  scored.sort((a, b) => b.matchScore - a.matchScore);
  if (scored.length > 0) scored[0].isTopPick = true;

  return scored;
}

// ─── Build Comparison ───

export function compareBuilds(buildAId: string, buildBId: string): BuildComparison | null {
  const buildA = builds.find((b) => b.id === buildAId);
  const buildB = builds.find((b) => b.id === buildBId);

  if (!buildA || !buildB) return null;

  const differences: BuildComparison["differences"] = [
    {
      category: "Overall Score",
      buildAValue: `${buildA.score.overall}/100`,
      buildBValue: `${buildB.score.overall}/100`,
      winner: buildA.score.overall > buildB.score.overall ? "A" : buildA.score.overall < buildB.score.overall ? "B" : "tie",
    },
    {
      category: "Damage",
      buildAValue: `${buildA.score.damage}/100`,
      buildBValue: `${buildB.score.damage}/100`,
      winner: buildA.score.damage > buildB.score.damage ? "A" : buildA.score.damage < buildB.score.damage ? "B" : "tie",
    },
    {
      category: "Survivability",
      buildAValue: `${buildA.score.survivability}/100`,
      buildBValue: `${buildB.score.survivability}/100`,
      winner: buildA.score.survivability > buildB.score.survivability ? "A" : buildA.score.survivability < buildB.score.survivability ? "B" : "tie",
    },
    {
      category: "Tier",
      buildAValue: buildA.tier,
      buildBValue: buildB.tier,
      winner: "tie",
    },
    {
      category: "Difficulty",
      buildAValue: buildA.difficulty,
      buildBValue: buildB.difficulty,
      winner: "tie",
    },
    {
      category: "Rating",
      buildAValue: `${buildA.rating}/5`,
      buildBValue: `${buildB.rating}/5`,
      winner: buildA.rating > buildB.rating ? "A" : buildA.rating < buildB.rating ? "B" : "tie",
    },
    {
      category: "Weapon",
      buildAValue: buildA.weapon.name,
      buildBValue: buildB.weapon.name,
      winner: "tie",
    },
  ];

  const recommendation =
    buildA.score.overall > buildB.score.overall
      ? `${buildA.title} has a higher overall score and is recommended for most players.`
      : buildB.score.overall > buildA.score.overall
      ? `${buildB.title} has a higher overall score and is recommended for most players.`
      : `Both builds are equally viable. Choose based on your preferred playstyle.`;

  return { buildA, buildB, differences, recommendation };
}
