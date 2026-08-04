"use client";

import { Typography } from "@/components/ui/Typography";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { X, Filter, Flame, Droplets, Wind, Mountain, Zap, Snowflake, Sun, Moon, Crosshair, Sword, Shield, Heart, Wand2 } from "lucide-react";
import type { CharacterFilters, Element, Role, Rarity, Faction, WeaponType } from "@/types/domain";

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
  onToggleWeaponType: (weaponType: WeaponType) => void;
  onToggleFaction: (faction: string) => void;
  onReset: () => void;
  activeFilterCount: number;
  filteredCount: number;
  totalCount: number;
}

const elementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Fire: Flame, Water: Droplets, Wind: Wind, Earth: Mountain,
  Lightning: Zap, Ice: Snowflake, Light: Sun, Dark: Moon, Physical: Crosshair,
};

const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  DPS: Sword, "Sub-DPS": Wand2, Support: Shield, Tank: Shield, Healer: Heart, Utility: Crosshair,
};

export function CharacterFilterBar({
  filters,
  filterOptions,
  onToggleElement,
  onToggleRole,
  onToggleRarity,
  onToggleFaction,
  onReset,
  activeFilterCount,
  filteredCount,
  totalCount,
}: CharacterFilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
          <Typography variant="bodySm" weight="medium">Filters</Typography>
          {activeFilterCount > 0 && <Chip variant="primary" size="sm">{activeFilterCount}</Chip>}
        </div>
        <div className="flex items-center gap-3">
          <Typography variant="caption" textColor="secondary">{filteredCount} of {totalCount} characters</Typography>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs gap-1">
              <X className="h-3 w-3" /> Clear
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">Rarity</Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.rarities.map((r) => (
            <Chip key={r} variant={filters.rarities.includes(r as Rarity) ? "active" : "interactive"} size="md" onClick={() => onToggleRarity(r)} className="cursor-pointer">{r}</Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">Element</Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.elements.map((el) => {
            const Icon = elementIcons[el] || Crosshair;
            return (
              <Chip key={el} variant={filters.elements.includes(el as Element) ? "active" : "interactive"} size="md" onClick={() => onToggleElement(el)} className="cursor-pointer" icon={Icon}>{el}</Chip>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">Role</Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.roles.map((role) => {
            const Icon = roleIcons[role] || Crosshair;
            return (
              <Chip key={role} variant={filters.roles.includes(role as Role) ? "active" : "interactive"} size="md" onClick={() => onToggleRole(role)} className="cursor-pointer" icon={Icon}>{role}</Chip>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">Faction</Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.factions.map((f) => (
            <Chip key={f} variant={filters.factions.includes(f as Faction) ? "active" : "interactive"} size="md" onClick={() => onToggleFaction(f)} className="cursor-pointer">{f}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
