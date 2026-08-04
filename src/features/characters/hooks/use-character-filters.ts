"use client";

import { useMemo, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import type { CharacterSummary, CharacterFilters, CharacterSortField, Element, Role, Rarity, WeaponType, Faction } from "@/types/domain";
import { defaultCharacterFilters } from "@/types/domain";
import { filterCharacters } from "../services/character-service";

interface UseCharacterFiltersReturn {
  filters: CharacterFilters;
  filteredCharacters: CharacterSummary[];
  totalCount: number;
  filteredCount: number;
  setSearch: (search: string) => void;
  toggleElement: (element: string) => void;
  toggleRole: (role: string) => void;
  toggleRarity: (rarity: string) => void;
  toggleWeaponType: (weaponType: string) => void;
  toggleFaction: (faction: string) => void;
  setSortBy: (sortBy: CharacterSortField) => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export function useCharacterFilters(characters: CharacterSummary[]): UseCharacterFiltersReturn {
  const [filters, setFilters] = useState<CharacterFilters>(defaultCharacterFilters);
  const debouncedSearch = useDebounce(filters.search, 300);

  const filteredCharacters = useMemo(() => {
    return filterCharacters(characters, { ...filters, search: debouncedSearch });
  }, [characters, filters, debouncedSearch]);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const toggleElement = useCallback((element: string) => {
    setFilters((prev) => ({
      ...prev,
      elements: prev.elements.includes(element as Element)
        ? prev.elements.filter((e) => e !== element)
        : [...prev.elements, element as Element],
    }));
  }, []);

  const toggleRole = useCallback((role: string) => {
    setFilters((prev) => ({
      ...prev,
      roles: prev.roles.includes(role as Role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role as Role],
    }));
  }, []);

  const toggleRarity = useCallback((rarity: string) => {
    setFilters((prev) => ({
      ...prev,
      rarities: prev.rarities.includes(rarity as Rarity)
        ? prev.rarities.filter((r) => r !== rarity)
        : [...prev.rarities, rarity as Rarity],
    }));
  }, []);

  const toggleWeaponType = useCallback((weaponType: string) => {
    setFilters((prev) => ({
      ...prev,
      weaponTypes: prev.weaponTypes.includes(weaponType as WeaponType)
        ? prev.weaponTypes.filter((w) => w !== weaponType)
        : [...prev.weaponTypes, weaponType as WeaponType],
    }));
  }, []);

  const toggleFaction = useCallback((faction: string) => {
    setFilters((prev) => ({
      ...prev,
      factions: prev.factions.includes(faction as Faction)
        ? prev.factions.filter((f) => f !== faction)
        : [...prev.factions, faction as Faction],
    }));
  }, []);

  const setSortBy = useCallback((sortBy: CharacterSortField) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setFilters((prev) => ({ ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultCharacterFilters);
  }, []);

  const hasActiveFilters =
    filters.elements.length > 0 || filters.roles.length > 0 || filters.rarities.length > 0 ||
    filters.weaponTypes.length > 0 || filters.factions.length > 0 ||
    filters.search.trim() !== "" || filters.sortBy !== defaultCharacterFilters.sortBy;

  const activeFilterCount =
    filters.elements.length + filters.roles.length + filters.rarities.length +
    filters.weaponTypes.length + filters.factions.length + (filters.search.trim() ? 1 : 0);

  return {
    filters, filteredCharacters,
    totalCount: characters.length, filteredCount: filteredCharacters.length,
    setSearch, toggleElement, toggleRole, toggleRarity, toggleWeaponType, toggleFaction,
    setSortBy, toggleSortOrder, resetFilters, hasActiveFilters, activeFilterCount,
  };
}
