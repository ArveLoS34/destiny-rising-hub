"use client";

import { useState, useMemo } from "react";
import { Typography } from "@/components/ui/Typography";
import { Search } from "@/components/ui/Search";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { BuildCard } from "@/features/builds/components/cards/BuildCard";
import { filterBuilds } from "@/features/builds/services/build-service";
import type { BuildSummary, BuildFilters, BuildSortField, BuildType } from "@/types/domain";
import { defaultBuildFilters } from "@/types/domain";
import { SearchX, Filter, X } from "lucide-react";

interface BuildListClientProps {
  builds: BuildSummary[];
  filterOptions: {
    characters: { id: string; name: string; slug: string }[];
    buildTypes: string[];
    difficulties: string[];
    priorities: string[];
  };
}

export function BuildListClient({ builds, filterOptions }: BuildListClientProps) {
  const [filters, setFilters] = useState<BuildFilters>(defaultBuildFilters);
  const [search, setSearch] = useState("");

  const filteredBuilds = useMemo(() => {
    return filterBuilds(builds, { ...filters, search });
  }, [builds, filters, search]);

  const toggleCharacter = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      characterIds: prev.characterIds.includes(id)
        ? prev.characterIds.filter((c) => c !== id)
        : [...prev.characterIds, id],
    }));
  };

  const toggleBuildType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      buildTypes: prev.buildTypes.includes(type as BuildFilters["buildTypes"][number])
        ? prev.buildTypes.filter((t) => t !== type)
        : [...prev.buildTypes, type as BuildFilters["buildTypes"][number]],
    }));
  };

  const hasFilters = filters.characterIds.length > 0 || filters.buildTypes.length > 0 || search.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Search
            placeholder="Search builds..."
            size="md"
            variant="filled"
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-[rgb(var(--color-surface-elevated))] p-0.5">
            {(["popularity", "rating", "score", "tier", "difficulty"] as BuildSortField[]).map((sort) => (
              <button
                key={sort}
                onClick={() => setFilters((prev) => ({ ...prev, sortBy: sort }))}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  filters.sortBy === sort
                    ? "bg-[rgb(var(--color-surface-overlay))] text-[rgb(var(--color-text-primary))]"
                    : "text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))]"
                }`}
              >
                {sort === "score" ? "Score" : sort.charAt(0).toUpperCase() + sort.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Character Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
          <Typography variant="bodySm" weight="medium">Character</Typography>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.characters.map((char) => (
            <Chip
              key={char.id}
              variant={filters.characterIds.includes(char.id) ? "active" : "interactive"}
              size="md"
              onClick={() => toggleCharacter(char.id)}
              className="cursor-pointer"
            >
              {char.name}
            </Chip>
          ))}
        </div>
      </div>

      {/* Build Type Filter */}
      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">
          Build Type
        </Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.buildTypes.map((type) => (
            <Chip
              key={type}
              variant={filters.buildTypes.includes(type as BuildType) ? "active" : "interactive"}
              size="md"
              onClick={() => toggleBuildType(type)}
              className="cursor-pointer"
            >
              {type}
            </Chip>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <Typography variant="bodySm" textColor="secondary">
          Showing {filteredBuilds.length} of {builds.length} builds
        </Typography>
        {hasFilters && (
          <button
            onClick={() => { setFilters(defaultBuildFilters); setSearch(""); }}
            className="flex items-center gap-1 text-xs text-[rgb(var(--color-primary))] hover:underline"
          >
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Build Grid */}
      {filteredBuilds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuilds.map((build, index) => (
            <BuildCard key={build.id} build={build} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No builds found"
          description="Try adjusting your filters or search query."
        />
      )}
    </div>
  );
}
