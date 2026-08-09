import type { Character } from "@/types/domain";

/**
 * Destiny: Rising — Detailed Character Data
 *
 * PLACEHOLDER — No verified detailed data available yet.
 *
 * This file will be populated with verified character details
 * (abilities, stats, talents, materials, lore) as they are
 * confirmed from official and reliable sources.
 *
 * As of 2026-08-09: No detailed character data has been
 * verified to the standard required for this database.
 *
 * Source requirements:
 * - Official playdestinyrising.com character pages
 * - Official patch notes with ability details
 * - In-game verified data from multiple community members
 *
 * UNCONFIRMED DATA WILL NOT BE ADDED.
 */

export const charactersDetail: Character[] = [];

export function getCharacterBySlug(slug: string): Character | undefined {
  return charactersDetail.find((c) => c.slug === slug);
}

export function getCharacterById(id: string): Character | undefined {
  return charactersDetail.find((c) => c.id === id);
}
