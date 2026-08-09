import type { Material, MaterialSummary, MaterialFilters, MaterialCategory, MaterialRarity, MaterialSource } from "@/types/domain";
import { materials } from "@/data/games/destiny-rising/materials";
import { logger } from "@/lib/logger";

const CONTEXT = "MaterialService";

/**
 * Material Service — Data access layer for material data.
 * Handles filtering, searching, and relationship queries.
 */

// ─── List Operations ───

export function getAllMaterials(): Material[] {
  logger.debug(CONTEXT, "Fetching all materials", { count: materials.length });
  return materials;
}

export function getMaterialSummaries(): MaterialSummary[] {
  return materials.map((m: any) => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    icon: m.icon,
    rarity: m.rarity,
    category: m.category,
    sources: m.sources,
    isWeekly: m.isWeekly,
    isDaily: m.isDaily,
    verification: {
      verified: m.verification.verified,
      gameVersion: m.verification.gameVersion,
    },
  }));
}

export function getMaterialBySlug(slug: string): Material | undefined {
  return materials.find((m: any) => m.slug === slug);
}

export function getMaterialById(id: string): Material | undefined {
  return materials.find((m: any) => m.id === id);
}

export function getMaterialSlugs(): string[] {
  return materials.map((m: any) => m.slug);
}

export function getMaterialCount(): number {
  return materials.length;
}

// ─── Filter & Search ───

export function filterMaterials(
  materialList: Material[],
  filters: MaterialFilters
): Material[] {
  let result = [...materialList];

  if (filters.search.trim()) {
    const query = filters.search.toLowerCase().trim();
    result = result.filter(
      (m: any) =>
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.sources.some((s: any) => s.location.toLowerCase().includes(query))
    );
  }

  if (filters.categories.length > 0) {
    result = result.filter((m: any) => filters.categories.includes(m.category));
  }

  if (filters.rarities.length > 0) {
    result = result.filter((m: any) => filters.rarities.includes(m.rarity));
  }

  if (filters.sources.length > 0) {
    result = result.filter((m: any) =>
      m.sources.some((s: any) => filters.sources.includes(s.type))
    );
  }

  return result;
}

export function filterMaterialSummaries(
  materialList: MaterialSummary[],
  filters: MaterialFilters
): MaterialSummary[] {
  let result = [...materialList];

  if (filters.search.trim()) {
    const query = filters.search.toLowerCase().trim();
    result = result.filter(
      (m: any) =>
        m.name.toLowerCase().includes(query) ||
        m.sources.some((s: any) => s.location.toLowerCase().includes(query))
    );
  }

  if (filters.categories.length > 0) {
    result = result.filter((m: any) => filters.categories.includes(m.category));
  }

  if (filters.rarities.length > 0) {
    result = result.filter((m: any) => filters.rarities.includes(m.rarity));
  }

  if (filters.sources.length > 0) {
    result = result.filter((m: any) =>
      m.sources.some((s: any) => filters.sources.includes(s.type))
    );
  }

  return result;
}

// ─── Relationship Queries ───

export function getMaterialsForCharacter(characterId: string): Material[] {
  return materials.filter((m: any) =>
    m.usedBy.some((u: any) => u.type === "character" && u.id === characterId)
  );
}

export function getMaterialsForWeapon(weaponId: string): Material[] {
  return materials.filter((m: any) =>
    m.usedBy.some((u: any) => u.type === "weapon" && u.id === weaponId)
  );
}

export function getCharactersUsingMaterial(materialId: string): string[] {
  const material = materials.find((m: any) => m.id === materialId);
  if (!material) return [];
  return material.usedBy
    .filter((u: any) => u.type === "character")
    .map((u: any) => u.id);
}

export function getWeeklyMaterials(): Material[] {
  return materials.filter((m: any) => m.isWeekly);
}

export function getDailyMaterials(): Material[] {
  return materials.filter((m: any) => m.isDaily);
}

// ─── Filter Options ───

export function getMaterialFilterOptions() {
  return {
    categories: [...new Set(materials.map((m: any) => m.category))],
    rarities: [...new Set(materials.map((m: any) => m.rarity))],
    sources: [...new Set(materials.flatMap((m: any) => m.sources.map((s: any) => s.type)))],
  };
}
