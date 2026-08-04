import { Metadata } from "next";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { getAllWeapons, getWeaponFilterOptions, getWeaponCount } from "@/features/weapons/services/weapon-service";
import { WeaponListClient } from "./WeaponListClient";
import { Sword, Target, Factory } from "lucide-react";

export const metadata: Metadata = {
  title: "Weapons",
  description:
    "Browse all Destiny Rising weapons — stats, perks, upgrade materials, recommended characters, and tier rankings. Filter by type, element, rarity, and manufacturer.",
  keywords: ["Destiny Rising", "weapons", "tier list", "builds", "database", "stats"],
};

export default function WeaponsPage() {
  const weapons = getAllWeapons();
  const filterOptions = getWeaponFilterOptions();
  const count = getWeaponCount();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "Weapons" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1">Weapons</Typography>
          <Badge variant="primary">{count}</Badge>
        </div>
        <Typography variant="body" textColor="secondary" className="max-w-2xl">
          Complete weapon database with stats, perks, upgrade paths, and character recommendations.
          All data verified against in-game sources.
        </Typography>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-2">
            <Sword className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">{count}</Typography>
            <Typography variant="caption" textColor="tertiary">Total Weapons</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-accent)/0.1)] p-2">
            <Target className="h-5 w-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">
              {filterOptions.weaponTypes.length}
            </Typography>
            <Typography variant="caption" textColor="tertiary">Weapon Types</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-secondary)/0.1)] p-2">
            <Factory className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">
              {filterOptions.manufacturers.length}
            </Typography>
            <Typography variant="caption" textColor="tertiary">Manufacturers</Typography>
          </div>
        </div>
      </div>

      <WeaponListClient
        weapons={weapons}
        filterOptions={filterOptions}
      />
    </>
  );
}
