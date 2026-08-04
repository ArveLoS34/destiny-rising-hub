"use client";

import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { WeaponSummary } from "@/types/domain";
import { Package, ArrowUp } from "lucide-react";

interface WeaponMaterialsProps {
  weapon: WeaponSummary;
}

// Mock materials data - in production this would come from the weapon detail data
const mockMaterials = {
  ascension: [
    { name: "Weapon Core Fragment", quantity: 6, rarity: "common" },
    { name: "Elemental Crystal", quantity: 24, rarity: "uncommon" },
    { name: "Boss Material", quantity: 4, rarity: "rare" },
  ],
  upgrade: [
    { name: "Enhancement Ore", quantity: 120, rarity: "common" },
    { name: "Gold", quantity: 800000, rarity: "common" },
  ],
};

export function WeaponMaterials({ weapon }: WeaponMaterialsProps) {
  return (
    <div className="space-y-4">
      {/* Ascension Materials */}
      <Card>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-[rgb(var(--color-primary))]" />
            <Typography variant="h4">Ascension Materials</Typography>
          </div>
          <div className="space-y-2">
            {mockMaterials.ascension.map((mat, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-[rgb(var(--color-surface-elevated))]"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-[rgb(var(--color-text-tertiary))]" />
                  <Typography variant="bodySm">{mat.name}</Typography>
                </div>
                <Badge variant="outline">×{mat.quantity}</Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Upgrade Materials */}
      <Card>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[rgb(var(--color-accent))]" />
            <Typography variant="h4">Upgrade Materials</Typography>
          </div>
          <div className="space-y-2">
            {mockMaterials.upgrade.map((mat, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-[rgb(var(--color-surface-elevated))]"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-[rgb(var(--color-text-tertiary))]" />
                  <Typography variant="bodySm">{mat.name}</Typography>
                </div>
                <Badge variant="outline">
                  {mat.name === "Gold" ? mat.quantity.toLocaleString() : `×${mat.quantity}`}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
