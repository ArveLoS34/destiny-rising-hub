"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { CharacterSortField, CharacterFilters } from "@/types/domain";

interface CharacterSortBarProps {
  sortBy: CharacterSortField;
  sortOrder: "asc" | "desc";
  onSortByChange: (sortBy: CharacterSortField) => void;
  onToggleSortOrder: () => void;
}

const sortOptions: { value: CharacterSortField; label: string }[] = [
  { value: "popularity", label: "Popular" },
  { value: "winRate", label: "Win Rate" },
  { value: "tierList", label: "Tier" },
  { value: "rarity", label: "Rarity" },
  { value: "name", label: "Name" },
  { value: "releaseDate", label: "Newest" },
];

export function CharacterSortBar({
  sortBy,
  sortOrder,
  onSortByChange,
  onToggleSortOrder,
}: CharacterSortBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Typography variant="caption" textColor="tertiary" className="hidden sm:block">
        Sort:
      </Typography>
      <div className="flex items-center gap-1 rounded-lg bg-[rgb(var(--color-surface-elevated))] p-0.5">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSortByChange(option.value)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              sortBy === option.value
                ? "bg-[rgb(var(--color-surface-overlay))] text-[rgb(var(--color-text-primary))]"
                : "text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))]"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleSortOrder}
        className="h-7 w-7"
        aria-label={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
      >
        {sortOrder === "desc" ? (
          <ArrowDown className="h-3.5 w-3.5" />
        ) : (
          <ArrowUp className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}
