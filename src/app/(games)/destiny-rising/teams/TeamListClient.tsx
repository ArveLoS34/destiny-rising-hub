"use client";

import { useState, useMemo } from "react";
import { Typography } from "@/components/ui/Typography";
import { Search } from "@/components/ui/Search";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { TeamCard } from "@/features/teams/components/cards/TeamCard";
import { filterTeams } from "@/features/teams/services/team-service";
import type { TeamSummary, TeamFilters, TeamSortField, TeamTemplate } from "@/types/domain";
import { defaultTeamFilters } from "@/types/domain";
import { SearchX, Filter, X } from "lucide-react";

interface TeamListClientProps {
  teams: TeamSummary[];
  filterOptions: {
    templates: string[];
    elements: string[];
  };
}

export function TeamListClient({ teams, filterOptions }: TeamListClientProps) {
  const [filters, setFilters] = useState<TeamFilters>(defaultTeamFilters);
  const [search, setSearch] = useState("");

  const filteredTeams = useMemo(() => {
    return filterTeams(teams, { ...filters, search });
  }, [teams, filters, search]);

  const toggleTemplate = (template: string) => {
    setFilters((prev) => ({
      ...prev,
      templates: prev.templates.includes(template as TeamFilters["templates"][number])
        ? prev.templates.filter((t) => t !== template)
        : [...prev.templates, template as TeamFilters["templates"][number]],
    }));
  };

  const hasFilters = filters.templates.length > 0 || search.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Search
            placeholder="Search teams..."
            size="md"
            variant="filled"
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-[rgb(var(--color-surface-elevated))] p-0.5">
          {(["popularity", "rating", "score", "tier"] as TeamSortField[]).map((sort) => (
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

      {/* Template Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
          <Typography variant="bodySm" weight="medium">Template</Typography>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.templates.map((template) => (
            <Chip
              key={template}
              variant={filters.templates.includes(template as TeamTemplate) ? "active" : "interactive"}
              size="md"
              onClick={() => toggleTemplate(template)}
              className="cursor-pointer"
            >
              {template}
            </Chip>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <Typography variant="bodySm" textColor="secondary">
          Showing {filteredTeams.length} of {teams.length} teams
        </Typography>
        {hasFilters && (
          <button
            onClick={() => { setFilters(defaultTeamFilters); setSearch(""); }}
            className="flex items-center gap-1 text-xs text-[rgb(var(--color-primary))] hover:underline"
          >
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Team Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team, index) => (
            <TeamCard key={team.id} team={team} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No teams found"
          description="Try adjusting your filters or search query."
        />
      )}
    </div>
  );
}
