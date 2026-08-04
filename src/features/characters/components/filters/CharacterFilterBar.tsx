"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Chip } from "@/components/ui/Chip";
import { X, Filter } from "lucide-react";
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
  Heart,
  Cross,
  Wand2,
} from "lucide-react";
import type { CharacterFilters } from "@/types/domain";

interface CharacterFilterBarProps {
  filters: CharacterFilters;
  filterOptions: {
    elements: string[];
    roles: string[];
    rarities: string[];
    weaponTypes: string[];
    factions: string[];
  };
  onToggleElement: (element: string) => void;
  onToggleRole: (role: string) => void;
  onToggleRarity: (rarity: string) => void;
  onToggleWeaponType: (weaponType: string) => void;
  onToggleFaction: (faction: string) => void;
  onReset: () => void;
  activeFilterCount: number;
  filteredCount: number;
  totalCount: number;
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

const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  DPS: Sword,
  "Sub-DPS": Wand2,
  Support: Shield,
  Tank: Shield,
  Healer: Heart,
  Utility: Cross,
};

export function CharacterFilterBar({
  filters,
  filterOptions,
  onToggleElement,
  onToggleRole,
  onToggleRarity,
  onToggleWeaponType,
  onToggleFaction,
  onReset,
  activeFilterCount,
  filteredCount,
  totalCount,
}: CharacterFilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
          <Typography variant="bodySm" weight="medium">
            Filters
          </Typography>
          {activeFilterCount > 0 && (
            <Chip variant="primary" size="sm">
              {activeFilterCount}
            </Chip>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Typography variant="caption" textColor="secondary">
            {filteredCount} of {totalCount} characters
          </Typography>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs gap-1">
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Rarity Filter */}
      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">
          Rarity
        </Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.rarities.map((rarity) => {
            const isActive = filters.rarities.includes(rarity as any);
            return (
              <Chip
                key={rarity}
                variant={isActive ? "active" : "interactive"}
                size="md"
                onClick={() => onToggleRarity(rarity)}
                className="cursor-pointer"
              >
                {rarity}
              </Chip>
            );
          })}
        </div>
      </div>

      {/* Element Filter */}
      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">
          Element
        </Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.elements.map((element) => {
            const isActive = filters.elements.includes(element as any);
            const Icon = elementIcons[element] || Crosshair;
            return (
              <Chip
                key={element}
                variant={isActive ? "active" : "interactive"}
                size="md"
                onClick={() => onToggleElement(element)}
                className="cursor-pointer"
                icon={Icon}
              >
                {element}
              </Chip>
            );
          })}
        </div>
      </div>

      {/* Role Filter */}
      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">
          Role
        </Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.roles.map((role) => {
            const isActive = filters.roles.includes(role as any);
            const Icon = roleIcons[role] || Crosshair;
            return (
              <Chip
                key={role}
                variant={isActive ? "active" : "interactive"}
                size="md"
                onClick={() => onToggleRole(role)}
                className="cursor-pointer"
                icon={Icon}
              >
                {role}
              </Chip>
            );
          })}
        </div>
      </div>

      {/* Faction Filter */}
      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">
          Faction
        </Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.factions.map((faction) => {
            const isActive = filters.factions.includes(faction as any);
            return (
              <Chip
                key={faction}
                variant={isActive ? "active" : "interactive"}
                size="md"
                onClick={() => onToggleFaction(faction)}
                className="cursor-pointer"
              >
                {faction}
              </Chip>
            );
          })}
        </div>
      </div>
    </div>
  );
}
