"use client";

import { Typography } from "@/components/ui/Typography";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { X, Filter, Flame, Droplets, Wind, Mountain, Zap, Snowflake, Sun, Moon, Crosshair } from "lucide-react";
import type { WeaponFilters, WeaponType, Rarity, Element, DamageType } from "@/types/domain";

interface WeaponFilterBarProps {
  filters: WeaponFilters;
  filterOptions: {
    weaponTypes: string[];
    rarities: string[];
    elements: string[];
    damageTypes: string[];
    manufacturers: string[];
  };
  onToggleWeaponType: (type: string) => void;
  onToggleRarity: (rarity: string) => void;
  onToggleElement: (element: string) => void;
  onToggleDamageType: (type: string) => void;
  onToggleManufacturer: (manufacturer: string) => void;
  onReset: () => void;
  activeFilterCount: number;
  filteredCount: number;
  totalCount: number;
}

const elementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Fire: Flame, Water: Droplets, Wind: Wind, Earth: Mountain,
  Lightning: Zap, Ice: Snowflake, Light: Sun, Dark: Moon, Physical: Crosshair,
};

export function WeaponFilterBar({
  filters, filterOptions, onToggleWeaponType, onToggleRarity, onToggleElement,
  onToggleDamageType, onToggleManufacturer, onReset, activeFilterCount, filteredCount, totalCount,
}: WeaponFilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
          <Typography variant="bodySm" weight="medium">Filters</Typography>
          {activeFilterCount > 0 && <Chip variant="primary" size="sm">{activeFilterCount}</Chip>}
        </div>
        <div className="flex items-center gap-3">
          <Typography variant="caption" textColor="secondary">{filteredCount} of {totalCount} weapons</Typography>
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
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">Weapon Type</Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.weaponTypes.map((t) => (
            <Chip key={t} variant={filters.weaponTypes.includes(t as WeaponType) ? "active" : "interactive"} size="md" onClick={() => onToggleWeaponType(t)} className="cursor-pointer">{t}</Chip>
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
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">Damage Type</Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.damageTypes.map((t) => (
            <Chip key={t} variant={filters.damageTypes.includes(t as DamageType) ? "active" : "interactive"} size="md" onClick={() => onToggleDamageType(t)} className="cursor-pointer">{t}</Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">Manufacturer</Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.manufacturers.map((m) => (
            <Chip key={m} variant={filters.manufacturers.includes(m) ? "active" : "interactive"} size="md" onClick={() => onToggleManufacturer(m)} className="cursor-pointer">{m}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
