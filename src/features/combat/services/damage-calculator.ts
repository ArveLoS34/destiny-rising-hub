import { charactersDetail } from "@/data/games/destiny-rising/characters-detail";
import { weapons } from "@/data/games/destiny-rising/weapons";
import { artifactSets } from "@/data/games/destiny-rising/artifacts";
import type {
  DamageCalculationInput,
  DamageCalculationResult,
  CombatStats,
  TeamBuff,
} from "@/types/domain";

/**
 * Damage Calculator Engine v1
 *
 * Calculates damage based on character stats, weapon, artifacts, team buffs, and enemy properties.
 * Uses standard RPG damage formulas with elemental reaction multipliers.
 */

// ─── Base Damage Formula ───
// Damage = (ATK × Skill Multiplier) × Damage Bonus × Crit Multiplier × Enemy DEF Multiplier × Enemy RES Multiplier

export function calculateDamage(input: DamageCalculationInput): DamageCalculationResult {
  const character = charactersDetail.find((c) => c.id === input.characterId);
  const weapon = weapons.find((w) => w.id === input.weaponId);

  if (!character || !weapon) {
    return createEmptyResult();
  }

  // Calculate final stats with all bonuses
  const finalStats = calculateFinalStats(input, character);

  // Base damage calculation
  const baseDamage = finalStats.atk * input.skillMultiplier;

  // Apply damage bonuses
  const damageBonusMultiplier = calculateDamageBonus(input.skillElement, finalStats);
  const damageWithBonus = baseDamage * damageBonusMultiplier;

  // Crit calculation
  const critMultiplier = 1 + finalStats.critRate * (finalStats.critDamage - 1);
  const critDamage = damageWithBonus * critMultiplier;
  const expectedDamage = damageWithBonus * (1 + finalStats.critRate * (finalStats.critDamage - 1));

  // Enemy multipliers
  const defenseMultiplier = calculateDefenseMultiplier(input.characterLevel, input.enemyLevel, input.enemyDef);
  const resistanceMultiplier = calculateResistanceMultiplier(input.skillElement, input.enemyResistance);

  // Final damage
  const finalDamage = expectedDamage * defenseMultiplier * resistanceMultiplier;

  // DPS calculations
  const singleHitDps = finalDamage;
  const burstWindowDps = calculateBurstDps(input, finalDamage);
  const sustainedDps = calculateSustainedDps(input, finalDamage);
  const rotationDps = calculateRotationDps(input, finalDamage);

  return {
    baseDamage: Math.round(baseDamage),
    critDamage: Math.round(critDamage),
    expectedDamage: Math.round(finalDamage),
    damageMultiplier: damageBonusMultiplier,
    critMultiplier,
    resistanceMultiplier,
    defenseMultiplier,
    statBreakdown: {
      atk: Math.round(finalStats.atk),
      skillMultiplier: input.skillMultiplier,
      damageBonus: damageBonusMultiplier - 1,
      critRate: finalStats.critRate,
      critDamage: finalStats.critDamage,
      enemyDef: input.enemyDef,
      enemyRes: input.enemyResistance,
    },
    singleHitDps: Math.round(singleHitDps),
    burstWindowDps: Math.round(burstWindowDps),
    sustainedDps: Math.round(sustainedDps),
    rotationDps: Math.round(rotationDps),
    skillCooldown: getSkillCooldown(input.skillType),
    ultimateCooldown: getUltimateCooldown(),
    burstWindow: getBurstWindow(input.characterId),
  };
}

// ─── Final Stats Calculation ───

