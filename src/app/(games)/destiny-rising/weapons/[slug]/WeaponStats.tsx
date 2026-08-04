"use client";

import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import type { WeaponSummary } from "@/types/domain";

interface WeaponStatsProps {
  weapon: WeaponSummary;
}

export function WeaponStats({ weapon }: WeaponStatsProps) {
  return (
    <Card>
      <div className="p-4 space-y-4">
        <Typography variant="h3">Base Statistics</Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Typography variant="caption" textColor="tertiary">Base ATK</Typography>
            <Typography variant="h4">{weapon.stats.baseATK}</Typography>
          </div>
          <div className="space-y-1">
            <Typography variant="caption" textColor="tertiary">Weapon Type</Typography>
            <Typography variant="body" weight="medium">{weapon.weaponType}</Typography>
          </div>
          <div className="space-y-1">
            <Typography variant="caption" textColor="tertiary">Element</Typography>
            <Typography variant="body" weight="medium">{weapon.element}</Typography>
          </div>
          <div className="space-y-1">
            <Typography variant="caption" textColor="tertiary">Damage Type</Typography>
            <Typography variant="body" weight="medium">{weapon.damageType}</Typography>
          </div>
        </div>

        {/* Stat Growth Chart Placeholder */}
        <div className="mt-6 p-4 rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))]">
          <Typography variant="bodySm" textColor="secondary" className="text-center">
            Level Scaling Chart (coming soon)
          </Typography>
          <div className="mt-3 h-32 flex items-end justify-between gap-1 px-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] rounded-t opacity-70"
                style={{ height: `${30 + (i * 3.5)}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-[rgb(var(--color-text-tertiary))]">
            <span>Lv 1</span>
            <span>Lv 90</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
