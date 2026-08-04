"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Search } from "@/components/ui/Search";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { WeaponCard } from "@/features/weapons/components/cards/WeaponCard";
import { WeaponFilterBar } from "@/features/weapons/components/filters/WeaponFilterBar";
import { WeaponSortBar } from "@/features/weapons/components/sorting/WeaponSortBar";
import { useWeaponFilters } from "@/features/weapons/hooks";
import type { WeaponSummary, WeaponViewMode } from "@/types/domain";
import { SearchX, Grid3X3, List } from "lucide-react";

interface WeaponListClientProps {
  weapons: WeaponSummary[];
  filterOptions: {
    weaponTypes: string[];
    rarities: string[];
    elements: string[];
    damageTypes: string[];
    manufacturers: string[];
  };
}

export function WeaponListClient({
  weapons,
  filterOptions,
}: WeaponListClientProps) {
  const [viewMode, setViewMode] = useState<WeaponViewMode>("grid");

  const {
    filters,
    filteredWeapons,
    totalCount,
    filteredCount,
    setSearch,
    toggleWeaponType,
    toggleRarity,
    toggleElement,
    toggleDamageType,
    toggleManufacturer,
    setSortBy,
    toggleSortOrder,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useWeaponFilters(weapons);

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20">
          <WeaponFilterBar
            filters={filters}
            filterOptions={filterOptions}
            onToggleWeaponType={toggleWeaponType}
            onToggleRarity={toggleRarity}
            onToggleElement={toggleElement}
            onToggleDamageType={toggleDamageType}
            onToggleManufacturer={toggleManufacturer}
            onReset={resetFilters}
            activeFilterCount={activeFilterCount}
            filteredCount={filteredCount}
            totalCount={totalCount}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Search & Sort & View Mode Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="flex-1">
            <Search
              placeholder="Search weapons..."
              size="md"
              variant="filled"
              className="w-full"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>
          <WeaponSortBar
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortByChange={setSortBy}
            onToggleSortOrder={toggleSortOrder}
          />
          <div className="flex items-center gap-1 rounded-lg bg-[rgb(var(--color-surface-elevated))] p-0.5">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Weapon Grid/List */}
        {filteredWeapons.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredWeapons.map((weapon, index) => (
                  <WeaponCard
                    key={weapon.id}
                    weapon={weapon}
                    index={index}
                    viewMode="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredWeapons.map((weapon, index) => (
                  <WeaponCard
                    key={weapon.id}
                    weapon={weapon}
                    index={index}
                    viewMode="list"
                  />
                ))}
              </div>
            )}

            {hasActiveFilters && filteredCount < totalCount && (
              <div className="mt-6 text-center">
                <Typography variant="caption" textColor="tertiary">
                  Showing {filteredCount} of {totalCount} weapons
                </Typography>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No weapons found"
            description={
              hasActiveFilters
                ? "Try adjusting your filters or search query."
                : "No weapons are available yet."
            }
            action={
              hasActiveFilters ? (
                <button
                  onClick={resetFilters}
                  className="text-sm text-[rgb(var(--color-primary))] hover:underline"
                >
                  Reset all filters
                </button>
              ) : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
