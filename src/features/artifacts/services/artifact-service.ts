import { artifacts, artifactSets } from "@/data/games/destiny-rising/artifacts";
import type { Artifact, ArtifactSummary, ArtifactFilters, ArtifactSet } from "@/types/domain";

/**
 * Artifact Service
 * Handles artifact data operations and optimization recommendations.
 */

export function getAllArtifacts(): Artifact[] {
  return artifacts;
}

export function getArtifactSummaries(): ArtifactSummary[] {
  return artifacts.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    icon: a.icon,
    rarity: a.rarity,
    slot: a.slot,
    setId: a.setId,
    setName: a.setName,
    mainStat: a.mainStat,
    verification: {
      verified: a.verification.verified,
      gameVersion: a.verification.gameVersion,
    },
  }));
}

export function getArtifactBySlug(slug: string): Artifact | undefined {
  return artifacts.find((a) => a.slug === slug);
}

export function getArtifactById(id: string): Artifact | undefined {
  return artifacts.find((a) => a.id === id);
}

export function getArtifactSets(): ArtifactSet[] {
  return artifactSets;
}

export function getArtifactSetById(id: string): ArtifactSet | undefined {
  return artifactSets.find((s) => s.id === id);
}

export function filterArtifacts(list: Artifact[], filters: ArtifactFilters): Artifact[] {
  let result = [...list];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.setName.toLowerCase().includes(search) ||
        a.mainStat.toLowerCase().includes(search)
    );
  }

  if (filters.sets.length > 0) {
    result = result.filter((a) => filters.sets.includes(a.setId));
  }

  if (filters.slots.length > 0) {
    result = result.filter((a) => filters.slots.includes(a.slot));
  }

  if (filters.rarities.length > 0) {
    result = result.filter((a) => filters.rarities.includes(a.rarity));
  }

  if (filters.mainStats.length > 0) {
    result = result.filter((a) => filters.mainStats.includes(a.mainStat));
  }

  return result;
}

export function getArtifactsBySet(setId: string): Artifact[] {
  return artifacts.filter((a) => a.setId === setId);
}

export function getArtifactsBySlot(slot: string): Artifact[] {
  return artifacts.filter((a) => a.slot === slot);
}

export function getArtifactsForCharacter(characterId: string): Artifact[] {
  return artifacts.filter((a) => a.recommendedFor.includes(characterId));
}

export function getOptimalArtifactSet(characterId: string, goal: "damage" | "survivability" | "support"): string {
  // Simplified optimization logic
  const charArtifacts = artifacts.filter((a) => a.recommendedFor.includes(characterId));

  if (charArtifacts.length === 0) {
    return "set-berserker"; // Default
  }

  // Count sets
  const setCounts: Record<string, number> = {};
  charArtifacts.forEach((a) => {
    setCounts[a.setId] = (setCounts[a.setId] || 0) + 1;
  });

  // Return most common set
  return Object.entries(setCounts).sort((a, b) => b[1] - a[1])[0][0];
}

export function getOptimalMainStats(
  setId: string,
  slot: "sands" | "goblet" | "crown",
  goal: "damage" | "survivability" | "support"
): string {
  // Simplified logic based on goal
  if (slot === "sands") {
    return goal === "damage" ? "ATK%" : goal === "support" ? "Energy Recharge%" : "HP%";
  }

  if (slot === "goblet") {
    // Return element damage bonus based on set
    const set = artifactSets.find((s) => s.id === setId);
    if (set?.name.includes("Inferno")) return "Fire Damage Bonus%";
    if (set?.name.includes("Glacier")) return "Ice Damage Bonus%";
    if (set?.name.includes("Void")) return "Dark Damage Bonus%";
    return "ATK%";
  }

  if (slot === "crown") {
    return goal === "damage" ? "Crit Rate%" : goal === "support" ? "Healing Bonus%" : "Crit Damage%";
  }

  return "ATK%";
}

export function getOptimalSubStats(goal: "damage" | "survivability" | "support"): string[] {
  if (goal === "damage") {
    return ["Crit Rate%", "Crit Damage%", "ATK%", "Elemental Mastery"];
  }

  if (goal === "survivability") {
    return ["HP%", "DEF%", "Energy Recharge%", "Elemental Mastery"];
  }

  if (goal === "support") {
    return ["Energy Recharge%", "ATK%", "Elemental Mastery", "HP%"];
  }

  return ["ATK%", "Crit Rate%", "Crit Damage%", "Elemental Mastery"];
}
