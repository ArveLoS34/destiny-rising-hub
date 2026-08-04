import { characters } from "@/data/games/destiny-rising/characters";
import { getCharacterBySlug, getCharacterById } from "@/data/games/destiny-rising/characters-detail";
import type { CharacterSummary, CharacterFilters, CharacterSortField } from "@/types/domain";
import { logger } from "@/lib/logger";

const CONTEXT = "CharacterService";

/**
 * Character Service — Data access layer for character data.
 * Handles filtering, sorting, searching, and data retrieval.
 */

// ─── List Operations ───

export function getAllCharacters(): CharacterSummary[] {
  logger.debug(CONTEXT, "Fetching all characters", { count: characters.length });
  return characters;
}

export function getCharacterSlugs(): string[] {
  return characters.map((c) => c.slug);
}

export function getCharacterCount(): number {
  return characters.length;
}

// ─── Detail Operations ───

export function getCharacterDetail(slug: string) {
  logger.debug(CONTEXT, "Fetching character detail", { slug });
  return getCharacterBySlug(slug);
}

export function getCharacterDetailById(id: string) {
  return getCharacterById(id);
}

// ─── Filter & Sort Engine ───

export function filterCharacters(
  chars: CharacterSummary[],
  filters: CharacterFilters
): CharacterSummary[] {
  let result = [...chars];

  // Search
  if (filters.search.trim()) {
    const query = filters.search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.element.toLowerCase().includes(query) ||
        c.role.toLowerCase().includes(query)
    );
  }

  // Element filter
  if (filters.elements.length > 0) {
    result = result.filter((c) => filters.elements.includes(c.element));
  }

  // Role filter
  if (filters.roles.length > 0) {
    result = result.filter((c) => filters.roles.includes(c.role));
  }

  // Rarity filter
  if (filters.rarities.length > 0) {
    result = result.filter((c) => filters.rarities.includes(c.rarity));
  }

  // Weapon type filter
  if (filters.weaponTypes.length > 0) {
    result = result.filter((c) => filters.weaponTypes.includes(c.weaponType));
  }

  // Faction filter
  if (filters.factions.length > 0) {
    result = result.filter((c) => filters.factions.includes(c.faction));
  }

  // Sort
  result = sortCharacters(result, filters.sortBy, filters.sortOrder);

  logger.debug(CONTEXT, "Filter applied", {
    inputCount: chars.length,
    outputCount: result.length,
    filters,
  });

  return result;
}

export function sortCharacters(
  chars: CharacterSummary[],
  sortBy: CharacterSortField,
  order: "asc" | "desc" = "desc"
): CharacterSummary[] {
  const sorted = [...chars].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "rarity": {
        const rarityOrder: Record<string, number> = { SSR: 4, SR: 3, R: 2, N: 1 };
        comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
        break;
      }
      case "element":
        comparison = a.element.localeCompare(b.element);
        break;
      case "role":
        comparison = a.role.localeCompare(b.role);
        break;
      case "popularity":
        comparison = a.popularity - b.popularity;
        break;
      case "winRate":
        comparison = a.winRate - b.winRate;
        break;
      case "releaseDate":
        comparison = a.releaseVersion.localeCompare(b.releaseVersion);
        break;
      case "tierList": {
        const tierOrder: Record<string, number> = {
          "S+": 7, S: 6, "A+": 5, A: 4, "B+": 3, B: 2, C: 1,
        };
        comparison = (tierOrder[a.tierListPlacement] || 0) - (tierOrder[b.tierListPlacement] || 0);
        break;
      }
      default:
        comparison = 0;
    }

    return order === "desc" ? -comparison : comparison;
  });

  return sorted;
}

// ─── Filter Options ───

export function getFilterOptions() {
  const elements = [...new Set(characters.map((c) => c.element))] as import("@/types/domain").Element[];
  const roles = [...new Set(characters.map((c) => c.role))] as import("@/types/domain").Role[];
  const rarities = [...new Set(characters.map((c) => c.rarity))] as import("@/types/domain").Rarity[];
  const weaponTypes = [...new Set(characters.map((c) => c.weaponType))] as import("@/types/domain").WeaponType[];
  const factions = [...new Set(characters.map((c) => c.faction))] as import("@/types/domain").Faction[];

  return {
    elements,
    roles,
    rarities,
    weaponTypes,
    factions,
  };
}
