import { characters } from "@/data/games/destiny-rising/characters";
import { weapons } from "@/data/games/destiny-rising/weapons";
import { materials } from "@/data/games/destiny-rising/materials";
import type {
  PlannerGoal,
  PlannerCalculation,
  RequiredMaterial,
  WeeklyBossTask,
  DailyTask,
  FarmRouteStep,
  DailyPlan,
  WeeklyProgress,
} from "@/types/domain";

/**
 * Resource Planner Service
 *
 * Calculates material requirements, energy costs, and time estimates
 * for character/weapon/build progression goals.
 *
 * Integrates with AI Advisor for intelligent recommendations.
 */

// ─── Goal Creation ───

export function createCharacterGoal(
  characterId: string,
  currentLevel: number,
  targetLevel: number
): PlannerGoal | null {
  const character = characters.find((c) => c.id === characterId);
  if (!character) return null;

  return {
    id: `goal_${characterId}_${Date.now()}`,
    type: "character",
    targetId: characterId,
    targetName: character.name,
    targetSlug: character.slug,
    currentLevel,
    targetLevel,
    priority: "high",
  };
}

export function createWeaponGoal(
  weaponId: string,
  currentLevel: number,
  targetLevel: number
): PlannerGoal | null {
  const weapon = weapons.find((w) => w.id === weaponId);
  if (!weapon) return null;

  return {
    id: `goal_${weaponId}_${Date.now()}`,
    type: "weapon",
    targetId: weaponId,
    targetName: weapon.name,
    targetSlug: weapon.slug,
    currentLevel,
    targetLevel,
    priority: "medium",
  };
}

// ─── Main Calculation Engine ───

export function calculatePlanner(goal: PlannerGoal): PlannerCalculation {
  const requiredMaterials = calculateRequiredMaterials(goal);
  const weeklyBosses = generateWeeklyBossTasks(requiredMaterials);
  const dailyTasks = generateDailyTasks(requiredMaterials);
  const farmRoute = generateFarmRoute(requiredMaterials);

  const totalEnergy = requiredMaterials.reduce(
    (sum, m) => sum + m.missing * m.energyPerUnit,
    0
  );

  // Estimate days based on daily energy (180 energy/day)
  const dailyEnergy = 180;
  const estimatedDays = Math.ceil(totalEnergy / dailyEnergy);

  return {
    goal,
    materials: requiredMaterials,
    totalEnergy,
    estimatedDays,
    weeklyBosses,
    dailyTasks,
    farmRoute,
  };
}

// ─── Material Requirements Calculator ───

function calculateRequiredMaterials(goal: PlannerGoal): RequiredMaterial[] {
  const required: RequiredMaterial[] = [];

  if (goal.type === "character") {
    // Character ascension materials
    const charMaterials = materials.filter((m) =>
      m.usedBy.some((u) => u.type === "character" && u.id === goal.targetId)
    );

    charMaterials.forEach((mat) => {
      const usage = mat.usedBy.find(
        (u) => u.type === "character" && u.id === goal.targetId
      );
      if (!usage) return;

      // Scale by level difference
      const levelDiff = (goal.targetLevel || 90) - (goal.currentLevel || 1);
      const scaleFactor = levelDiff / 90;
      const requiredQty = Math.ceil(usage.quantity * scaleFactor);

      required.push({
        materialId: mat.id,
        materialName: mat.name,
        materialSlug: mat.slug,
        materialIcon: mat.icon,
        materialRarity: mat.rarity,
        required: requiredQty,
        owned: 0, // User would input this
        missing: requiredQty,
        source: mat.sources[0]?.type || "domain",
        energyPerUnit: mat.energyCost || 20,
        estimatedTime: estimateFarmTime(requiredQty, mat.energyCost || 20),
      });
    });

    // Add gold requirement
    const goldNeeded = (goal.targetLevel || 90) * 50000;
    required.push({
      materialId: "mat-gold",
      materialName: "Gold",
      materialSlug: "gold",
      materialIcon: "/materials/gold.png",
      materialRarity: "common",
      required: goldNeeded,
      owned: 0,
      missing: goldNeeded,
      source: "domain",
      energyPerUnit: 20,
      estimatedTime: estimateFarmTime(goldNeeded / 10000, 20),
    });
  }

  if (goal.type === "weapon") {
    // Weapon enhancement materials
    const oreNeeded = (goal.targetLevel || 90) * 100;
    required.push({
      materialId: "mat-enhancement-ore",
      materialName: "Enhancement Ore",
      materialSlug: "enhancement-ore",
      materialIcon: "/materials/enhancement-ore.png",
      materialRarity: "common",
      required: oreNeeded,
      owned: 0,
      missing: oreNeeded,
      source: "domain",
      energyPerUnit: 20,
      estimatedTime: estimateFarmTime(oreNeeded / 15, 20),
    });

    // Weapon cores for ascension
    const coresNeeded = Math.ceil((goal.targetLevel || 90) / 20);
    required.push({
      materialId: "mat-weapon-core",
      materialName: "Weapon Core",
      materialSlug: "weapon-core",
      materialIcon: "/materials/weapon-core.png",
      materialRarity: "rare",
      required: coresNeeded,
      owned: 0,
      missing: coresNeeded,
      source: "boss",
      energyPerUnit: 60,
      estimatedTime: estimateFarmTime(coresNeeded, 60),
    });

    // Gold
    const goldNeeded = (goal.targetLevel || 90) * 30000;
    required.push({
      materialId: "mat-gold",
      materialName: "Gold",
      materialSlug: "gold",
      materialIcon: "/materials/gold.png",
      materialRarity: "common",
      required: goldNeeded,
      owned: 0,
      missing: goldNeeded,
      source: "domain",
      energyPerUnit: 20,
      estimatedTime: estimateFarmTime(goldNeeded / 10000, 20),
    });
  }

  // Sort by priority (rarity and source difficulty)
  const rarityOrder: Record<string, number> = {
    legendary: 5,
    epic: 4,
    rare: 3,
    uncommon: 2,
    common: 1,
  };

  return required.sort((a, b) => {
    const rarityDiff =
      (rarityOrder[b.materialRarity] || 0) - (rarityOrder[a.materialRarity] || 0);
    if (rarityDiff !== 0) return rarityDiff;

    // Then by source difficulty
    const sourceOrder: Record<string, number> = {
      weekly: 5,
      boss: 4,
      domain: 3,
      enemy: 2,
      shop: 1,
    };
    return (sourceOrder[b.source] || 0) - (sourceOrder[a.source] || 0);
  });
}

