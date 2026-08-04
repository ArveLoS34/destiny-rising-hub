"use client";

import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import type { WeaponSummary } from "@/types/domain";
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

interface WeaponHeroProps {
  weapon: WeaponSummary;
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

export function WeaponHero({ weapon }: WeaponHeroProps) {
  const ElementIcon = elementIcons[weapon.element] || Crosshair;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${rarityColors[weapon.rarity] || rarityColors.N} p-6 lg:p-8`}
    >
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
        {/* Weapon Visual */}
        <div className="relative shrink-0">
          <div
            className="flex h-32 w-32 items-center justify-center rounded-xl text-3xl font-bold text-white/80 shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${weapon.colorTheme}, ${weapon.colorTheme}80)`,
            }}
          >
            {weapon.name.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] shadow-lg">
            <ElementIcon className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
          </div>
        </div>

        {/* Weapon Info */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={weapon.rarity === "SSR" ? "warning" : weapon.rarity === "SR" ? "primary" : "secondary"}>
              {weapon.rarity}
            </Badge>
            <Badge variant="outline">{weapon.weaponType}</Badge>
            <Badge variant="outline">{weapon.damageType}</Badge>
            <Badge variant="outline">{weapon.element}</Badge>
            <Badge variant="outline">{weapon.tier}</Badge>
          </div>

          <div>
            <Typography variant="h1">{weapon.name}</Typography>
            <Typography variant="body" textColor="secondary" className="mt-1">
              {weapon.manufacturer}
            </Typography>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <div>
              <Typography variant="caption" textColor="tertiary">Base ATK</Typography>
              <Typography variant="h3">{weapon.stats.baseATK}</Typography>
            </div>
            <div>
              <Typography variant="caption" textColor="tertiary">Win Rate</Typography>
              <Typography variant="h3">{weapon.winRate}%</Typography>
            </div>
            <div>
              <Typography variant="caption" textColor="tertiary">Popularity</Typography>
              <Typography variant="h3">{weapon.popularity}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
