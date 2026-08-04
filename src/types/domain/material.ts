import { BaseEntity } from "./game";

/**
 * Material domain model.
 * Represents upgrade materials, currencies, and resources in the game.
 * Fully relational with characters, weapons, builds, and planner.
 */

// ─── Material Types ───

export type MaterialCategory =
  | "ascension"
  | "talent"
  | "weapon"
  | "artifact"
  | "currency"
  | "consumable"
  | "special";

export type MaterialRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type MaterialSource =
  | "boss"
  | "domain"
  | "enemy"
  | "quest"
  | "crafting"
  | "shop"
  | "event"
  | "weekly"
  | "daily"
  | "world";

// ─── Material ───

export interface Material {
  id: string;
  slug: string;
  name: string;
  icon: string;
  rarity: MaterialRarity;
  category: MaterialCategory;
  description: string;

  // Source Information
  sources: MaterialSourceInfo[];
  world: string;
  region: string;

  // Respawn & Limits
  respawnTime: string | null; // e.g., "24h", "Weekly Monday", null for unlimited
  isWeekly: boolean;
  isDaily: boolean;
  dailyLimit: number | null;
  weeklyLimit: number | null;

  // Economy
  dropRate: string | null; // e.g., "50%", "Guaranteed", "Rare"
  energyCost: number | null; // Stamina/energy cost to farm
  stackLimit: number;
  sellValue: number | null; // Gold value when sold

  // Relationships
  usedBy: MaterialUsage[];

  // Meta
  verification: {
    source: string;
    gameVersion: string;
    verified: boolean;
    verifiedAt: string;
    lastUpdated: string;
  };
}

export interface MaterialSourceInfo {
  type: MaterialSource;
  location: string;
  bossName?: string;
  domainName?: string;
  enemyType?: string;
  questName?: string;
  coordinates?: { x: number; y: number; z: number };
  mapLink?: string;
  notes?: string;
}

export interface MaterialUsage {
  type: "character" | "weapon" | "build";
  id: string;
  name: string;
  slug: string;
  purpose: string;
  quantity: number;
}

// ─── Material Summary (for list views) ───

export interface MaterialSummary {
  id: string;
  slug: string;
  name: string;
  icon: string;
  rarity: MaterialRarity;
  category: MaterialCategory;
  sources: MaterialSourceInfo[];
  isWeekly: boolean;
  isDaily: boolean;
  verification: {
    verified: boolean;
    gameVersion: string;
  };
}

// ─── Resource Planner Types ───

export interface PlannerGoal {
  id: string;
  type: "character" | "weapon" | "build" | "team";
  targetId: string;
  targetName: string;
  targetSlug: string;
  currentLevel?: number;
  targetLevel?: number;
  priority: "high" | "medium" | "low";
}

export interface PlannerCalculation {
  goal: PlannerGoal;
  materials: RequiredMaterial[];
  totalEnergy: number;
  estimatedDays: number;
  weeklyBosses: WeeklyBossTask[];
  dailyTasks: DailyTask[];
  farmRoute: FarmRouteStep[];
}

export interface RequiredMaterial {
  materialId: string;
  materialName: string;
  materialSlug: string;
  materialIcon: string;
  materialRarity: MaterialRarity;
  required: number;
  owned: number;
  missing: number;
  source: MaterialSource;
  energyPerUnit: number;
  estimatedTime: string;
}

export interface WeeklyBossTask {
  bossName: string;
  materials: string[];
  energyCost: number;
  weeklyLimit: number;
  priority: "critical" | "high" | "medium";
  dayRecommended: string; // e.g., "Monday", "Tuesday"
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  type: "domain" | "boss" | "enemy" | "quest" | "crafting";
  energyCost: number;
  estimatedTime: string;
  materials: string[];
  priority: "critical" | "high" | "medium" | "low";
  completed: boolean;
}

export interface FarmRouteStep {
  order: number;
  location: string;
  activity: string;
  materials: string[];
  energyCost: number;
  estimatedTime: string;
  tips?: string;
}

// ─── Daily Plan ───

export interface DailyPlan {
  date: string;
  tasks: DailyTask[];
  totalEnergy: number;
  estimatedTime: string;
  priorityMaterials: string[];
  aiSuggestions: string[];
  weeklyProgress: WeeklyProgress;
}

export interface WeeklyProgress {
  weekStart: string;
  weekEnd: string;
  bossesCompleted: number;
  bossesRemaining: number;
  domainsCompleted: number;
  domainsRemaining: number;
  totalEnergyUsed: number;
  totalEnergyRemaining: number;
  materialsGained: { materialId: string; materialName: string; quantity: number }[];
}

// ─── Material Filters ───

export interface MaterialFilters {
  categories: MaterialCategory[];
  rarities: MaterialRarity[];
  sources: MaterialSource[];
  search: string;
}

export const defaultMaterialFilters: MaterialFilters = {
  categories: [],
  rarities: [],
  sources: [],
  search: "",
};
