"use client";

import { useState, useMemo } from "react";
import { Typography } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { characters } from "@/data/games/destiny-rising/characters";
import { weapons } from "@/data/games/destiny-rising/weapons";
import { artifactSets } from "@/data/games/destiny-rising/artifacts";
import { calculateDamage } from "@/features/combat/services/damage-calculator";
import {
  getOptimalArtifactSet,
  getOptimalMainStats,
  getOptimalSubStats,
} from "@/features/artifacts/services/artifact-service";
import type { DamageCalculationInput, TeamBuff } from "@/types/domain";
import {
  Sword,
  Shield,
  Zap,
  Target,
  Brain,
  TrendingUp,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function CombatLabClient() {
  const [characterId, setCharacterId] = useState("dr-char-001");
  const [weaponId, setWeaponId] = useState("dr-weap-001");
  const [characterLevel, setCharacterLevel] = useState(90);
  const [weaponLevel, setWeaponLevel] = useState(90);
  const [artifactSet2pc, setArtifactSet2pc] = useState("set-inferno");
  const [artifactSet4pc, setArtifactSet4pc] = useState("set-inferno");
  const [sandsMainStat, setSandsMainStat] = useState("ATK%");
  const [gobletMainStat, setGobletMainStat] = useState("Fire Damage Bonus%");
  const [crownMainStat, setCrownMainStat] = useState("Crit Rate%");
  const [critRateSub, setCritRateSub] = useState(20);
  const [critDamageSub, setCritDamageSub] = useState(40);
  const [atkPercentSub, setAtkPercentSub] = useState(30);
  const [enemyLevel, setEnemyLevel] = useState(90);
  const [enemyDef, setEnemyDef] = useState(500);
  const [enemyResistance, setEnemyResistance] = useState(10);
  const [skillType, setSkillType] = useState<"basic" | "skill" | "ultimate">("skill");
  const [skillMultiplier, setSkillMultiplier] = useState(3.5);

  // Calculate damage
  const damageResult = useMemo(() => {
    const input: DamageCalculationInput = {
      characterId,
      characterLevel,
      characterStats: {} as any,
      weaponId,
      weaponLevel,
      weaponRefinement: 1,
      artifactSet2pc,
      artifactSet4pc,
      artifactMainStats: {
        sands: sandsMainStat,
        goblet: gobletMainStat,
        crown: crownMainStat,
      },
      artifactSubStats: {
        critRate: critRateSub,
        critDamage: critDamageSub,
        atkPercent: atkPercentSub,
        elementalMastery: 0,
        energyRecharge: 0,
      },
      teamBuffs: [],
      enemyLevel,
      enemyDef,
      enemyResistance: enemyResistance / 100,
      skillType,
      skillMultiplier,
      skillElement: "Fire",
    };

    return calculateDamage(input);
  }, [
    characterId,
    weaponId,
    characterLevel,
    weaponLevel,
    artifactSet2pc,
    artifactSet4pc,
    sandsMainStat,
    gobletMainStat,
    crownMainStat,
    critRateSub,
    critDamageSub,
    atkPercentSub,
    enemyLevel,
    enemyDef,
    enemyResistance,
    skillType,
    skillMultiplier,
  ]);

  // Get artifact recommendations
  const artifactRecommendation = useMemo(() => {
    const optimalSet = getOptimalArtifactSet(characterId, "damage");
    const optimalSands = getOptimalMainStats(optimalSet, "sands", "damage");
    const optimalGoblet = getOptimalMainStats(optimalSet, "goblet", "damage");
    const optimalCrown = getOptimalMainStats(optimalSet, "crown", "damage");
    const optimalSubs = getOptimalSubStats("damage");

    return {
      set: optimalSet,
      sands: optimalSands,
      goblet: optimalGoblet,
      crown: optimalCrown,
      subs: optimalSubs,
    };
  }, [characterId]);

  // Generate AI recommendations
  const aiRecommendations = useMemo(() => {
    const recommendations: string[] = [];

    if (damageResult.statBreakdown.critRate < 0.5) {
      recommendations.push("Crit Rate is below 50%. Consider Crit Rate% artifacts or weapons.");
    }

    if (damageResult.statBreakdown.critDamage < 1.5) {
      recommendations.push("Crit Damage is low. Aim for at least 150% crit damage.");
    }

    if (artifactSet2pc !== artifactRecommendation.set) {
      recommendations.push(`Consider using ${artifactSets.find(s => s.id === artifactRecommendation.set)?.name || "optimal"} set for better performance.`);
    }

    if (sandsMainStat !== artifactRecommendation.sands) {
      recommendations.push(`Change Sands main stat to ${artifactRecommendation.sands} for optimal damage.`);
    }

    if (recommendations.length === 0) {
      recommendations.push("Your build is well optimized! Great job!");
    }

    return recommendations;
  }, [damageResult, artifactRecommendation, artifactSet2pc, sandsMainStat]);

  const selectedCharacter = characters.find((c) => c.id === characterId);
  const selectedWeapon = weapons.find((w) => w.id === weaponId);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator">
        <TabsList className="mb-6">
          <TabsTrigger value="calculator">
            <Sword className="h-4 w-4 mr-2" />
            Damage Calculator
          </TabsTrigger>
          <TabsTrigger value="sandbox">
            <Zap className="h-4 w-4 mr-2" />
            Build Sandbox
          </TabsTrigger>
          <TabsTrigger value="optimizer">
            <Target className="h-4 w-4 mr-2" />
            Artifact Optimizer
          </TabsTrigger>
          <TabsTrigger value="advisor">
            <Brain className="h-4 w-4 mr-2" />
            AI Advisor v2
          </TabsTrigger>
        </TabsList>

        {/* Damage Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <Card className="lg:col-span-2">
              <div className="p-4 space-y-4">
                <Typography variant="h3">Configuration</Typography>

                {/* Character & Weapon */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Typography variant="bodySm" weight="medium">Character</Typography>
                    <select
                      value={characterId}
                      onChange={(e) => setCharacterId(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                    >
                      {characters.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Typography variant="bodySm" weight="medium">Weapon</Typography>
                    <select
                      value={weaponId}
                      onChange={(e) => setWeaponId(e.target.value)}
                      className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                    >
                      {weapons.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Levels */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Typography variant="bodySm" weight="medium">Character Level</Typography>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={characterLevel}
                      onChange={(e) => setCharacterLevel(Number(e.target.value))}
                      className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Typography variant="bodySm" weight="medium">Weapon Level</Typography>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={weaponLevel}
                      onChange={(e) => setWeaponLevel(Number(e.target.value))}
                      className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                    />
                  </div>
                </div>

                {/* Skill */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Typography variant="bodySm" weight="medium">Skill Type</Typography>
                    <select
                      value={skillType}
                      onChange={(e) => setSkillType(e.target.value as "basic" | "skill" | "ultimate")}
                      className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                    >
                      <option value="basic">Basic Attack</option>
                      <option value="skill">Skill</option>
                      <option value="ultimate">Ultimate</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Typography variant="bodySm" weight="medium">Skill Multiplier</Typography>
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      value={skillMultiplier}
                      onChange={(e) => setSkillMultiplier(Number(e.target.value))}
                      className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                    />
                  </div>
                </div>

                {/* Enemy */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Typography variant="bodySm" weight="medium">Enemy Level</Typography>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={enemyLevel}
                      onChange={(e) => setEnemyLevel(Number(e.target.value))}
                      className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Typography variant="bodySm" weight="medium">Enemy DEF</Typography>
                    <input
                      type="number"
                      min={0}
                      value={enemyDef}
                      onChange={(e) => setEnemyDef(Number(e.target.value))}
                      className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Typography variant="bodySm" weight="medium">Enemy RES %</Typography>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={enemyResistance}
                      onChange={(e) => setEnemyResistance(Number(e.target.value))}
                      className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Results Panel */}
            <Card>
              <div className="p-4 space-y-4">
                <Typography variant="h3">Damage Results</Typography>

                {/* Main Damage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography variant="bodySm" textColor="secondary">Expected Damage</Typography>
                    <Typography variant="h2" className="text-[rgb(var(--color-primary))]">
                      {damageResult.expectedDamage.toLocaleString()}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="bodySm" textColor="secondary">Crit Damage</Typography>
                    <Typography variant="body" weight="semibold">
                      {damageResult.critDamage.toLocaleString()}
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="bodySm" textColor="secondary">Base Damage</Typography>
                    <Typography variant="bodySm" textColor="secondary">
                      {damageResult.baseDamage.toLocaleString()}
                    </Typography>
                  </div>
                </div>

                {/* DPS Metrics */}
                <div className="pt-4 border-t border-[rgb(var(--color-border))] space-y-3">
                  <Typography variant="bodySm" weight="semibold">DPS Metrics</Typography>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Typography variant="caption" textColor="secondary">Rotation DPS</Typography>
                      <Typography variant="bodySm" weight="medium">
                        {damageResult.rotationDps.toLocaleString()}
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between">
                      <Typography variant="caption" textColor="secondary">Burst DPS</Typography>
                      <Typography variant="bodySm" weight="medium">
                        {damageResult.burstWindowDps.toLocaleString()}
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between">
                      <Typography variant="caption" textColor="secondary">Sustained DPS</Typography>
                      <Typography variant="bodySm" weight="medium">
                        {damageResult.sustainedDps.toLocaleString()}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Multipliers */}
                <div className="pt-4 border-t border-[rgb(var(--color-border))] space-y-2">
                  <Typography variant="bodySm" weight="semibold">Multipliers</Typography>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <Typography variant="caption" textColor="tertiary">Damage Bonus</Typography>
                      <Typography variant="caption">
                        +{((damageResult.damageMultiplier - 1) * 100).toFixed(1)}%
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <Typography variant="caption" textColor="tertiary">Crit Multiplier</Typography>
                      <Typography variant="caption">
                        ×{damageResult.critMultiplier.toFixed(2)}
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <Typography variant="caption" textColor="tertiary">DEF Reduction</Typography>
                      <Typography variant="caption">
                        {(damageResult.defenseMultiplier * 100).toFixed(1)}%
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <Typography variant="caption" textColor="tertiary">RES Reduction</Typography>
                      <Typography variant="caption">
                        {(damageResult.resistanceMultiplier * 100).toFixed(1)}%
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Build Sandbox Tab */}
        <TabsContent value="sandbox">
          <Card>
            <div className="p-4 space-y-4">
              <Typography variant="h3">Build Sandbox</Typography>
              <Typography variant="body" textColor="secondary">
                Real-time build optimization. Change artifacts, stats, and see results instantly.
              </Typography>

              {/* Artifact Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Artifact Set (2pc)</Typography>
                  <select
                    value={artifactSet2pc}
                    onChange={(e) => setArtifactSet2pc(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                  >
                    {artifactSets.map((set) => (
                      <option key={set.id} value={set.id}>
                        {set.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Artifact Set (4pc)</Typography>
                  <select
                    value={artifactSet4pc}
                    onChange={(e) => setArtifactSet4pc(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                  >
                    {artifactSets.map((set) => (
                      <option key={set.id} value={set.id}>
                        {set.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Sands</Typography>
                  <select
                    value={sandsMainStat}
                    onChange={(e) => setSandsMainStat(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                  >
                    <option value="ATK%">ATK%</option>
                    <option value="HP%">HP%</option>
                    <option value="DEF%">DEF%</option>
                    <option value="Energy Recharge%">Energy Recharge%</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Goblet</Typography>
                  <select
                    value={gobletMainStat}
                    onChange={(e) => setGobletMainStat(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                  >
                    <option value="Fire Damage Bonus%">Fire Damage Bonus%</option>
                    <option value="Ice Damage Bonus%">Ice Damage Bonus%</option>
                    <option value="ATK%">ATK%</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Crown</Typography>
                  <select
                    value={crownMainStat}
                    onChange={(e) => setCrownMainStat(e.target.value)}
                    className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                  >
                    <option value="Crit Rate%">Crit Rate%</option>
                    <option value="Crit Damage%">Crit Damage%</option>
                  </select>
                </div>
              </div>

              {/* Sub Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Crit Rate %</Typography>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={critRateSub}
                    onChange={(e) => setCritRateSub(Number(e.target.value))}
                    className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Crit Damage %</Typography>
                  <input
                    type="number"
                    min={0}
                    max={300}
                    value={critDamageSub}
                    onChange={(e) => setCritDamageSub(Number(e.target.value))}
                    className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">ATK %</Typography>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={atkPercentSub}
                    onChange={(e) => setAtkPercentSub(Number(e.target.value))}
                    className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Artifact Optimizer Tab */}
        <TabsContent value="optimizer">
          <Card>
            <div className="p-4 space-y-4">
              <Typography variant="h3">Artifact Optimizer</Typography>
              <Typography variant="body" textColor="secondary">
                AI-recommended artifact configuration for {selectedCharacter?.name || "selected character"}.
              </Typography>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                  <Typography variant="bodySm" weight="semibold" className="mb-2">Recommended Set</Typography>
                  <Typography variant="body">
                    {artifactSets.find(s => s.id === artifactRecommendation.set)?.name || "Unknown"}
                  </Typography>
                  <Typography variant="caption" textColor="secondary" className="mt-1">
                    {artifactSets.find(s => s.id === artifactRecommendation.set)?.bonuses["4pc"] || ""}
                  </Typography>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                    <Typography variant="caption" textColor="tertiary">Sands</Typography>
                    <Typography variant="bodySm" weight="medium">{artifactRecommendation.sands}</Typography>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                    <Typography variant="caption" textColor="tertiary">Goblet</Typography>
                    <Typography variant="bodySm" weight="medium">{artifactRecommendation.goblet}</Typography>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                    <Typography variant="caption" textColor="tertiary">Crown</Typography>
                    <Typography variant="bodySm" weight="medium">{artifactRecommendation.crown}</Typography>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                  <Typography variant="bodySm" weight="semibold" className="mb-2">Priority Sub Stats</Typography>
                  <div className="flex flex-wrap gap-2">
                    {artifactRecommendation.subs.map((sub, i) => (
                      <Badge key={i} variant="outline">
                        {i + 1}. {sub}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* AI Advisor v2 Tab */}
        <TabsContent value="advisor">
          <Card>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                <Typography variant="h3">AI Advisor v2</Typography>
                <Badge variant="accent" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Explainable AI
                </Badge>
              </div>

              <div className="space-y-3">
                {aiRecommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                    <div className="rounded-full bg-[rgb(var(--color-primary)/0.1)] p-2 shrink-0">
                      <Info className="h-4 w-4 text-[rgb(var(--color-primary))]" />
                    </div>
                    <div className="flex-1">
                      <Typography variant="bodySm">{rec}</Typography>
                      <Button variant="ghost" size="sm" className="mt-2 gap-1 text-xs">
                        <ChevronRight className="h-3 w-3" />
                        Why?
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
