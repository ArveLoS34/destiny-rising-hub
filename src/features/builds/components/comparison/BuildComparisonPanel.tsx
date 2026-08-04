"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { BuildSummary } from "@/types/domain";
import { ArrowRight, Trophy, ArrowLeftRight } from "lucide-react";

interface BuildComparisonPanelProps {
  builds: BuildSummary[];
}

export function BuildComparisonPanel({ builds }: BuildComparisonPanelProps) {
  const [selectedA, setSelectedA] = useState<string>("");
  const [selectedB, setSelectedB] = useState<string>("");

  const buildA = builds.find((b) => b.id === selectedA);
  const buildB = builds.find((b) => b.id === selectedB);

  const comparisons = buildA && buildB ? [
    { category: "Overall", a: buildA.score.overall, b: buildB.score.overall, format: (v: number) => `${v}/100` },
    { category: "Damage", a: buildA.score.damage, b: buildB.score.damage, format: (v: number) => `${v}/100` },
    { category: "Survivability", a: buildA.score.survivability, b: buildB.score.survivability, format: (v: number) => `${v}/100` },
    { category: "Consistency", a: buildA.score.consistency, b: buildB.score.consistency, format: (v: number) => `${v}/100` },
    { category: "Synergy", a: buildA.score.synergy, b: buildB.score.synergy, format: (v: number) => `${v}/100` },
    { category: "Rating", a: buildA.rating, b: buildB.rating, format: (v: number) => `${v}/5` },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ArrowLeftRight className="h-5 w-5 text-[rgb(var(--color-primary))]" />
        <Typography variant="h3">Build Comparison</Typography>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <select
          value={selectedA}
          onChange={(e) => setSelectedA(e.target.value)}
          className="h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm text-[rgb(var(--color-text-primary))] focus:border-[rgb(var(--color-primary))] focus:outline-none"
        >
          <option value="">Select Build A</option>
          {builds.map((b) => (
            <option key={b.id} value={b.id}>{b.characterName} — {b.title}</option>
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
          <option value="">Select Build B</option>
          {builds.map((b) => (
            <option key={b.id} value={b.id}>{b.characterName} — {b.title}</option>
          ))}
        </select>
      </div>

      {/* Comparison Table */}
      {buildA && buildB && (
        <Card padding="md">
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center text-center border-b border-[rgb(var(--color-border))] pb-3 mb-3">
              <Typography variant="bodySm" weight="semibold">{buildA.title}</Typography>
              <Typography variant="caption" textColor="tertiary">VS</Typography>
              <Typography variant="bodySm" weight="semibold">{buildB.title}</Typography>
            </div>

            {comparisons.map((comp) => (
              <div key={comp.category} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                <div className="text-right">
                  <span className={cn(
                    "text-sm font-medium",
                    comp.a > comp.b ? "text-[rgb(var(--color-success))]" : comp.a < comp.b ? "text-[rgb(var(--color-text-secondary))]" : "text-[rgb(var(--color-text-primary))]"
                  )}>
                    {comp.format(comp.a)}
                  </span>
                </div>
                <Typography variant="caption" textColor="tertiary" className="min-w-[80px] text-center">
                  {comp.category}
                </Typography>
                <div className="text-left">
                  <span className={cn(
                    "text-sm font-medium",
                    comp.b > comp.a ? "text-[rgb(var(--color-success))]" : comp.b < comp.a ? "text-[rgb(var(--color-text-secondary))]" : "text-[rgb(var(--color-text-primary))]"
                  )}>
                    {comp.format(comp.b)}
                  </span>
                </div>
              </div>
            ))}

            {/* Winner */}
            <div className="mt-4 pt-3 border-t border-[rgb(var(--color-border))] text-center">
              <Typography variant="bodySm" textColor="secondary">
                {buildA.score.overall > buildB.score.overall
                  ? `${buildA.title} wins with ${buildA.score.overall}/100 overall score`
                  : buildB.score.overall > buildA.score.overall
                  ? `${buildB.title} wins with ${buildB.score.overall}/100 overall score`
                  : "Both builds are equally viable"}
              </Typography>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
