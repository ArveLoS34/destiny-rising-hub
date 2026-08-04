import type { WeaponSummary } from "@/types/domain";
import { weapons } from "@/data/games/destiny-rising/weapons";

/**
 * Weapon Repository — Data access layer.
 * Responsible for fetching raw data from the source.
 */
export class WeaponRepository {
  private data: WeaponSummary[];

  constructor() {
    this.data = weapons;
  }

  findAll(): WeaponSummary[] {
    return [...this.data];
  }

  findBySlug(slug: string): WeaponSummary | undefined {
    return this.data.find((w) => w.slug === slug);
  }

  findById(id: string): WeaponSummary | undefined {
    return this.data.find((w) => w.id === id);
  }

  findManyByIds(ids: string[]): WeaponSummary[] {
    return this.data.filter((w) => ids.includes(w.id));
  }

  getAllSlugs(): string[] {
    return this.data.map((w) => w.slug);
  }

  count(): number {
    return this.data.length;
  }
}

export const weaponRepository = new WeaponRepository();
