"use client";

import { useMemo, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import type { WeaponSummary, WeaponFilters, WeaponSortField, WeaponType, Rarity, Element, DamageType } from "@/types/domain";
import { defaultWeaponFilters } from "@/types/domain";
import { filterWeapons } from "../services/weapon-service";

interface UseWeaponFiltersReturn {
  filters: WeaponFilters;
  filteredWeapons: WeaponSummary[];
  totalCount: number;
  filteredCount: number;
  setSearch: (search: string) => void;
  toggleWeaponType: (type: string) => void;
  toggleRarity: (rarity: string) => void;
  toggleElement: (element: string) => void;
  toggleDamageType: (type: string) => void;
  toggleManufacturer: (manufacturer: string) => void;
  setSortBy: (sortBy: WeaponSortField) => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export function useWeaponFilters(weapons: WeaponSummary[]): UseWeaponFiltersReturn {
  const [filters, setFilters] = useState<WeaponFilters>(defaultWeaponFilters);
  const debouncedSearch = useDebounce(filters.search, 300);

  const filteredWeapons = useMemo(() => {
    return filterWeapons(weapons, { ...filters, search: debouncedSearch });
  }, [weapons, filters, debouncedSearch]);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const toggleWeaponType = useCallback((type: string) => {
    setFilters((prev) => ({
      ...prev,
      weaponTypes: prev.weaponTypes.includes(type as WeaponType)
        ? prev.weaponTypes.filter((t) => t !== type)
        : [...prev.weaponTypes, type as WeaponType],
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

  const toggleElement = useCallback((element: string) => {
    setFilters((prev) => ({
      ...prev,
      elements: prev.elements.includes(element as Element)
        ? prev.elements.filter((e) => e !== element)
        : [...prev.elements, element as Element],
    }));
  }, []);

  const toggleDamageType = useCallback((type: string) => {
    setFilters((prev) => ({
      ...prev,
      damageTypes: prev.damageTypes.includes(type as DamageType)
        ? prev.damageTypes.filter((t) => t !== type)
        : [...prev.damageTypes, type as DamageType],
    }));
  }, []);

  const toggleManufacturer = useCallback((manufacturer: string) => {
    setFilters((prev) => ({
      ...prev,
      manufacturers: prev.manufacturers.includes(manufacturer)
        ? prev.manufacturers.filter((m) => m !== manufacturer)
        : [...prev.manufacturers, manufacturer],
    }));
  }, []);

  const setSortBy = useCallback((sortBy: WeaponSortField) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setFilters((prev) => ({ ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultWeaponFilters);
  }, []);

  const hasActiveFilters =
    filters.weaponTypes.length > 0 ||
    filters.rarities.length > 0 ||
    filters.elements.length > 0 ||
    filters.damageTypes.length > 0 ||
    filters.manufacturers.length > 0 ||
    filters.search.trim() !== "" ||
    filters.sortBy !== defaultWeaponFilters.sortBy;

  const activeFilterCount =
    filters.weaponTypes.length +
    filters.rarities.length +
    filters.elements.length +
    filters.damageTypes.length +
    filters.manufacturers.length +
    (filters.search.trim() ? 1 : 0);

  return {
    filters,
    filteredWeapons,
    totalCount: weapons.length,
    filteredCount: filteredWeapons.length,
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
  };
}
