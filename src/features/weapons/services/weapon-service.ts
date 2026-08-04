import type { WeaponSummary, WeaponFilters, WeaponSortField } from "@/types/domain";
import { weaponRepository } from "./weapon-repository";
import { WeaponMapper } from "./weapon-mapper";
import { logger } from "@/lib/logger";

const CONTEXT = "WeaponService";

/**
 * Weapon Service — Main API for weapon data operations.
 * Handles filtering, sorting, searching, and data retrieval.
 */

// ─── List Operations ───

export function getAllWeapons(): WeaponSummary[] {
  const raw = weaponRepository.findAll();
  logger.debug(CONTEXT, "Fetching all weapons", { count: raw.length });
  return WeaponMapper.toSummaries(raw);
}

export function getWeaponSlugs(): string[] {
  return weaponRepository.getAllSlugs();
}

export function getWeaponCount(): number {
  return weaponRepository.count();
}

export function getWeaponBySlug(slug: string): WeaponSummary | undefined {
  const raw = weaponRepository.findBySlug(slug);
  return raw ? WeaponMapper.toSummary(raw) : undefined;
}

export function getWeaponsByIds(ids: string[]): WeaponSummary[] {
  const raw = weaponRepository.findManyByIds(ids);
  return WeaponMapper.toSummaries(raw);
}

// ─── Filter & Sort Engine ───

export function filterWeapons(
  weapons: WeaponSummary[],
  filters: WeaponFilters
): WeaponSummary[] {
  let result = [...weapons];

  // Search
  if (filters.search.trim()) {
    const query = filters.search.toLowerCase().trim();
    result = result.filter(
      (w) =>
        w.name.toLowerCase().includes(query) ||
        w.weaponType.toLowerCase().includes(query) ||
        w.element.toLowerCase().includes(query) ||
        w.manufacturer.toLowerCase().includes(query)
    );
  }

  // Weapon type filter
  if (filters.weaponTypes.length > 0) {
    result = result.filter((w) => filters.weaponTypes.includes(w.weaponType));
  }

  // Rarity filter
  if (filters.rarities.length > 0) {
    result = result.filter((w) => filters.rarities.includes(w.rarity));
  }

  // Element filter
  if (filters.elements.length > 0) {
    result = result.filter((w) => filters.elements.includes(w.element));
  }

  // Damage type filter
  if (filters.damageTypes.length > 0) {
    result = result.filter((w) => filters.damageTypes.includes(w.damageType));
  }

  // Manufacturer filter
  if (filters.manufacturers.length > 0) {
    result = result.filter((w) => filters.manufacturers.includes(w.manufacturer));
  }

  // Availability filter
  if (filters.availability.length > 0) {
    // Would need availability field in summary
  }

  // Sort
  result = sortWeapons(result, filters.sortBy, filters.sortOrder);

  logger.debug(CONTEXT, "Filter applied", {
    inputCount: weapons.length,
    outputCount: result.length,
    filters,
  });

  return result;
}

export function sortWeapons(
  weapons: WeaponSummary[],
  sortBy: WeaponSortField,
  order: "asc" | "desc" = "desc"
): WeaponSummary[] {
  const sorted = [...weapons].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "rarity": {
        const rarityOrder = { SSR: 4, SR: 3, R: 2, N: 1 };
        comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
        break;
      }
      case "weaponType":
        comparison = a.weaponType.localeCompare(b.weaponType);
        break;
      case "element":
        comparison = a.element.localeCompare(b.element);
        break;
      case "baseATK":
        comparison = a.stats.baseATK - b.stats.baseATK;
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
      case "tier": {
        const tierOrder: Record<string, number> = {
          "S+": 7, S: 6, "A+": 5, A: 4, "B+": 3, B: 2, C: 1,
        };
        comparison = (tierOrder[a.tier] || 0) - (tierOrder[b.tier] || 0);
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

export function getWeaponFilterOptions() {
  const allWeapons = getAllWeapons();

  return {
    weaponTypes: [...new Set(allWeapons.map((w) => w.weaponType))].sort(),
    rarities: [...new Set(allWeapons.map((w) => w.rarity))],
    elements: [...new Set(allWeapons.map((w) => w.element))].sort(),
    damageTypes: [...new Set(allWeapons.map((w) => w.damageType))].sort(),
    manufacturers: [...new Set(allWeapons.map((w) => w.manufacturer))].sort(),
  };
}
