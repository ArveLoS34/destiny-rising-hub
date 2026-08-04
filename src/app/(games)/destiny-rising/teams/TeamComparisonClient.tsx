"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamSummary } from "@/types/domain";

interface TeamComparisonPanelProps {
  teams: TeamSummary[];
}

export function TeamComparisonPanel({ teams }: TeamComparisonPanelProps) {
  const [selectedA, setSelectedA] = useState("");
  const [selectedB, setSelectedB] = useState("");

  const teamA = teams.find((t) => t.id === selectedA);
  const teamB = teams.find((t) => t.id === selectedB);

  const comparisons = teamA && teamB ? [
    { category: "Overall", a: teamA.score.overall, b: teamB.score.overall, format: (v: number) => `${v}/100` },
    { category: "Damage", a: teamA.score.damage, b: teamB.score.damage, format: (v: number) => `${v}/100` },
    { category: "Support", a: teamA.score.support, b: teamB.score.support, format: (v: number) => `${v}/100` },
    { category: "Control", a: teamA.score.control, b: teamB.score.control, format: (v: number) => `${v}/100` },
    { category: "Survivability", a: teamA.score.survivability, b: teamB.score.survivability, format: (v: number) => `${v}/100` },
    { category: "Energy", a: teamA.score.energy, b: teamB.score.energy, format: (v: number) => `${v}/100` },
    { category: "Rating", a: teamA.rating, b: teamB.rating, format: (v: number) => `${v}/5` },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ArrowLeftRight className="h-5 w-5 text-[rgb(var(--color-primary))]" />
        <Typography variant="h3">Team Comparison</Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <select
          value={selectedA}
          onChange={(e) => setSelectedA(e.target.value)}
          className="h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm text-[rgb(var(--color-text-primary))] focus:border-[rgb(var(--color-primary))] focus:outline-none"
        >
          <option value="">Select Team A</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-[rgb(var(--color-surface-elevated))] p-2">
            <ArrowLeftRight className="h-5 w-5 text-[rgb(var(--color-text-tertiary))]" />
          </div>
        </div>
        <select
          value={selectedB}
          onChange={(e) => setSelectedB(e.target.value)}
          className="h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm text-[rgb(var(--color-text-primary))] focus:border-[rgb(var(--color-primary))] focus:outline-none"
        >
          <option value="">Select Team B</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      </div>

      {teamA && teamB && (
        <Card padding="md">
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center text-center border-b border-[rgb(var(--color-border))] pb-3 mb-3">
              <Typography variant="bodySm" weight="semibold">{teamA.title}</Typography>
              <Typography variant="caption" textColor="tertiary">VS</Typography>
              <Typography variant="bodySm" weight="semibold">{teamB.title}</Typography>
            </div>

            {comparisons.map((comp) => (
              <div key={comp.category} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                <div className="text-right">
                  <span className={cn("text-sm font-medium", comp.a > comp.b ? "text-[rgb(var(--color-success))]" : comp.a < comp.b ? "text-[rgb(var(--color-text-secondary))]" : "text-[rgb(var(--color-text-primary))]")}>
                    {comp.format(comp.a)}
                  </span>
                </div>
                <Typography variant="caption" textColor="tertiary" className="min-w-[80px] text-center">{comp.category}</Typography>
                <div className="text-left">
                  <span className={cn("text-sm font-medium", comp.b > comp.a ? "text-[rgb(var(--color-success))]" : comp.b < comp.a ? "text-[rgb(var(--color-text-secondary))]" : "text-[rgb(var(--color-text-primary))]")}>
                    {comp.format(comp.b)}
                  </span>
                </div>
              </div>
            ))}

            <div className="mt-4 pt-3 border-t border-[rgb(var(--color-border))] text-center">
              <Typography variant="bodySm" textColor="secondary">
                {teamA.score.overall > teamB.score.overall
                  ? `${teamA.title} wins with ${teamA.score.overall}/100 overall score`
                  : teamB.score.overall > teamA.score.overall
                  ? `${teamB.title} wins with ${teamB.score.overall}/100 overall score`
                  : "Both teams are equally viable"}
              </Typography>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
