import { artifacts, artifactSets } from "@/data/games/destiny-rising/artifacts";
import type { Artifact, ArtifactSummary, ArtifactFilters, ArtifactSet } from "@/types/domain";

/**
 * Artifact Service
 * 
 * Handles artifact data operations for Destiny: Rising.
 * 
 * v7.3 Baseline:
 * - 80 artifacts with verified name, slot, type, effect
 * - Set bonus system confirmed but artifact→set mapping unavailable
 * - No verified optimization data exists
 * 
 * Functions that would require verified DR optimization data
 * return empty/unavailable results rather than fabricated recommendations.
 */

export function getAllArtifacts(): Artifact[] {
  return artifacts;
}

export function getArtifactSummaries(): ArtifactSummary[] {
  return artifacts.map((a: any) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    icon: a.icon,
    rarity: a.rarity,
    slot: a.slot,
    setId: a.setId || "",
    setName: a.setName || "",
    mainStat: a.mainStat || "",
    verification: {
      verified: a.verification?.verified ?? false,
      gameVersion: a.verification?.gameVersion ?? "",
    },
  }));
}

export function getArtifactBySlug(slug: string): Artifact | undefined {
  return artifacts.find((a: any) => a.slug === slug);
}

export function getArtifactById(id: string): Artifact | undefined {
  return artifacts.find((a: any) => a.id === id);
}

export function getArtifactSets(): ArtifactSet[] {
  // DR has no verified artifact set data
  return artifactSets;
}

export function getArtifactSetById(id: string): ArtifactSet | undefined {
  return artifactSets.find((s: any) => s.id === id);
}

export function filterArtifacts(list: Artifact[], filters: ArtifactFilters): Artifact[] {
  let result = [...list];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (a: any) =>
        (a.name || "").toLowerCase().includes(search) ||
        (a.setName || "").toLowerCase().includes(search) ||
        (a.attributeType || "").toLowerCase().includes(search) ||
        (a.effect || "").toLowerCase().includes(search)
    );
  }

  if (filters.sets.length > 0) {
    result = result.filter((a: any) => filters.sets.includes(a.setId || ""));
  }

  if (filters.slots.length > 0) {
    result = result.filter((a: any) => filters.slots.includes(a.slot || ""));
  }

  if (filters.rarities.length > 0) {
    result = result.filter((a: any) => filters.rarities.includes(a.rarity || ""));
  }

  if (filters.mainStats.length > 0) {
    result = result.filter((a: any) => filters.mainStats.includes(a.mainStat || ""));
  }

  return result;
}

export function getArtifactsBySet(setId: string): Artifact[] {
  return artifacts.filter((a: any) => (a.setId || "") === setId);
}

export function getArtifactsBySlot(slot: string): Artifact[] {
  return artifacts.filter((a: any) => {
    // Support both DR slot numbers (1-4) and legacy slot names
    if (a.slotNumber !== undefined) {
      return String(a.slotNumber) === slot;
    }
    return (a.slot || "") === slot;
  });
}

export function getArtifactsForCharacter(_characterId: string): Artifact[] {
  // No verified character→artifact mapping exists in v7.3 baseline
  return [];
}

export function getOptimalArtifactSet(_characterId: string, _goal: "damage" | "survivability" | "support"): string {
  // No verified DR artifact optimization data exists
  // DR artifacts have individual effects, not Genshin-style set bonuses
  // Set bonus system is confirmed but mapping is unavailable
  return "";
}

export function getOptimalMainStats(
  _setId: string,
  _slot: string,
  _goal: "damage" | "survivability" | "support"
): string {
  // No verified DR artifact main stat optimization data exists
  // DR artifacts use attribute types (Survival, Movement, Ability, etc.)
  // not Genshin-style main stats (ATK%, Crit Rate%, etc.)
  return "";
}

export function getOptimalSubStats(_goal: "damage" | "survivability" | "support"): string[] {
  // No verified DR artifact sub stat optimization data exists
  return [];
}