// ─── Weekly Boss Task Generator ───

function generateWeeklyBossTasks(
  requiredMaterials: RequiredMaterial[]
): WeeklyBossTask[] {
  const tasks: WeeklyBossTask[] = [];
  const dayOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const weeklyMaterials = requiredMaterials.filter((m) => m.source === "weekly" || m.source === "boss");

  weeklyMaterials.forEach((mat, index) => {
    const materialData = materials.find((m) => m.id === mat.materialId);
    const bossSource = materialData?.sources.find((s) => s.type === "boss" || s.type === "weekly");

    tasks.push({
      bossName: bossSource?.bossName || "Weekly Boss",
      materials: [mat.materialName],
      energyCost: mat.energyPerUnit,
      weeklyLimit: materialData?.weeklyLimit || 1,
      priority: mat.materialRarity === "legendary" || mat.materialRarity === "epic" ? "critical" : "high",
      dayRecommended: dayOfWeek[index % 7],
    });
  });

  return tasks;
}

// ─── Daily Task Generator ───

function generateDailyTasks(requiredMaterials: RequiredMaterial[]): DailyTask[] {
  const tasks: DailyTask[] = [];
  let taskId = 1;

  // Group by source type
  const bySource = requiredMaterials.reduce((acc, mat) => {
    if (!acc[mat.source]) acc[mat.source] = [];
    acc[mat.source].push(mat);
    return acc;
  }, {} as Record<string, RequiredMaterial[]>);

  // Domain tasks
  if (bySource.domain) {
    bySource.domain.forEach((mat) => {
      const runsNeeded = Math.ceil(mat.missing / 3); // Average 3 per run
      tasks.push({
        id: `task_${taskId++}`,
        title: `Farm ${mat.materialName}`,
        description: `Run ${mat.source} domain ${runsNeeded} times`,
        type: "domain",
        energyCost: mat.energyPerUnit * runsNeeded,
        estimatedTime: `${runsNeeded * 3} min`,
        materials: [mat.materialName],
        priority: mat.materialRarity === "rare" ? "high" : "medium",
        completed: false,
      });
    });
  }

  // Boss tasks
  if (bySource.boss) {
    bySource.boss.forEach((mat) => {
      tasks.push({
        id: `task_${taskId++}`,
        title: `Defeat Boss for ${mat.materialName}`,
        description: `Daily boss fight`,
        type: "boss",
        energyCost: mat.energyPerUnit,
        estimatedTime: "5 min",
        materials: [mat.materialName],
        priority: mat.materialRarity === "epic" || mat.materialRarity === "legendary" ? "critical" : "high",
        completed: false,
      });
    });
  }

  // Gold farming
  if (bySource.domain?.some((m) => m.materialId === "mat-gold")) {
    const goldMat = bySource.domain.find((m) => m.materialId === "mat-gold");
    if (goldMat) {
      tasks.push({
        id: `task_${taskId++}`,
        title: "Farm Gold",
        description: "Run Gold domains for currency",
        type: "domain",
        energyCost: 60,
        estimatedTime: "10 min",
        materials: ["Gold"],
        priority: "medium",
        completed: false,
      });
    }
  }

  return tasks;
}

// ─── Farm Route Generator ───

