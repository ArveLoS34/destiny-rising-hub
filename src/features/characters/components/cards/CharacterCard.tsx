"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import type { CharacterSummary } from "@/types/domain";
import Link from "next/link";
import {
  Flame,
  Droplets,
  Wind,
  Mountain,
  Zap,
  Snowflake,
  Sun,
  Moon,
  Crosshair,
} from "lucide-react";

interface CharacterCardProps {
  character: CharacterSummary;
  index?: number;
}

const elementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Solar: Flame,
  Arc: Zap,
  Void: Moon,
  Stasis: Snowflake,
  Strand: Wind,
};

const rarityColors: Record<string, string> = {
  Exotic: "from-yellow-500/20 to-amber-600/20 border-yellow-500/30",
  Mythic: "from-purple-500/20 to-violet-600/20 border-purple-500/30",
  Legendary: "from-blue-500/20 to-indigo-600/20 border-blue-500/30",
  Rare: "from-green-500/20 to-emerald-600/20 border-green-500/30",
};

const rarityBadgeVariant: Record<string, "warning" | "primary" | "secondary" | "default"> = {
  Exotic: "warning",
  Mythic: "primary",
  Legendary: "secondary",
  Rare: "default",
};

const elementColors: Record<string, string> = {
  Solar: "text-orange-400",
  Arc: "text-blue-400",
  Void: "text-purple-400",
  Stasis: "text-cyan-400",
  Strand: "text-green-400",
};

export function CharacterCard({ character, index = 0 }: CharacterCardProps) {
  const ElementIcon = elementIcons[character.element] || Crosshair;

  return (
    <Link href={`/destiny-rising/characters/${character.slug}`} className="group block">
      <article
        className={cn(
          "relative overflow-hidden rounded-xl border bg-gradient-to-br transition-all duration-300",
          "group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-[rgb(var(--color-primary)/0.1)]",
          rarityColors[character.rarity] || rarityColors.N
        )}
        style={{
          animationDelay: `${index * 50}ms`,
        }}
      >
        {/* Character Visual Area */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Background gradient based on character color */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `linear-gradient(135deg, ${character.colorTheme}40, ${character.colorTheme}10)`,
            }}
          />

          {/* Placeholder for character portrait */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white/80"
              style={{
                background: `linear-gradient(135deg, ${character.colorTheme}, ${character.colorTheme}80)`,
              }}
            >
              {character.name.charAt(0)}
            </div>
          </div>

          {/* Element Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--color-background)/0.7)] backdrop-blur-sm border border-[rgb(var(--color-border))]"
            >
              <ElementIcon className={cn("h-4 w-4", elementColors[character.element])} />
            </div>
          </div>

          {/* Rarity Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <Badge variant={rarityBadgeVariant[character.rarity]} className="text-[10px] font-bold">
              {character.rarity}
            </Badge>
          </div>

          {/* Tier Badge - Bottom Right */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="text-[10px] bg-[rgb(var(--color-background)/0.7)] backdrop-blur-sm">
              {character.tierListPlacement}
            </Badge>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-3 space-y-2">
          <div>
            <Typography variant="bodySm" weight="semibold" className="leading-tight truncate">
              {character.name}
            </Typography>
            <Typography variant="caption" textColor="tertiary" className="truncate block">
              {character.title}
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
              {character.role}
            </Badge>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
              {character.weaponType}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-success))]" />
              <Typography variant="caption" textColor="secondary">
                {character.winRate}%
              </Typography>
            </div>
            <Typography variant="caption" textColor="tertiary">
              v{character.releaseVersion}
            </Typography>
          </div>
        </div>
      </article>
    </Link>
  );
}