function calculateFinalStats(input: DamageCalculationInput, character: typeof charactersDetail[0]): CombatStats {
  const weapon = weapons.find((w) => w.id === input.weaponId);

  if (!weapon) {
    return getDefaultStats();
  }

  // Base stats from character level
  const levelMultiplier = input.characterLevel / 90;
  let atk = character.stats.baseATK * levelMultiplier;
  let critRate = character.stats.baseCR;
  let critDamage = character.stats.baseCD;
  let elementalMastery = 0;
  let energyRecharge = 1.0;

  // Weapon ATK
  const weaponAtkMultiplier = input.weaponLevel / 90;
  atk += weapon.stats.baseATK * weaponAtkMultiplier;

  // Artifact main stats
  const sandsBonus = input.artifactMainStats.sands === "ATK%" ? 0.466 : 0;
  const gobletBonus = getElementDamageBonus(input.artifactMainStats.goblet);
  const crownBonus = input.artifactMainStats.crown === "Crit Rate%" ? 0.311 :
                     input.artifactMainStats.crown === "Crit Damage%" ? 0.622 : 0;

  // Apply ATK% from sands
  atk *= (1 + sandsBonus);

  // Apply artifact sub stats
  atk *= (1 + input.artifactSubStats.atkPercent / 100);
  critRate += input.artifactSubStats.critRate / 100;
  critDamage += input.artifactSubStats.critDamage / 100;
  elementalMastery += input.artifactSubStats.elementalMastery;
  energyRecharge += input.artifactSubStats.energyRecharge / 100;

  // Apply crown stat
  critRate += crownBonus;

  // Apply 2pc set bonus
  if (input.artifactSet2pc) {
    const set = artifactSets.find((s) => s.id === input.artifactSet2pc);
    if (set) {
      if (set.bonuses["2pc"].includes("ATK")) {
        atk *= 1.18; // +18% ATK
      }
    }
  }

  // Apply 4pc set bonus (simplified)
  if (input.artifactSet4pc) {
    const set = artifactSets.find((s) => s.id === input.artifactSet4pc);
    if (set) {
      if (set.id === "set-berserker") {
        critRate += 0.12; // +12% Crit Rate
      }
    }
  }

  // Apply team buffs
  input.teamBuffs.forEach((buff) => {
    switch (buff.type) {
      case "atk":
        atk *= (1 + buff.value / 100);
        break;
      case "crit":
        critRate += buff.value / 100;
        break;
      case "damage":
        // Handled in damage bonus calculation
        break;
    }
  });

  // Elemental mastery bonus (simplified)
  const emBonus = elementalMastery * 0.001; // 0.1% damage per EM
  atk *= (1 + emBonus);

  return {
    hp: character.stats.baseHP * levelMultiplier,
    atk,
    def: character.stats.baseDEF * levelMultiplier,
    critRate: Math.min(critRate, 1),
    critDamage,
    elementalMastery,
    energyRecharge,
    fireDamageBonus: input.skillElement === "Fire" ? gobletBonus : 0,
    iceDamageBonus: input.skillElement === "Ice" ? gobletBonus : 0,
    lightningDamageBonus: input.skillElement === "Lightning" ? gobletBonus : 0,
    windDamageBonus: input.skillElement === "Wind" ? gobletBonus : 0,
    earthDamageBonus: input.skillElement === "Earth" ? gobletBonus : 0,
    darkDamageBonus: input.skillElement === "Dark" ? gobletBonus : 0,
    lightDamageBonus: input.skillElement === "Light" ? gobletBonus : 0,
    physicalDamageBonus: input.skillElement === "Physical" ? gobletBonus : 0,
    healingBonus: 0,
    enemyDef: input.enemyDef,
    enemyResistance: input.enemyResistance,
    enemyLevel: input.enemyLevel,
  };
}

// ─── Damage Bonus Calculation ───

function calculateDamageBonus(element: string, stats: CombatStats): number {
  let bonus = 1.0;

  switch (element) {
    case "Fire":
      bonus += stats.fireDamageBonus;
      break;
    case "Ice":
      bonus += stats.iceDamageBonus;
      break;
    case "Lightning":
      bonus += stats.lightningDamageBonus;
      break;
    case "Wind":
      bonus += stats.windDamageBonus;
      break;
    case "Earth":
      bonus += stats.earthDamageBonus;
      break;
    case "Dark":
      bonus += stats.darkDamageBonus;
      break;
    case "Light":
      bonus += stats.lightDamageBonus;
      break;
    case "Physical":
      bonus += stats.physicalDamageBonus;
      break;
  }

  return bonus;
}

