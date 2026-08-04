/**
 * Combat Intelligence domain types.
 * Types for damage calculation, combat simulation, and optimization.
 */

// ─── Combat Stats ───

export interface CombatStats {
  // Base Stats
  hp: number;
  atk: number;
  def: number;

  // Derived Stats
  critRate: number; // 0-1
  critDamage: number; // Multiplier (e.g., 1.5 = 150%)
  elementalMastery: number;
  energyRecharge: number; // Percentage (e.g., 1.2 = 120%)

  // Damage Bonuses
  fireDamageBonus: number;
  iceDamageBonus: number;
  lightningDamageBonus: number;
  windDamageBonus: number;
  earthDamageBonus: number;
  darkDamageBonus: number;
  lightDamageBonus: number;
  physicalDamageBonus: number;
  healingBonus: number;

  // Enemy Interaction
  enemyDef: number;
  enemyResistance: number; // 0-1 (0 = no resistance, 1 = immune)
  enemyLevel: number;
}

// ─── Damage Calculation ───

export interface DamageCalculationInput {
  // Character
  characterId: string;
  characterLevel: number;
  characterStats: CombatStats;

  // Weapon
  weaponId: string;
  weaponLevel: number;
  weaponRefinement: number;

  // Artifacts
  artifactSet2pc?: string;
  artifactSet4pc?: string;
  artifactMainStats: {
    sands: string;
    goblet: string;
    crown: string;
  };
  artifactSubStats: {
    critRate: number;
    critDamage: number;
    atkPercent: number;
    elementalMastery: number;
    energyRecharge: number;
  };

  // Team Buffs
  teamBuffs: TeamBuff[];

  // Enemy
  enemyLevel: number;
  enemyDef: number;
  enemyResistance: number;
  enemyElement?: string;

  // Skill
  skillType: "basic" | "skill" | "ultimate";
  skillMultiplier: number;
  skillElement: string;
}

export interface TeamBuff {
  source: string; // Character or ability name
  type: "atk" | "crit" | "damage" | "resistance" | "def";
  value: number;
  duration: number;
  description: string;
}

export interface DamageCalculationResult {
  // Base Damage
  baseDamage: number;
  critDamage: number;
  expectedDamage: number;

  // Multipliers
  damageMultiplier: number;
  critMultiplier: number;
  resistanceMultiplier: number;
  defenseMultiplier: number;

  // Breakdown
  statBreakdown: {
    atk: number;
    skillMultiplier: number;
    damageBonus: number;
    critRate: number;
    critDamage: number;
    enemyDef: number;
    enemyRes: number;
  };

  // DPS Metrics
  singleHitDps: number;
  burstWindowDps: number;
  sustainedDps: number;
  rotationDps: number;

  // Time Metrics
  skillCooldown: number;
  ultimateCooldown: number;
  burstWindow: number;
}

// ─── Combat Timeline ───

export interface CombatTimeline {
  events: TimelineEvent[];
  totalDuration: number;
  totalDamage: number;
  averageDps: number;
}

export interface TimelineEvent {
  timestamp: number;
  type: "basic" | "skill" | "ultimate" | "buff" | "debuff" | "swap";
  source: string;
  target: string;
  damage?: number;
  duration?: number;
  description: string;
}

// ─── Rotation Optimizer ───

export interface RotationInput {
  characterId: string;
  skillOrder: string[]; // Skill IDs in order
  weaveBasicAttacks: boolean;
  optimizeFor: "burst" | "sustained" | "aoe";
}

export interface RotationOptimization {
  originalRotation: string[];
  optimizedRotation: string[];
  originalDps: number;
  optimizedDps: number;
  improvement: number; // Percentage
  reasoning: string[];
}

// ─── Artifact Optimizer ───

export interface ArtifactOptimizerInput {
  characterId: string;
  availableArtifacts: string[]; // Artifact IDs
  optimizationGoal: "damage" | "survivability" | "support" | "balanced";
}

export interface ArtifactOptimization {
  recommendedSet: string;
  recommendedMainStats: {
    sands: string;
    goblet: string;
    crown: string;
  };
  recommendedSubStats: {
    priority: string[];
    targetValues: Record<string, number>;
  };
  reasoning: string[];
  estimatedDamageGain: number; // Percentage
}

// ─── Stat Optimizer ───

export interface StatOptimizerInput {
  currentStats: CombatStats;
  availableUpgrades: StatUpgrade[];
  optimizationGoal: "damage" | "survivability" | "support";
}

export interface StatUpgrade {
  stat: keyof CombatStats;
  currentValue: number;
  potentialValue: number;
  cost: number; // Resource cost
  source: string;
}

export interface StatOptimization {
  currentStats: CombatStats;
  recommendedStats: CombatStats;
  upgrades: StatUpgrade[];
  totalImprovement: number; // Percentage
  reasoning: string[];
  priority: StatUpgrade[];
}

// ─── Build Score v2 ───

export interface BuildScoreV2 {
  overall: number;
  subscores: {
    damage: number;
    consistency: number;
    accessibility: number;
    survivability: number;
    energy: number;
    rotation: number;
    artifactQuality: number;
    weaponEfficiency: number;
    teamSynergy: number;
    futureScaling: number;
  };
  weights: Record<keyof BuildScoreV2["subscores"], number>;
  reasoning: string[];
}

// ─── Explainable AI ───

export interface AIRecommendation {
  id: string;
  type: "build" | "weapon" | "artifact" | "team" | "rotation" | "stat";
  title: string;
  description: string;
  confidence: number; // 0-1
  impact: "high" | "medium" | "low";
  reasoning: string[];
  alternatives: string[];
  estimatedGain?: string; // e.g., "+12% DPS"
  dataPoints: Record<string, number | string>;
}

// ─── Build Sandbox ───

export interface SandboxState {
  characterId: string;
  weaponId: string;
  artifactSetId: string;
  artifactMainStats: {
    sands: string;
    goblet: string;
    crown: string;
  };
  artifactSubStats: {
    critRate: number;
    critDamage: number;
    atkPercent: number;
    elementalMastery: number;
    energyRecharge: number;
  };
  teamComposition: string[]; // Character IDs
  enemyType: string;
  enemyLevel: number;
}

export interface SandboxResult {
  stats: CombatStats;
  damageCalculation: DamageCalculationResult;
  buildScore: BuildScoreV2;
  recommendations: AIRecommendation[];
}

// ─── Prediction Engine ───

export interface PredictionInput {
  currentBuild: SandboxState;
  changes: Partial<SandboxState>;
}

export interface PredictionResult {
  statChanges: Partial<Record<keyof CombatStats, { before: number; after: number; change: number }>>;
  damageChange: { before: number; after: number; percentage: number };
  buildScoreChange: { before: number; after: number; change: number };
  estimatedFarmTime: { before: string; after: string };
  confidence: number;
  reasoning: string[];
}

// ─── Comparison ───

export interface ComparisonInput {
  items: { id: string; name: string; type: string }[];
  comparisonType: "build" | "weapon" | "artifact" | "character" | "team";
}

export interface ComparisonResult {
  items: { id: string; name: string; stats: Record<string, number> }[];
  winner: string;
  differences: { category: string; values: Record<string, number>; winner: string }[];
  reasoning: string[];
}