function generateFarmRoute(requiredMaterials: RequiredMaterial[]): FarmRouteStep[] {
  const route: FarmRouteStep[] = [];
  let order = 1;

  // Priority order: Weekly bosses > Rare materials > Common materials
  const sorted = [...requiredMaterials].sort((a, b) => {
    const sourceOrder: Record<string, number> = {
      weekly: 1,
      boss: 2,
      domain: 3,
      enemy: 4,
      shop: 5,
    };
    return (sourceOrder[a.source] || 5) - (sourceOrder[b.source] || 5);
  });

  sorted.forEach((mat) => {
    const materialData = materials.find((m) => m.id === mat.materialId);
    const primarySource = materialData?.sources[0];

    route.push({
      order: order++,
      location: primarySource?.location || "Unknown",
      activity: `Farm ${mat.materialName} x${mat.missing}`,
      materials: [mat.materialName],
      energyCost: mat.energyPerUnit * mat.missing,
      estimatedTime: mat.estimatedTime,
      tips: primarySource?.notes,
    });
  });

  return route;
}

// ─── Daily Plan Generator ───

export function generateDailyPlan(
  goals: PlannerGoal[],
  ownedMaterials: Record<string, number> = {}
): DailyPlan {
  const today = new Date().toISOString().split("T")[0];

  // Calculate all goals
  const calculations = goals.map((goal) => {
    const calc = calculatePlanner(goal);
    // Update owned materials
    calc.materials.forEach((m) => {
      m.owned = ownedMaterials[m.materialId] || 0;
      m.missing = Math.max(0, m.required - m.owned);
    });
    return calc;
  });

  // Merge all daily tasks
  const allTasks = calculations.flatMap((c) => c.dailyTasks);
  const totalEnergy = allTasks.reduce((sum, t) => sum + t.energyCost, 0);
  const estimatedTime = `${Math.ceil(totalEnergy / 20 * 3)} min`;

  // Priority materials
  const priorityMaterials = calculations
    .flatMap((c) => c.materials)
    .filter((m) => m.missing > 0)
    .sort((a, b) => b.missing - a.missing)
    .slice(0, 5)
    .map((m) => m.materialName);

  // AI Suggestions
  const aiSuggestions = generateAISuggestions(calculations, allTasks);

  // Weekly progress
  const weeklyProgress = calculateWeeklyProgress(calculations);

  return {
    date: today,
    tasks: allTasks,
    totalEnergy,
    estimatedTime,
    priorityMaterials,
    aiSuggestions,
    weeklyProgress,
  };
}

// ─── AI Suggestions Generator ───

function generateAISuggestions(
  calculations: PlannerCalculation[],
  tasks: DailyTask[]
): string[] {
  const suggestions: string[] = [];

  // Check if energy is over budget
  const totalEnergy = tasks.reduce((sum, t) => sum + t.energyCost, 0);
  if (totalEnergy > 180) {
    suggestions.push(
      `Today's tasks require ${totalEnergy} energy. Focus on critical tasks first.`
    );
  }

  // Check for weekly boss deadlines
  const criticalBosses = tasks.filter(
    (t) => t.priority === "critical" && t.type === "boss"
  );
  if (criticalBosses.length > 0) {
    suggestions.push(
      `Complete ${criticalBosses.length} weekly boss(es) today before reset.`
    );
  }

  // Material bottleneck detection
  const bottleneck = calculations
    .flatMap((c) => c.materials)
    .filter((m) => m.missing > 50)
    .sort((a, b) => b.missing - a.missing)[0];

  if (bottleneck) {
    suggestions.push(
      `Focus on ${bottleneck.materialName} — you need ${bottleneck.missing} more.`
    );
  }

  // Efficiency suggestion
  const domainTasks = tasks.filter((t) => t.type === "domain");
  if (domainTasks.length > 3) {
    suggestions.push(
      "Multiple domain runs today. Consider using energy refill items."
    );
  }

  // General tips
  suggestions.push("Complete daily quests for bonus energy and materials.");
  suggestions.push("Check event shop for limited-time material exchanges.");

  return suggestions.slice(0, 5);
}

// ─── Weekly Progress Calculator ───

function calculateWeeklyProgress(
  calculations: PlannerCalculation[]
): WeeklyProgress {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const allBosses = calculations.flatMap((c) => c.weeklyBosses);

  return {
    weekStart: weekStart.toISOString().split("T")[0],
    weekEnd: weekEnd.toISOString().split("T")[0],
    bossesCompleted: 0, // User would update this
    bossesRemaining: allBosses.length,
    domainsCompleted: 0,
    domainsRemaining: calculations.reduce(
      (sum, c) => sum + c.dailyTasks.filter((t) => t.type === "domain").length,
      0
    ),
    totalEnergyUsed: 0,
    totalEnergyRemaining: 180 * 7, // Weekly energy budget
    materialsGained: [],
  };
}

// ─── Utility Functions ───

function estimateFarmTime(quantity: number, energyPerUnit: number): string {
  const runsNeeded = Math.ceil(quantity);
  const minutesPerRun = 3; // Average domain/boss run time
  const totalMinutes = runsNeeded * minutesPerRun;

  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
