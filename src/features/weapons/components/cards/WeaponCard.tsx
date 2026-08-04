"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import type { WeaponSummary } from "@/types/domain";
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
  Sword,
  Shield,
  Cross,
  Target,
} from "lucide-react";

interface WeaponCardProps {
  weapon: WeaponSummary;
  index?: number;
  viewMode?: "grid" | "list";
}

const elementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Fire: Flame,
  Water: Droplets,
  Wind: Wind,
  Earth: Mountain,
  Lightning: Zap,
  Ice: Snowflake,
  Light: Sun,
  Dark: Moon,
  Physical: Crosshair,
};

const rarityColors: Record<string, string> = {
  SSR: "from-yellow-500/20 to-amber-600/20 border-yellow-500/30",
  SR: "from-purple-500/20 to-violet-600/20 border-purple-500/30",
  R: "from-blue-500/20 to-indigo-600/20 border-blue-500/30",
  N: "from-gray-500/20 to-gray-600/20 border-gray-500/30",
};

const rarityBadgeVariant: Record<string, "warning" | "primary" | "secondary" | "default"> = {
  SSR: "warning",
  SR: "primary",
  R: "secondary",
  N: "default",
};

const elementColors: Record<string, string> = {
  Fire: "text-red-400",
  Water: "text-blue-400",
  Wind: "text-emerald-400",
  Earth: "text-amber-600",
  Lightning: "text-yellow-400",
  Ice: "text-cyan-400",
  Light: "text-amber-300",
  Dark: "text-violet-400",
  Physical: "text-gray-400",
};

export function WeaponCard({ weapon, index = 0, viewMode = "grid" }: WeaponCardProps) {
  const ElementIcon = elementIcons[weapon.element] || Crosshair;

  if (viewMode === "list") {
    return (
      <Link href={`/destiny-rising/weapons/${weapon.slug}`} className="group block">
        <article
          className={cn(
            "flex items-center gap-4 rounded-xl border bg-gradient-to-r p-4 transition-all duration-300",
            "group-hover:scale-[1.01] group-hover:shadow-lg",
            rarityColors[weapon.rarity] || rarityColors.N
          )}
        >
          {/* Icon */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white/80"
            style={{
              background: `linear-gradient(135deg, ${weapon.colorTheme}, ${weapon.colorTheme}80)`,
            }}
          >
            {weapon.name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <Typography variant="bodySm" weight="semibold" className="truncate">
              {weapon.name}
            </Typography>
            <Typography variant="caption" textColor="tertiary">
              {weapon.weaponType} • {weapon.manufacturer}
            </Typography>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <Badge variant={rarityBadgeVariant[weapon.rarity]} className="text-[10px]">
              {weapon.rarity}
            </Badge>
            <div className="text-right">
              <Typography variant="bodySm" weight="semibold">
                ATK {weapon.stats.baseATK}
              </Typography>
              <Typography variant="caption" textColor="tertiary">
                {weapon.tier} Tier
              </Typography>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/destiny-rising/weapons/${weapon.slug}`} className="group block">
      <article
        className={cn(
          "relative overflow-hidden rounded-xl border bg-gradient-to-br transition-all duration-300",
          "group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-[rgb(var(--color-primary)/0.1)]",
          rarityColors[weapon.rarity] || rarityColors.N
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Weapon Visual Area */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `linear-gradient(135deg, ${weapon.colorTheme}40, ${weapon.colorTheme}10)`,
            }}
          />

          {/* Placeholder for weapon splash art */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white/80"
              style={{
                background: `linear-gradient(135deg, ${weapon.colorTheme}, ${weapon.colorTheme}80)`,
              }}
            >
              {weapon.name.charAt(0)}
            </div>
          </div>

          {/* Element Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(var(--color-background)/0.7)] backdrop-blur-sm border border-[rgb(var(--color-border))]">
              <ElementIcon className={cn("h-3.5 w-3.5", elementColors[weapon.element])} />
            </div>
          </div>

          {/* Rarity Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <Badge variant={rarityBadgeVariant[weapon.rarity]} className="text-[10px] font-bold">
              {weapon.rarity}
            </Badge>
          </div>

          {/* Tier Badge - Bottom Right */}
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="text-[10px] bg-[rgb(var(--color-background)/0.7)] backdrop-blur-sm">
              {weapon.tier}
            </Badge>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-3 space-y-2">
          <div>
            <Typography variant="bodySm" weight="semibold" className="leading-tight truncate">
              {weapon.name}
            </Typography>
            <Typography variant="caption" textColor="tertiary" className="truncate block">
              {weapon.weaponType} • {weapon.manufacturer}
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
              {weapon.damageType}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Typography variant="caption" weight="medium">
              ATK {weapon.stats.baseATK}
            </Typography>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-success))]" />
              <Typography variant="caption" textColor="secondary">
                {weapon.winRate}%
              </Typography>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
