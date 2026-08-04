import type { WeaponSummary } from "@/types/domain";

/**
 * Weapon Mapper — Maps raw data to presentation-ready format.
 * Handles data transformations and computed fields.
 */
export class WeaponMapper {
  static toSummary(raw: WeaponSummary): WeaponSummary {
    return {
      ...raw,
      // Computed display fields can be added here
    };
  }

  static toSummaries(rawList: WeaponSummary[]): WeaponSummary[] {
    return rawList.map((w) => this.toSummary(w));
  }

  static toTierColor(tier: string): string {
    const colors: Record<string, string> = {
      "S+": "#EF4444",
      S: "#F97316",
      "A+": "#EAB308",
      A: "#22C55E",
      "B+": "#3B82F6",
      B: "#6366F1",
      C: "#6B7280",
    };
    return colors[tier] || "#6B7280";
  }

  static toRaritySortValue(rarity: string): number {
    const order: Record<string, number> = { SSR: 4, SR: 3, R: 2, N: 1 };
    return order[rarity] || 0;
  }
}
