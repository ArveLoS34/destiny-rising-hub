import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Character } from "@/types/domain";
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
  CheckCircle,
} from "lucide-react";

interface CharacterHeroProps {
  character: Character;
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

const rarityBadgeVariant: Record<string, "warning" | "primary" | "secondary" | "default"> = {
  SSR: "warning",
  SR: "primary",
  R: "secondary",
  N: "default",
};

export function CharacterHero({ character }: CharacterHeroProps) {
  const ElementIcon = elementIcons[character.element] || Crosshair;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--color-border))]">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${character.colorTheme}, ${character.colorTheme}20)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-background))] via-transparent to-transparent" />

      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Character Portrait Placeholder */}
          <div className="shrink-0">
            <div
              className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-2xl text-4xl md:text-5xl font-bold text-white/80 border border-[rgb(var(--color-border))]"
              style={{
                background: `linear-gradient(135deg, ${character.colorTheme}, ${character.colorTheme}60)`,
              }}
            >
              {character.name.charAt(0)}
            </div>
          </div>

          {/* Character Info */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={rarityBadgeVariant[character.rarity]} className="text-xs">
                {character.rarity}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <ElementIcon className={cn("h-3 w-3")} />
                {character.element}
              </Badge>
              <Badge variant="outline">{character.role}</Badge>
              <Badge variant="outline">{character.weaponType}</Badge>
              <Badge variant="outline">{character.faction}</Badge>
            </div>

            <div>
              <Typography variant="h1" className="mb-1">
                {character.name}
              </Typography>
              <Typography variant="bodyLg" textColor="secondary">
                {character.title}
              </Typography>
            </div>

            {/* Verification Badge */}
            {character.verification.verified && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-[rgb(var(--color-success))]" />
                <Typography variant="caption" textColor="secondary">
                  Verified data • Game v{character.verification.gameVersion}
                </Typography>
              </div>
            )}

            {/* Lore Snippet */}
            <Typography variant="bodySm" textColor="secondary" className="max-w-2xl line-clamp-3">
              {character.lore}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
