"use client";

import { Typography } from "@/components/ui/Typography";
import { Search } from "@/components/ui/Search";
import { EmptyState } from "@/components/ui/EmptyState";
import { CharacterCard } from "@/features/characters/components/cards/CharacterCard";
import { CharacterFilterBar } from "@/features/characters/components/filters/CharacterFilterBar";
import { CharacterSortBar } from "@/features/characters/components/sorting/CharacterSortBar";
import { useCharacterFilters } from "@/features/characters/hooks";
import type { CharacterSummary } from "@/types/domain";
import { SearchX } from "lucide-react";

interface CharacterListClientProps {
  characters: CharacterSummary[];
  filterOptions: {
    elements: string[];
    roles: string[];
    rarities: string[];
    weaponTypes: string[];
    factions: string[];
  };
}

export function CharacterListClient({
  characters,
  filterOptions,
}: CharacterListClientProps) {
  const {
    filters,
    filteredCharacters,
    totalCount,
    filteredCount,
    setSearch,
    toggleElement,
    toggleRole,
    toggleRarity,
    toggleWeaponType,
    toggleFaction,
    setSortBy,
    toggleSortOrder,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useCharacterFilters(characters);


  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20">
          <CharacterFilterBar
            filters={filters}
        filterOptions={filterOptions}
            onToggleElement={toggleElement}
            onToggleRole={toggleRole}
            onToggleRarity={toggleRarity}
            onToggleWeaponType={toggleWeaponType}
            onToggleFaction={toggleFaction}
            onReset={resetFilters}
            activeFilterCount={activeFilterCount}
            filteredCount={filteredCount}
            totalCount={totalCount}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="flex-1">
            <Search
              placeholder="Search characters..."
              size="md"
              variant="filled"
              className="w-full"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>
          <CharacterSortBar
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortByChange={setSortBy}
            onToggleSortOrder={toggleSortOrder}
          />
        </div>

        {/* Character Grid */}
        {filteredCharacters.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredCharacters.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  index={index}
                />
              ))}
            </div>

            {hasActiveFilters && filteredCount < totalCount && (
              <div className="mt-6 text-center">
                <Typography variant="caption" textColor="tertiary">
                  Showing {filteredCount} of {totalCount} characters
                </Typography>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No characters found"
            description={
              hasActiveFilters
                ? "Try adjusting your filters or search query."
                : "No characters are available yet."
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
