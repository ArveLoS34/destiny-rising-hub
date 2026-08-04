"use client";

import { useState, useMemo } from "react";
import { Typography } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import {
  getAdvisorCharacters,
  getAdvisorRecommendation,
  type AdvisorRecommendation,
} from "@/features/ai-advisor/services/advisor-engine";
import { Search } from "@/components/ui/Search";
import {
  Brain,
  Star,
  Sword,
  Users,
  Package,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Shield,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export function AdvisorClient() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allCharacters = getAdvisorCharacters();

  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) return allCharacters;
    const query = searchQuery.toLowerCase();
    return allCharacters.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.element.toLowerCase().includes(query) ||
        c.role.toLowerCase().includes(query)
    );
  }, [allCharacters, searchQuery]);

  const recommendation = useMemo(() => {
    if (!selectedCharacterId) return null;
    return getAdvisorRecommendation(selectedCharacterId);
  }, [selectedCharacterId]);

  return (
    <div className="space-y-6">
      {/* Character Selector */}
      {!recommendation ? (
        <div className="space-y-4">
          <Typography variant="h3">Select Your Character</Typography>
          <Search
            placeholder="Search characters..."
            size="md"
            variant="filled"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredCharacters.map((character) => (
              <button
                key={character.id}
                onClick={() => setSelectedCharacterId(character.id)}
                className="group flex flex-col items-center gap-2 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 transition-all hover:border-[rgb(var(--color-primary))] hover:shadow-lg hover:shadow-[rgb(var(--color-primary)/0.1)]"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white transition-transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${character.colorTheme}, ${character.colorTheme}80)`,
                  }}
                >
                  {character.name.charAt(0)}
                </div>
                <div className="text-center">
                  <Typography variant="bodySm" weight="semibold">
                    {character.name}
                  </Typography>
                  <Typography variant="caption" textColor="tertiary">
                    {character.element} • {character.role}
                  </Typography>
                </div>
                <Badge variant={character.rarity === "SSR" ? "warning" : character.rarity === "SR" ? "primary" : "default"} className="text-[10px]">
                  {character.rarity}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <AdvisorResults
          recommendation={recommendation}
          onReset={() => setSelectedCharacterId(null)}
        />
      )}
    </div>
  );
}

// ─── Results Display ───

interface AdvisorResultsProps {
  recommendation: AdvisorRecommendation;
  onReset: () => void;
}

function AdvisorResults({ recommendation, onReset }: AdvisorResultsProps) {
  const { character, bestBuild, bestWeapon, bestTeam, materialPriority, progressionPath, alternatives, quickTips, overallScore } = recommendation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="text-sm text-[rgb(var(--color-primary))] hover:underline"
          >
            ← Change Character
          </button>
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${character.colorTheme}, ${character.colorTheme}80)`,
              }}
            >
              {character.name.charAt(0)}
            </div>
            <div>
              <Typography variant="h2">{character.name}</Typography>
              <Typography variant="bodySm" textColor="secondary">
                {character.element} • {character.role} • {character.rarity}
              </Typography>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Typography variant="caption" textColor="tertiary">Overall Score</Typography>
          <div className="flex items-center gap-2">
            <Typography variant="h2" className="text-[rgb(var(--color-primary))]">
              {overallScore}
            </Typography>
            <Typography variant="caption" textColor="tertiary">/100</Typography>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-[rgb(var(--color-warning))]" />
            <Typography variant="h4">Quick Tips</Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[rgb(var(--color-success))] mt-0.5 shrink-0" />
                <Typography variant="bodySm" textColor="secondary">{tip}</Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Build */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[rgb(var(--color-primary))]" />
              <Typography variant="h3">Best Build</Typography>
            </div>
            <Badge variant="success" className="gap-1">
              <Star className="h-3 w-3" />
              Recommended
            </Badge>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-2">
              <Typography variant="h4">{bestBuild.build.title}</Typography>
              <Typography variant="bodySm" textColor="secondary">
                {bestBuild.build.description}
              </Typography>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{bestBuild.build.buildType}</Badge>
                <Badge variant="outline">Tier {bestBuild.build.tier}</Badge>
                <Badge variant="outline">{bestBuild.build.difficulty}</Badge>
              </div>
            </div>
            <div className="text-right shrink-0">
              <Typography variant="h2" className="text-[rgb(var(--color-primary))]">
                {bestBuild.build.score.overall}
              </Typography>
              <Typography variant="caption" textColor="tertiary">/100</Typography>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ScoreBar label="Damage" value={bestBuild.scoreBreakdown.damage} />
            <ScoreBar label="Survivability" value={bestBuild.scoreBreakdown.survivability} />
            <ScoreBar label="Consistency" value={bestBuild.scoreBreakdown.consistency} />
            <ScoreBar label="Accessibility" value={bestBuild.scoreBreakdown.accessibility} />
          </div>

          {/* Reasoning */}
          <div className="space-y-1">
            <Typography variant="caption" weight="semibold" textColor="tertiary">
              WHY THIS BUILD?
            </Typography>
            {bestBuild.reasoning.map((reason, i) => (
              <div key={i} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 text-[rgb(var(--color-primary))]" />
                <Typography variant="bodySm" textColor="secondary">{reason}</Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Weapon */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Sword className="h-5 w-5 text-[rgb(var(--color-accent))]" />
            <Typography variant="h3">Best Weapon</Typography>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white shrink-0"
              style={{
                background: `linear-gradient(135deg, ${bestWeapon.bestWeapon.colorTheme}, ${bestWeapon.bestWeapon.colorTheme}80)`,
              }}
            >
              {bestWeapon.bestWeapon.name.charAt(0)}
            </div>
            <div className="flex-1">
              <Typography variant="body" weight="semibold">{bestWeapon.bestWeapon.name}</Typography>
              <Typography variant="caption" textColor="secondary">
                {bestWeapon.bestWeapon.rarity} • ATK {bestWeapon.bestWeapon.stats.baseATK} • {bestWeapon.bestWeapon.element}
              </Typography>
            </div>
            <Badge variant={bestWeapon.bestWeapon.rarity === "SSR" ? "warning" : "primary"}>
              {bestWeapon.bestWeapon.rarity}
            </Badge>
          </div>

          {/* Reasoning */}
          <div className="space-y-1">
            <Typography variant="caption" weight="semibold" textColor="tertiary">
              WHY THIS WEAPON?
            </Typography>
            {bestWeapon.reasoning.map((reason, i) => (
              <div key={i} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 text-[rgb(var(--color-accent))]" />
                <Typography variant="bodySm" textColor="secondary">{reason}</Typography>
              </div>
            ))}
          </div>

          {/* Alternatives */}
          {bestWeapon.alternatives.length > 0 && (
            <div className="space-y-2">
              <Typography variant="caption" weight="semibold" textColor="tertiary">
                ALTERNATIVES
              </Typography>
              <div className="flex flex-wrap gap-2">
                {bestWeapon.alternatives.map((w) => (
                  <Badge key={w.id} variant="outline" className="gap-1">
                    {w.name}
                    <span className="text-[rgb(var(--color-text-tertiary))]">•</span>
                    {w.rarity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Best Team */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
              <Typography variant="h3">Best Team</Typography>
            </div>
            <Badge variant="outline">
              Synergy: {bestTeam.synergyScore}/100
            </Badge>
          </div>

          <Typography variant="body" weight="semibold">{bestTeam.bestTeam.title}</Typography>

          {/* Team Members */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bestTeam.bestTeam.members.map((member) => (
              <div
                key={member.characterId}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: member.characterColor }}
                >
                  {member.characterName.charAt(0)}
                </div>
                <div className="text-center">
                  <Typography variant="caption" weight="medium">
                    {member.characterName}
                  </Typography>
                  <Typography variant="caption" textColor="tertiary" className="block">
                    {member.slot === "mainCarry" ? "Main DPS" : member.slot === "subCarry" ? "Sub DPS" : member.slot === "support" ? "Support" : "Healer"}
                  </Typography>
                </div>
              </div>
            ))}
          </div>

          {/* Team Reasoning */}
          <div className="space-y-1">
            <Typography variant="caption" weight="semibold" textColor="tertiary">
              WHY THIS TEAM?
            </Typography>
            {bestTeam.reasoning.map((reason, i) => (
              <div key={i} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 text-[rgb(var(--color-secondary))]" />
                <Typography variant="bodySm" textColor="secondary">{reason}</Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Material Priority */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[rgb(var(--color-warning))]" />
            <Typography variant="h3">Material Priority</Typography>
          </div>

          <div className="space-y-2">
            {materialPriority.map((mat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]"
              >
                <div className="shrink-0">
                  {mat.priority === "critical" && <AlertTriangle className="h-5 w-5 text-[rgb(var(--color-error))]" />}
                  {mat.priority === "high" && <Zap className="h-5 w-5 text-[rgb(var(--color-warning))]" />}
                  {mat.priority === "medium" && <Clock className="h-5 w-5 text-[rgb(var(--color-info))]" />}
                  {mat.priority === "low" && <Package className="h-5 w-5 text-[rgb(var(--color-text-tertiary))]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Typography variant="bodySm" weight="medium">{mat.material}</Typography>
                  <Typography variant="caption" textColor="tertiary">
                    {mat.purpose} • ~{mat.estimatedDays} days
                  </Typography>
                </div>
                <Badge
                  variant={
                    mat.priority === "critical" ? "error" :
                    mat.priority === "high" ? "warning" :
                    mat.priority === "medium" ? "default" : "outline"
                  }
                  className="text-[10px] shrink-0"
                >
                  {mat.priority.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progression Path */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[rgb(var(--color-success))]" />
            <Typography variant="h3">Progression Path</Typography>
          </div>

          <div className="space-y-3">
            {progressionPath.map((step) => (
              <div
                key={step.step}
                className="flex gap-4 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-primary)/0.1)] text-sm font-bold text-[rgb(var(--color-primary))]">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Typography variant="bodySm" weight="semibold">{step.title}</Typography>
                    <Badge
                      variant={
                        step.priority === "immediate" ? "error" :
                        step.priority === "short-term" ? "warning" : "default"
                      }
                      className="text-[10px]"
                    >
                      {step.priority}
                    </Badge>
                  </div>
                  <Typography variant="caption" textColor="secondary">
                    {step.description} • {step.estimatedTime}
                  </Typography>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {step.requirements.map((req, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alternatives */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
            <Typography variant="h3">Alternatives</Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alternatives.map((alt, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Typography variant="bodySm" weight="semibold">{alt.name}</Typography>
                  <Badge
                    variant={alt.type === "build" ? "primary" : alt.type === "weapon" ? "accent" : "secondary"}
                    className="text-[10px]"
                  >
                    {alt.type}
                  </Badge>
                </div>
                <Typography variant="caption" textColor="secondary">
                  {alt.description}
                </Typography>
                <Typography variant="caption" textColor="tertiary">
                  Trade-off: {alt.tradeoff}
                </Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Score Bar Component ───

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Typography variant="caption" textColor="tertiary">{label}</Typography>
        <Typography variant="caption" weight="medium">{value}</Typography>
      </div>
      <Progress value={value} progressSize="sm" />
    </div>
  );
}