function getElementDamageBonus(mainStat: string): number {
  if (mainStat.includes("Damage Bonus%")) {
    return 0.466; // 46.6%
  }
  return 0;
}

// ─── Enemy Multipliers ───

function calculateDefenseMultiplier(charLevel: number, enemyLevel: number, enemyDef: number): number {
  // DEF multiplier formula: (charLevel + 100) / ((charLevel + 100) + enemyDef * (1 - DEF reduction))
  // Simplified: assume no DEF reduction for now
  const effectiveDef = enemyDef * (1 - 0); // No DEF reduction
  return (charLevel + 100) / ((charLevel + 100) + effectiveDef);
}

function calculateResistanceMultiplier(element: string, resistance: number): number {
  // RES multiplier formula
  if (resistance < 0) {
    return 1 - resistance / 2;
  } else if (resistance < 0.75) {
    return 1 - resistance;
  } else {
    return 1 / (4 * resistance + 1);
  }
}

// ─── DPS Calculations ───

function calculateBurstDps(input: DamageCalculationInput, damage: number): number {
  // Burst window: 10 seconds of maximum DPS
  const burstMultiplier = input.skillType === "ultimate" ? 2.0 : 1.0;
  return damage * burstMultiplier / 10;
}

function calculateSustainedDps(input: DamageCalculationInput, damage: number): number {
  // Sustained: average DPS over extended fight
  const cooldown = getSkillCooldown(input.skillType);
  const attacksPerMinute = 60 / cooldown;
  return damage * attacksPerMinute / 60;
}

function calculateRotationDps(input: DamageCalculationInput, damage: number): number {
  // Rotation: DPS based on optimal skill rotation
  const rotationTime = getBurstWindow(input.characterId);
  return damage * 3 / rotationTime; // Assume 3 skills in rotation
}

// ─── Utility Functions ───

function getSkillCooldown(skillType: string): number {
  switch (skillType) {
    case "basic":
      return 1.5;
    case "skill":
      return 8;
    case "ultimate":
      return 15;
    default:
      return 5;
  }
}

function getUltimateCooldown(): number {
  return 15;
}

function getBurstWindow(characterId: string): number {
  // Burst window varies by character
  return 8; // Default 8 second burst window
}

function getDefaultStats(): CombatStats {
  return {
    hp: 15000,
    atk: 1000,
    def: 500,
    critRate: 0.05,
    critDamage: 1.5,
    elementalMastery: 0,
    energyRecharge: 1.0,
    fireDamageBonus: 0,
    iceDamageBonus: 0,
    lightningDamageBonus: 0,
    windDamageBonus: 0,
    earthDamageBonus: 0,
    darkDamageBonus: 0,
    lightDamageBonus: 0,
    physicalDamageBonus: 0,
    healingBonus: 0,
    enemyDef: 500,
    enemyResistance: 0.1,
    enemyLevel: 90,
  };
}

function createEmptyResult(): DamageCalculationResult {
  return {
    baseDamage: 0,
    critDamage: 0,
    expectedDamage: 0,
    damageMultiplier: 1,
    critMultiplier: 1,
    resistanceMultiplier: 1,
    defenseMultiplier: 1,
    statBreakdown: {
      atk: 0,
      skillMultiplier: 0,
      damageBonus: 0,
      critRate: 0,
      critDamage: 0,
      enemyDef: 0,
      enemyRes: 0,
    },
    singleHitDps: 0,
    burstWindowDps: 0,
    sustainedDps: 0,
    rotationDps: 0,
    skillCooldown: 0,
    ultimateCooldown: 0,
    burstWindow: 0,
  };
}
