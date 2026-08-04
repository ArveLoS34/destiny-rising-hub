"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import type { TeamSummary } from "@/types/domain";
import Link from "next/link";
import { Star, Shield, Zap, Heart, Users } from "lucide-react";

interface TeamCardProps {
  team: TeamSummary;
  index?: number;
}

const templateColors: Record<string, string> = {
  Boss: "bg-[rgb(var(--color-error)/0.1)] text-[rgb(var(--color-error))]",
  Raid: "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]",
  PvE: "bg-[rgb(var(--color-success)/0.1)] text-[rgb(var(--color-success))]",
  PvP: "bg-[rgb(var(--color-warning)/0.1)] text-[rgb(var(--color-warning))]",
  Beginner: "bg-[rgb(var(--color-info)/0.1)] text-[rgb(var(--color-info))]",
  F2P: "bg-[rgb(var(--color-accent)/0.1)] text-[rgb(var(--color-accent))]",
  Whale: "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]",
  EndGame: "bg-[rgb(var(--color-error)/0.1)] text-[rgb(var(--color-error))]",
};

export function TeamCard({ team, index = 0 }: TeamCardProps) {
  const templateColor = templateColors[team.template] || templateColors.PvE;

  return (
    <Link href={`/destiny-rising/teams/${team.slug}`} className="group block">
      <article
        className={cn(
          "relative overflow-hidden rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] transition-all duration-300",
          "group-hover:border-[rgb(var(--color-border-hover))] group-hover:shadow-lg group-hover:shadow-[rgb(var(--color-primary)/0.05)]"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Team Members Row */}
        <div className="flex items-center justify-center gap-2 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] px-4 py-4">
          {team.members.map((member) => (
            <div
              key={member.characterId}
              className="flex flex-col items-center gap-1"
              title={`${member.characterName} (${member.role})`}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white border-2 border-[rgb(var(--color-border))] transition-transform group-hover:scale-110"
                style={{ background: member.characterColor }}
              >
                {member.characterName.charAt(0)}
              </div>
              <Typography variant="caption" textColor="tertiary" className="text-[9px] truncate max-w-[50px]">
                {member.characterName}
              </Typography>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Title & Template */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Typography variant="h4" className="line-clamp-1">{team.title}</Typography>
              <Typography variant="caption" textColor="secondary" className="line-clamp-2 mt-0.5">
                {team.description}
              </Typography>
            </div>
            <div className="flex flex-col items-end gap-1 ml-2">
              <Badge variant="outline">{team.tier}</Badge>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", templateColor)}>
                {team.template}
              </span>
            </div>
          </div>

          {/* Score Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Typography variant="caption" textColor="tertiary">Team Score</Typography>
              <Typography variant="caption" weight="semibold" className="text-[rgb(var(--color-primary))]">
                {team.score.overall}/100
              </Typography>
            </div>
            <div className="h-2 rounded-full bg-[rgb(var(--color-surface-elevated))] overflow-hidden">
              <div
                className="h-full rounded-full gradient-primary transition-all duration-500"
                style={{ width: `${team.score.overall}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className="text-center">
                <Typography variant="caption" textColor="tertiary">DMG</Typography>
                <Typography variant="caption" weight="medium">{team.score.damage}</Typography>
              </div>
              <div className="text-center">
                <Typography variant="caption" textColor="tertiary">SUP</Typography>
                <Typography variant="caption" weight="medium">{team.score.support}</Typography>
              </div>
              <div className="text-center">
                <Typography variant="caption" textColor="tertiary">CTL</Typography>
                <Typography variant="caption" weight="medium">{team.score.control}</Typography>
              </div>
              <div className="text-center">
                <Typography variant="caption" textColor="tertiary">SUR</Typography>
                <Typography variant="caption" weight="medium">{team.score.survivability}</Typography>
              </div>
            </div>
          </div>

          {/* Elements & Meta */}
          <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--color-border))]">
            <div className="flex gap-1">
              {team.elementCoverage.map((el) => (
                <span key={el} className="rounded bg-[rgb(var(--color-surface-elevated))] px-1.5 py-0.5 text-[10px] text-[rgb(var(--color-text-secondary))]">
                  {el}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400" />
              <Typography variant="caption">{team.rating}</Typography>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
