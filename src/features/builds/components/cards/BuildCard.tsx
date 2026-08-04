"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import type { BuildSummary } from "@/types/domain";
import Link from "next/link";
import { Star, Users, Shield, Zap, Trophy, TrendingUp, CheckCircle } from "lucide-react";

interface BuildCardProps {
  build: BuildSummary;
  index?: number;
}

const priorityBadges: Record<string, { label: string; variant: "primary" | "accent" | "warning" | "success" | "default" }> = {
  main: { label: "Recommended", variant: "success" },
  alternative: { label: "Alternative", variant: "default" },
  budget: { label: "Budget", variant: "warning" },
  endgame: { label: "End Game", variant: "primary" },
};

const difficultyLabels: Record<string, { label: string; color: string }> = {
  easy: { label: "Easy", color: "text-[rgb(var(--color-success))]" },
  medium: { label: "Medium", color: "text-[rgb(var(--color-warning))]" },
  hard: { label: "Hard", color: "text-[rgb(var(--color-error))]" },
  expert: { label: "Expert", color: "text-[rgb(var(--color-primary))]" },
};

export function BuildCard({ build, index = 0 }: BuildCardProps) {
  const priority = priorityBadges[build.priority] || priorityBadges.alternative;
  const difficulty = difficultyLabels[build.difficulty] || difficultyLabels.medium;

  return (
    <Link href={`/destiny-rising/build-lab/${build.slug}`} className="group block">
      <article
        className={cn(
          "relative overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] transition-all duration-300",
          "group-hover:border-[rgb(var(--color-border-hover))] group-hover:shadow-lg group-hover:shadow-[rgb(var(--color-primary)/0.05)]",
          build.recommended && "ring-1 ring-[rgb(var(--color-success)/0.3)]"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Top Bar: Character + Tier */}
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: build.characterColor }}
            >
              {build.characterName.charAt(0)}
            </div>
            <div>
              <Typography variant="bodySm" weight="semibold">{build.characterName}</Typography>
              <Typography variant="caption" textColor="tertiary">{build.buildType}</Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {build.recommended && (
              <Badge variant="success" className="gap-1 text-[10px]">
                <CheckCircle className="h-3 w-3" />
                Top Pick
              </Badge>
            )}
            <Badge variant="outline">{build.tier}</Badge>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Title & Description */}
          <div>
            <Typography variant="h4" className="mb-1 line-clamp-1">{build.title}</Typography>
            <Typography variant="bodySm" textColor="secondary" className="line-clamp-2">
              {build.description}
            </Typography>
          </div>

          {/* Weapon */}
          <div className="flex items-center gap-2 rounded-lg bg-[rgb(var(--color-surface-elevated))] p-2">
            <div className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold text-white bg-[rgb(var(--color-primary)/0.3)]">
              {build.weapon.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <Typography variant="caption" weight="medium" className="truncate block">{build.weapon.name}</Typography>
            </div>
            <Badge variant={build.weapon.rarity === "SSR" ? "warning" : build.weapon.rarity === "SR" ? "primary" : "default"} className="text-[10px]">
              {build.weapon.rarity}
            </Badge>
          </div>

          {/* Score Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Typography variant="caption" textColor="tertiary">Build Score</Typography>
              <Typography variant="caption" weight="semibold" className="text-[rgb(var(--color-primary))]">
                {build.score.overall}/100
              </Typography>
            </div>
            <div className="h-2 rounded-full bg-[rgb(var(--color-surface-elevated))] overflow-hidden">
              <div
                className="h-full rounded-full gradient-primary transition-all duration-500"
                style={{ width: `${build.score.overall}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <Typography variant="caption" textColor="tertiary">DMG</Typography>
                <Typography variant="caption" weight="medium">{build.score.damage}</Typography>
              </div>
              <div className="text-center">
                <Typography variant="caption" textColor="tertiary">DEF</Typography>
                <Typography variant="caption" weight="medium">{build.score.survivability}</Typography>
              </div>
              <div className="text-center">
                <Typography variant="caption" textColor="tertiary">SYN</Typography>
                <Typography variant="caption" weight="medium">{build.score.synergy}</Typography>
              </div>
            </div>
          </div>

          {/* Footer: Meta */}
          <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--color-border))]">
            <div className="flex items-center gap-3">
              <span className={cn("flex items-center gap-1 text-xs", difficulty.color)}>
                <Shield className="h-3 w-3" />
                {difficulty.label}
              </span>
              <span className="flex items-center gap-1 text-xs text-[rgb(var(--color-text-tertiary))]">
                <Star className="h-3 w-3 text-yellow-400" />
                {build.rating}
              </span>
            </div>
            <Badge variant={priority.variant} className="text-[10px]">
              {priority.label}
            </Badge>
          </div>
        </div>
      </article>
    </Link>
  );
}
