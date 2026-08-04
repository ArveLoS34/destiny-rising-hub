import { Typography } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Character } from "@/types/domain";
import { Package, ArrowUp, Sparkles, Layers } from "lucide-react";

interface CharacterMaterialsProps {
  character: Character;
}

const purposeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  ascension: ArrowUp,
  skill: Sparkles,
  awakening: Layers,
  breakthrough: Package,
};

const purposeLabels: Record<string, string> = {
  ascension: "Ascension",
  skill: "Skill Upgrade",
  awakening: "Awakening",
  breakthrough: "Breakthrough",
};

export function CharacterMaterials({ character }: CharacterMaterialsProps) {
  const allMaterials = [...character.ascensionMaterials, ...character.skillMaterials];
  const groupedByPurpose = allMaterials.reduce(
    (acc, mat) => {
      if (!acc[mat.purpose]) acc[mat.purpose] = [];
      acc[mat.purpose].push(mat);
      return acc;
    },
    {} as Record<string, typeof allMaterials>
  );

  return (
    <div className="space-y-6">
      <Typography variant="h3">Upgrade Materials</Typography>

      {Object.entries(groupedByPurpose).map(([purpose, materials]) => {
        const Icon = purposeIcons[purpose] || Package;
        return (
          <div key={purpose} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-[rgb(var(--color-primary))]" />
              <Typography variant="bodySm" weight="semibold">
                {purposeLabels[purpose] || purpose}
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {materials.map((mat) => (
                <Card key={mat.materialId} variant="elevated" padding="sm">
                  <CardContent className="flex items-center justify-between p-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(var(--color-surface-overlay))]">
                        <Package className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
                      </div>
                      <div>
                        <Typography variant="bodySm" weight="medium">
                          {mat.name}
                        </Typography>
                        <Typography variant="caption" textColor="tertiary">
                          {purposeLabels[mat.purpose]}
                        </Typography>
                      </div>
                    </div>
                    <Badge variant="outline">×{mat.quantity}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Progression Info */}
      <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
        <Typography variant="bodySm" weight="semibold" className="mb-3">
          Progression
        </Typography>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Typography variant="caption" textColor="tertiary">Max Level</Typography>
            <Typography variant="bodySm" weight="semibold">{character.maxLevel}</Typography>
          </div>
          <div>
            <Typography variant="caption" textColor="tertiary">Max Ascension</Typography>
            <Typography variant="bodySm" weight="semibold">{character.maxAscension}</Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
