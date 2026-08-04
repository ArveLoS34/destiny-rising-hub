"use client";

import { useState, useMemo } from "react";
import { Typography } from "@/components/ui/Typography";
import { Search } from "@/components/ui/Search";
import { Chip } from "@/components/ui/Chip";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { filterMaterialSummaries } from "@/features/materials/services/material-service";
import type { MaterialSummary, MaterialFilters, MaterialCategory, MaterialRarity, MaterialSource } from "@/types/domain";
import { defaultMaterialFilters } from "@/types/domain";
import { SearchX, Filter, X, MapPin, Clock, Repeat } from "lucide-react";
import Link from "next/link";

interface MaterialListClientProps {
  materials: MaterialSummary[];
  filterOptions: {
    categories: MaterialCategory[];
    rarities: MaterialRarity[];
    sources: MaterialSource[];
  };
}

const rarityColors: Record<string, string> = {
  common: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  uncommon: "bg-green-500/20 text-green-400 border-green-500/30",
  rare: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  epic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  legendary: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export function MaterialListClient({ materials, filterOptions }: MaterialListClientProps) {
  const [filters, setFilters] = useState<MaterialFilters>(defaultMaterialFilters);

  const filteredMaterials = useMemo(() => {
    return filterMaterialSummaries(materials, filters);
  }, [materials, filters]);

  const toggleCategory = (category: MaterialCategory) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleRarity = (rarity: MaterialRarity) => {
    setFilters((prev) => ({
      ...prev,
      rarities: prev.rarities.includes(rarity)
        ? prev.rarities.filter((r) => r !== rarity)
        : [...prev.rarities, rarity],
    }));
  };

  const hasFilters = filters.categories.length > 0 || filters.rarities.length > 0 || filters.search.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Search */}
      <Search
        placeholder="Search materials..."
        size="md"
        variant="filled"
        className="w-full"
        value={filters.search}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        onClear={() => setFilters((prev) => ({ ...prev, search: "" }))}
      />

      {/* Category Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
          <Typography variant="bodySm" weight="medium">Category</Typography>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.categories.map((category) => (
            <Chip
              key={category}
              variant={filters.categories.includes(category) ? "active" : "interactive"}
              size="md"
              onClick={() => toggleCategory(category)}
              className="cursor-pointer capitalize"
            >
              {category}
            </Chip>
          ))}
        </div>
      </div>

      {/* Rarity Filter */}
      <div className="space-y-2">
        <Typography variant="caption" textColor="tertiary" className="font-medium uppercase tracking-wider">
          Rarity
        </Typography>
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.rarities.map((rarity) => (
            <Chip
              key={rarity}
              variant={filters.rarities.includes(rarity) ? "active" : "interactive"}
              size="md"
              onClick={() => toggleRarity(rarity)}
              className="cursor-pointer capitalize"
            >
              {rarity}
            </Chip>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <Typography variant="bodySm" textColor="secondary">
          Showing {filteredMaterials.length} of {materials.length} materials
        </Typography>
        {hasFilters && (
          <button
            onClick={() => setFilters(defaultMaterialFilters)}
            className="flex items-center gap-1 text-xs text-[rgb(var(--color-primary))] hover:underline"
          >
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Material Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((material) => (
            <Link
              key={material.id}
              href={`/destiny-rising/materials/${material.slug}`}
              className="group"
            >
              <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 transition-all hover:border-[rgb(var(--color-border-hover))] hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${rarityColors[material.rarity]}`}>
                    <Typography variant="h4" weight="bold">
                      {material.name.charAt(0)}
                    </Typography>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Typography variant="body" weight="semibold" className="truncate">
                        {material.name}
                      </Typography>
                      <Badge variant={material.rarity === "legendary" ? "warning" : material.rarity === "epic" ? "primary" : "outline"} className="text-[10px] capitalize">
                        {material.rarity}
                      </Badge>
                    </div>
                    <Typography variant="caption" textColor="tertiary" className="capitalize block mb-2">
                      {material.category}
                    </Typography>

                    {/* Source Info */}
                    {material.sources.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[rgb(var(--color-text-tertiary))]" />
                          <Typography variant="caption" textColor="secondary" className="truncate">
                            {material.sources[0].location}
                          </Typography>
                        </div>
                        {material.isWeekly && (
                          <div className="flex items-center gap-1">
                            <Repeat className="h-3 w-3 text-[rgb(var(--color-warning))]" />
                            <Typography variant="caption" textColor="warning">
                              Weekly
                            </Typography>
                          </div>
                        )}
                        {material.isDaily && !material.isWeekly && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[rgb(var(--color-text-tertiary))]" />
                            <Typography variant="caption" textColor="secondary">
                              Daily
                            </Typography>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No materials found"
          description="Try adjusting your filters or search query."
        />
      )}
    </div>
  );
}
