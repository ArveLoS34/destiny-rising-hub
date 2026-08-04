"use client";

import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";
import type { WeaponSummary } from "@/types/domain";
import { characters } from "@/data/games/destiny-rising/characters";
import { weapons } from "@/data/games/destiny-rising/weapons";
import { ArrowRight } from "lucide-react";

interface WeaponRelationshipsProps {
  weapon: WeaponSummary;
}

export function WeaponRelationships({ weapon }: WeaponRelationshipsProps) {
  // Characters that use this weapon type (simplified recommendation)
  const recommendedCharacters = characters
    .filter((c) => c.weaponType === weapon.weaponType)
    .slice(0, 6);

  // Similar weapons (same type, different name)
  const similarWeapons = weapons
    .filter((w) => w.weaponType === weapon.weaponType && w.id !== weapon.id)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Recommended Characters */}
      <Card>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h3">Recommended Characters</Typography>
            <Badge variant="primary">{recommendedCharacters.length}</Badge>
          </div>
          {recommendedCharacters.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {recommendedCharacters.map((char) => (
                <Link
                  key={char.id}
                  href={`/destiny-rising/characters/${char.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-colors"
                >
                  <Avatar fallback={char.name.charAt(0)} size="md" />
                  <div className="flex-1 min-w-0">
                    <Typography variant="bodySm" weight="medium" className="truncate">
                      {char.name}
                    </Typography>
                    <Typography variant="caption" textColor="tertiary">
                      {char.role} • {char.element}
                    </Typography>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[rgb(var(--color-text-tertiary))]" />
                </Link>
              ))}
            </div>
          ) : (
            <Typography variant="bodySm" textColor="secondary">
              No specific character recommendations available yet.
            </Typography>
          )}
        </div>
      </Card>

      {/* Similar Weapons */}
      <Card>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="h3">Similar Weapons</Typography>
            <Badge variant="outline">{similarWeapons.length}</Badge>
          </div>
          {similarWeapons.length > 0 ? (
            <div className="space-y-2">
              {similarWeapons.map((w) => (
                <Link
                  key={w.id}
                  href={`/destiny-rising/weapons/${w.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] transition-colors"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white/80"
                    style={{
                      background: `linear-gradient(135deg, ${w.colorTheme}, ${w.colorTheme}80)`,
                    }}
                  >
                    {w.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography variant="bodySm" weight="medium" className="truncate">
                      {w.name}
                    </Typography>
                    <Typography variant="caption" textColor="tertiary">
                      {w.rarity} • ATK {w.stats.baseATK}
                    </Typography>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[rgb(var(--color-text-tertiary))]" />
                </Link>
              ))}
            </div>
          ) : (
            <Typography variant="bodySm" textColor="secondary">
              No similar weapons found.
            </Typography>
          )}
        </div>
      </Card>
    </div>
  );
}
