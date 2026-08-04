import type { CombatTimeline, TimelineEvent } from "@/types/domain";

/**
 * Combat Timeline — Visual Combat Simulation
 * 
 * Creates a visual timeline of combat actions.
 * Shows damage windows, buff applications, and rotation flow.
 */

export interface CombatTimelineInput {
  characterId: string;
  weaponId: string;
  rotation: string[]; // Skill IDs in order
  teamBuffIds?: string[];
}

export function generateCombatTimeline(input: CombatTimelineInput): CombatTimeline {
  const events: TimelineEvent[] = [];
  let currentTime = 0;

  // Generate timeline events based on rotation
  input.rotation.forEach((skillId, index) => {
    const event = createTimelineEvent(skillId, currentTime, index);
    events.push(event);
    currentTime += event.duration || 1.5;
  });

  // Add team buffs
  if (input.teamBuffIds) {
    input.teamBuffIds.forEach((buffId, index) => {
      const buffTime = index * 2; // Buffs every 2 seconds
      events.push({
        timestamp: buffTime,
        type: "buff",
        source: "Team Support",
        target: "Party",
        duration: 12,
        description: getBuffDescription(buffId),
      });
    });
  }

  // Sort events by timestamp
  events.sort((a, b) => a.timestamp - b.timestamp);

  // Calculate total damage and DPS
  const totalDamage = events.reduce((sum, e) => sum + (e.damage || 0), 0);
  const totalDuration = events[events.length - 1]?.timestamp || 10;
  const averageDps = totalDamage / totalDuration;

  return {
    events,
    totalDuration,
    totalDamage,
    averageDps,
  };
}

function createTimelineEvent(skillId: string, timestamp: number, index: number): TimelineEvent {
  const skillData = getSkillData(skillId);

  return {
    timestamp,
    type: skillData.type,
    source: skillData.character,
    target: "Enemy",
    damage: skillData.damage,
    duration: skillData.duration,
    description: skillData.description,
  };
}

interface SkillData {
  type: "basic" | "skill" | "ultimate";
  character: string;
  damage: number;
  duration: number;
  description: string;
}

function getSkillData(skillId: string): SkillData {
  // Mock skill data - in production, fetch from character data
  const skills: Record<string, SkillData> = {
    "nova-basic": {
      type: "basic",
      character: "Nova",
      damage: 5000,
      duration: 1.5,
      description: "Stellar Slash - 3-hit combo",
    },
    "nova-skill": {
      type: "skill",
      character: "Nova",
      damage: 25000,
      duration: 2.0,
      description: "Supernova Strike - AoE burst",
    },
    "nova-ult": {
      type: "ultimate",
      character: "Nova",
      damage: 80000,
      duration: 3.5,
      description: "Cosmic Annihilation - Ultimate burst",
    },
    "aurora-skill": {
      type: "skill",
      character: "Aurora",
      damage: 15000,
      duration: 1.8,
      description: "Glacial Barrier - Shield + Freeze",
    },
    "sage-skill": {
      type: "skill",
      character: "Sage",
      damage: 12000,
      duration: 1.5,
      description: "Verdant Heal - Team heal",
    },
  };

  return skills[skillId] || {
    type: "basic",
    character: "Unknown",
    damage: 3000,
    duration: 1.5,
    description: "Basic attack",
  };
}

function getBuffDescription(buffId: string): string {
  const buffs: Record<string, string> = {
    "atk-buff": "ATK +25% for 12s",
    "crit-buff": "Crit Rate +15% for 10s",
    "heal-buff": "Healing +30% for 15s",
    "shield-buff": "Shield +40% for 12s",
  };

  return buffs[buffId] || "Unknown buff effect";
}

/**
 * Optimize rotation for maximum DPS
 */
export function optimizeRotation(
  currentRotation: string[],
  characterId: string
): { optimized: string[]; improvement: number; reasoning: string[] } {
  const reasoning: string[] = [];
  const optimized = [...currentRotation];

  // Simple optimization: ensure ultimates are used efficiently
  const hasUltimate = currentRotation.some((s) => s.includes("ult"));
  if (!hasUltimate && currentRotation.length > 3) {
    // Add ultimate at optimal position
    const ultSkill = `${characterId.split("-")[1]}-ult`;
    optimized.splice(2, 0, ultSkill);
    reasoning.push("Added ultimate at optimal position for burst window.");
  }

  // Ensure skills are not repeated unnecessarily
  const uniqueSkills = new Set(optimized);
  if (uniqueSkills.size < optimized.length) {
    reasoning.push("Removed duplicate skills for better rotation efficiency.");
  }

  // Calculate improvement (mock calculation)
  const improvement = optimized.length > currentRotation.length ? 15 : 8;

  return {
    optimized: [...new Set(optimized)], // Remove duplicates
    improvement,
    reasoning,
  };
}
