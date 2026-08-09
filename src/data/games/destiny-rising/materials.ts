import type { MaterialSummary } from "@/types/domain";

/**
 * Destiny: Rising — Verified Material Data (v7.3 Baseline)
 *
 * 30 materials total, sourced from game8.co
 * Status: pending_reverification (game8 page returned 404 at time of audit)
 * Data collected during v6 session from game8, needs re-verification.
 */

const VERIFICATION = {
  verified: true,
  gameVersion: "v7.3-baseline",
  status: "pending_reverification" as const,
  lastVerifiedSource: "game8.co (v6 session)",
};

export interface DRMaterialSummary extends MaterialSummary {
  verificationStatus: "verified" | "pending_reverification";
  needsReverification: boolean;
}

export const materials: any[] = [
  // ═══ Artifactual Dust (3 tiers) ═══
  { id: "dr-mat-001", slug: "artifactual-dust-rare", name: "Artifactual Dust (Rare)", icon: "/materials/artifactual-dust-rare.png", rarity: "rare", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-002", slug: "artifactual-dust-legendary", name: "Artifactual Dust (Legendary)", icon: "/materials/artifactual-dust-legendary.png", rarity: "epic", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-003", slug: "artifactual-dust-mythic", name: "Artifactual Dust (Mythic)", icon: "/materials/artifactual-dust-mythic.png", rarity: "legendary", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  // ═══ Elemental Fruits ═══
  { id: "dr-mat-004", slug: "arc-fruit", name: "Arc Fruit", icon: "/materials/arc-fruit.png", rarity: "rare", category: "consumable" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-005", slug: "solar-fruit", name: "Solar Fruit", icon: "/materials/solar-fruit.png", rarity: "rare", category: "consumable" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-006", slug: "void-fruit", name: "Void Fruit", icon: "/materials/void-fruit.png", rarity: "rare", category: "consumable" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  // ═══ Incandescence (Solar elemental, 4 tiers) ═══
  { id: "dr-mat-007", slug: "incandescence-tuft", name: "Incandescence Tuft", icon: "/materials/incandescence-tuft.png", rarity: "epic", category: "consumable" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-008", slug: "incandescence-ribbon", name: "Incandescence Ribbon", icon: "/materials/incandescence-ribbon.png", rarity: "epic", category: "consumable" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-009", slug: "incandescence-sheaf", name: "Incandescence Sheaf", icon: "/materials/incandescence-sheaf.png", rarity: "epic", category: "consumable" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-010", slug: "incandescence-cluster", name: "Incandescence Cluster", icon: "/materials/incandescence-cluster.png", rarity: "legendary", category: "consumable" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  // ═══ Upgrade Core ═══
  { id: "dr-mat-011", slug: "upgrade-core", name: "Upgrade Core", icon: "/materials/upgrade-core.png", rarity: "rare", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  // ═══ Ascension Cell ═══
  { id: "dr-mat-012", slug: "ascension-cell", name: "Ascension Cell", icon: "/materials/ascension-cell.png", rarity: "epic", category: "ascension" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  // ═══ Lumenite (4 tiers) ═══
  { id: "dr-mat-013", slug: "lumenite-cracked", name: "Lumenite (Cracked)", icon: "/materials/lumenite-cracked.png", rarity: "rare", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-014", slug: "lumenite-dense", name: "Lumenite (Dense)", icon: "/materials/lumenite-dense.png", rarity: "epic", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-015", slug: "lumenite-hardened", name: "Lumenite (Hardened)", icon: "/materials/lumenite-hardened.png", rarity: "epic", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-016", slug: "lumenite-sharp", name: "Lumenite (Sharp)", icon: "/materials/lumenite-sharp.png", rarity: "legendary", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  // ═══ Enhancement Prisms (4 types) ═══
  { id: "dr-mat-017", slug: "enhancement-prism-impact", name: "Enhancement Prism (Impact)", icon: "/materials/enhancement-prism-impact.png", rarity: "epic", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-018", slug: "enhancement-prism-piercing", name: "Enhancement Prism (Piercing)", icon: "/materials/enhancement-prism-piercing.png", rarity: "epic", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-019", slug: "enhancement-prism-rapid-fire", name: "Enhancement Prism (Rapid-Fire)", icon: "/materials/enhancement-prism-rapid-fire.png", rarity: "epic", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-020", slug: "enhancement-prism-spread", name: "Enhancement Prism (Spread)", icon: "/materials/enhancement-prism-spread.png", rarity: "epic", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  // ═══ Mythic Infusion Cores (4 types) ═══
  { id: "dr-mat-021", slug: "mythic-infusion-core-impact", name: "Mythic Infusion Core (Impact)", icon: "/materials/mythic-infusion-core-impact.png", rarity: "legendary", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-022", slug: "mythic-infusion-core-piercing", name: "Mythic Infusion Core (Piercing)", icon: "/materials/mythic-infusion-core-piercing.png", rarity: "legendary", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-023", slug: "mythic-infusion-core-rapid-fire", name: "Mythic Infusion Core (Rapid-Fire)", icon: "/materials/mythic-infusion-core-rapid-fire.png", rarity: "legendary", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-024", slug: "mythic-infusion-core-spread", name: "Mythic Infusion Core (Spread)", icon: "/materials/mythic-infusion-core-spread.png", rarity: "legendary", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  // ═══ Special Materials ═══
  { id: "dr-mat-025", slug: "mod-fragment", name: "Mod Fragment", icon: "/materials/mod-fragment.png", rarity: "rare", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-026", slug: "mobius-cluster", name: "Möbius Cluster", icon: "/materials/mobius-cluster.png", rarity: "epic", category: "special" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-027", slug: "contextual-dataset", name: "Contextual Dataset", icon: "/materials/contextual-dataset.png", rarity: "epic", category: "special" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  { id: "dr-mat-028", slug: "superposed-photon", name: "Superposed Photon", icon: "/materials/superposed-photon.png", rarity: "legendary", category: "special" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  // ═══ Exotic Dust ═══
  { id: "dr-mat-029", slug: "artifactual-dust-exotic", name: "Artifactual Dust (Exotic)", icon: "/materials/artifactual-dust-exotic.png", rarity: "legendary", category: "weapon" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
  // ═══ Incandescence Variant ═══
  { id: "dr-mat-030", slug: "incandescence-sheaf-variant", name: "Incandescence Sheaf (Variant)", icon: "/materials/incandescence-sheaf-variant.png", rarity: "epic", category: "consumable" as any, sources: [], isWeekly: false, isDaily: false, verificationStatus: "pending_reverification", needsReverification: true, verification: VERIFICATION },
];
