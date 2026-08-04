"use client";

import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { WeaponSummary } from "@/types/domain";
import { Package, ArrowUp } from "lucide-react";

interface WeaponMaterialsProps {
  weapon: WeaponSummary;
}

// Materials data - in production this would come from the weapon detail data
const materials = {
  ascension: [
    { name: "Weapon Core Fragment", quantity: 6 },
    { name: "Elemental Crystal", quantity: 24 },
    { name: "Boss Material", quantity: 4 },
  ],
  upgrade: [
    { name: "Enhancement Ore", quantity: 120 },
    { name: "Gold", quantity: 800000 },
  ],
};

export function WeaponMaterials({}: WeaponMaterialsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-[rgb(var(--color-primary))]" />
            <Typography variant="h4">Ascension Materials</Typography>
          </div>
          <div className="space-y-2">
            {materials.ascension.map((mat, i) => (
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

      <Card>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[rgb(var(--color-accent))]" />
            <Typography variant="h4">Upgrade Materials</Typography>
          </div>
          <div className="space-y-2">
            {materials.upgrade.map((mat, i) => (
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
