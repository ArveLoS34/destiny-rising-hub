"use client";

import { useState, useMemo } from "react";
import { Typography } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { characters } from "@/data/games/destiny-rising/characters";
import { weapons } from "@/data/games/destiny-rising/weapons";
import {
  createCharacterGoal,
  createWeaponGoal,
  calculatePlanner,
  generateDailyPlan,
} from "@/features/planner/services/planner-service";
import type { PlannerGoal, PlannerCalculation, DailyPlan } from "@/types/domain";
import {
  Target,
  Plus,
  Trash2,
  Zap,
  Clock,
  Package,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Calendar,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export function PlannerClient() {
  const [goals, setGoals] = useState<PlannerGoal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedType, setSelectedType] = useState<"character" | "weapon">("character");
  const [selectedId, setSelectedId] = useState<string>("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(90);

  const calculations = useMemo(() => {
    return goals.map((goal) => calculatePlanner(goal));
  }, [goals]);

  const dailyPlan = useMemo(() => {
    if (goals.length === 0) return null;
    return generateDailyPlan(goals);
  }, [goals]);

  const addGoal = () => {
    if (!selectedId) return;

    let newGoal: PlannerGoal | null = null;

    if (selectedType === "character") {
      newGoal = createCharacterGoal(selectedId, currentLevel, targetLevel);
    } else {
      newGoal = createWeaponGoal(selectedId, currentLevel, targetLevel);
    }

    if (newGoal) {
      setGoals([...goals, newGoal]);
      setShowAddGoal(false);
      setSelectedId("");
      setCurrentLevel(1);
      setTargetLevel(90);
    }
  };

  const removeGoal = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId));
  };

  return (
    <div className="space-y-6">
      {/* Goals Section */}
      <Card>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[rgb(var(--color-primary))]" />
              <Typography variant="h3">Progression Goals</Typography>
            </div>
            <Button size="sm" onClick={() => setShowAddGoal(!showAddGoal)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          </div>

          {/* Add Goal Form */}
          {showAddGoal && (
            <div className="p-4 rounded-lg bg-[rgb(var(--color-surface-elevated))] space-y-4">
              {/* Type Selector */}
              <div className="flex gap-2">
                <Button
                  variant={selectedType === "character" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType("character")}
                >
                  Character
                </Button>
                <Button
                  variant={selectedType === "weapon" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType("weapon")}
                >
                  Weapon
                </Button>
              </div>

              {/* Item Selector */}
              <div className="space-y-2">
                <Typography variant="bodySm" weight="medium">
                  Select {selectedType}
                </Typography>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                >
                  <option value="">Choose...</option>
                  {selectedType === "character"
                    ? characters.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.rarity} {c.element})
                        </option>
                      ))
                    : weapons.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.rarity} {w.weaponType})
                        </option>
                      ))}
                </select>
              </div>

              {/* Level Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Typography variant="bodySm" weight="medium">
                    Current Level
                  </Typography>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(Number(e.target.value))}
                    className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Typography variant="bodySm" weight="medium">
                    Target Level
                  </Typography>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(Number(e.target.value))}
                    className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={addGoal} disabled={!selectedId}>
                  Add Goal
                </Button>
                <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Goals List */}
          {goals.length > 0 ? (
            <div className="space-y-2">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${
                        goal.type === "character"
                          ? "bg-[rgb(var(--color-primary)/0.3)]"
                          : "bg-[rgb(var(--color-accent)/0.3)]"
                      }`}
                    >
                      {goal.targetName.charAt(0)}
                    </div>
                    <div>
                      <Typography variant="bodySm" weight="medium">
                        {goal.targetName}
                      </Typography>
                      <Typography variant="caption" textColor="tertiary">
                        Level {goal.currentLevel} → {goal.targetLevel}
                      </Typography>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeGoal(goal.id)}>
                    <Trash2 className="h-4 w-4 text-[rgb(var(--color-error))]" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Typography variant="body" textColor="secondary" className="text-center py-8">
              No goals yet. Add a character or weapon to start planning.
            </Typography>
          )}
        </div>
      </Card>

      {/* Calculations */}
      {calculations.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="elevated" padding="sm">
              <CardContent className="flex flex-col items-center gap-2 p-0 text-center">
                <Package className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                <Typography variant="h3">
                  {calculations.reduce((sum, c) => sum + c.materials.length, 0)}
                </Typography>
                <Typography variant="caption" textColor="tertiary">
                  Materials Needed
                </Typography>
              </CardContent>
            </Card>
            <Card variant="elevated" padding="sm">
              <CardContent className="flex flex-col items-center gap-2 p-0 text-center">
                <Zap className="h-5 w-5 text-[rgb(var(--color-warning))]" />
                <Typography variant="h3">
                  {calculations.reduce((sum, c) => sum + c.totalEnergy, 0)}
                </Typography>
                <Typography variant="caption" textColor="tertiary">
                  Total Energy
                </Typography>
              </CardContent>
            </Card>
            <Card variant="elevated" padding="sm">
              <CardContent className="flex flex-col items-center gap-2 p-0 text-center">
                <Clock className="h-5 w-5 text-[rgb(var(--color-accent))]" />
                <Typography variant="h3">
                  {Math.max(...calculations.map((c) => c.estimatedDays))}
                </Typography>
                <Typography variant="caption" textColor="tertiary">
                  Days Estimated
                </Typography>
              </CardContent>
            </Card>
            <Card variant="elevated" padding="sm">
              <CardContent className="flex flex-col items-center gap-2 p-0 text-center">
                <Target className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
                <Typography variant="h3">{goals.length}</Typography>
                <Typography variant="caption" textColor="tertiary">
                  Active Goals
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Material Requirements */}
          <Card>
            <div className="p-4 space-y-4">
              <Typography variant="h3">Material Requirements</Typography>
              <div className="space-y-2">
                {calculations
                  .flatMap((c) => c.materials)
                  .sort((a, b) => b.missing - a.missing)
                  .slice(0, 10)
                  .map((mat, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]"
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white bg-[rgb(var(--color-primary)/0.2)]"
                      >
                        {mat.materialName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <Typography variant="bodySm" weight="medium">
                            {mat.materialName}
                          </Typography>
                          <Typography variant="caption" weight="medium">
                            {mat.missing} needed
                          </Typography>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-tertiary))]">
                          <span className="capitalize">{mat.source}</span>
                          <span>•</span>
                          <span>{mat.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          {/* Daily Plan */}
          {dailyPlan && (
            <Card>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
                    <Typography variant="h3">Today&apos;s Plan</Typography>
                  </div>
                  <Badge variant="outline">
                    {dailyPlan.tasks.length} tasks • {dailyPlan.estimatedTime}
                  </Badge>
                </div>

                {/* AI Suggestions */}
                {dailyPlan.aiSuggestions.length > 0 && (
                  <div className="p-3 rounded-lg bg-[rgb(var(--color-accent)/0.05)] border border-[rgb(var(--color-accent)/0.2)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-[rgb(var(--color-accent))]" />
                      <Typography variant="bodySm" weight="semibold">
                        AI Suggestions
                      </Typography>
                    </div>
                    <div className="space-y-1">
                      {dailyPlan.aiSuggestions.slice(0, 3).map((suggestion, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 text-[rgb(var(--color-accent))] mt-1" />
                          <Typography variant="caption" textColor="secondary">
                            {suggestion}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks */}
                <div className="space-y-2">
                  {dailyPlan.tasks.slice(0, 8).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          task.priority === "critical"
                            ? "bg-[rgb(var(--color-error)/0.2)]"
                            : task.priority === "high"
                            ? "bg-[rgb(var(--color-warning)/0.2)]"
                            : "bg-[rgb(var(--color-surface-overlay))]"
                        }`}
                      >
                        {task.type === "boss" ? (
                          <AlertCircle className="h-4 w-4 text-[rgb(var(--color-warning))]" />
                        ) : task.type === "domain" ? (
                          <MapPin className="h-4 w-4 text-[rgb(var(--color-primary))]" />
                        ) : (
                          <Package className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Typography variant="bodySm" weight="medium">
                          {task.title}
                        </Typography>
                        <Typography variant="caption" textColor="secondary">
                          {task.description} • {task.estimatedTime}
                        </Typography>
                      </div>
                      <Badge
                        variant={
                          task.priority === "critical"
                            ? "error"
                            : task.priority === "high"
                            ? "warning"
                            : "default"
                        }
                        className="text-[10px]"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
