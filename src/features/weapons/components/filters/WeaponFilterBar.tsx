"use client";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/Typography";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
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
} from "lucide-react";
import type { WeaponFilters } from "@/types/domain";

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

export function WeaponFilterBar({
  filters,
  filterOptions,
  onToggleWeaponType,
  onToggleRarity,
  onToggleElement,
  onToggleDamageType,
  onToggleManufacturer,
  onReset,
  activeFilterCount,
  filteredCount,
  totalCount,
}: WeaponFilterBarProps) {
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
            {filteredCount} of {totalCount} weapons
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

      {/* Weapon Type Filter */}
      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">
          Weapon Type
        </Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.weaponTypes.map((type) => {
            const isActive = filters.weaponTypes.includes(type as any);
            return (
              <Chip
                key={type}
                variant={isActive ? "active" : "interactive"}
                size="md"
                onClick={() => onToggleWeaponType(type)}
                className="cursor-pointer"
              >
                {type}
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

      {/* Damage Type Filter */}
      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">
          Damage Type
        </Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.damageTypes.map((type) => {
            const isActive = filters.damageTypes.includes(type as any);
            return (
              <Chip
                key={type}
                variant={isActive ? "active" : "interactive"}
                size="md"
                onClick={() => onToggleDamageType(type)}
                className="cursor-pointer"
              >
                {type}
              </Chip>
            );
          })}
        </div>
      </div>

      {/* Manufacturer Filter */}
      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">
          Manufacturer
        </Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.manufacturers.map((manufacturer) => {
            const isActive = filters.manufacturers.includes(manufacturer);
            return (
              <Chip
                key={manufacturer}
                variant={isActive ? "active" : "interactive"}
                size="md"
                onClick={() => onToggleManufacturer(manufacturer)}
                className="cursor-pointer"
              >
                {manufacturer}
              </Chip>
            );
          })}
        </div>
      </div>
    </div>
  );
}
