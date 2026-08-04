import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { getMaterialSummaries, getMaterialCount, getMaterialFilterOptions } from "@/features/materials/services/material-service";
import { MaterialListClient } from "./MaterialListClient";
import { Package, Star, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Materials",
  description: "Complete material database with drop locations, respawn times, and usage information for Destiny Rising.",
};

export default function MaterialsPage() {
  const materialList = getMaterialSummaries();
  const count = getMaterialCount();
  const filterOptions = getMaterialFilterOptions();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "Materials" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1">Materials</Typography>
          <Badge variant="primary">{count}</Badge>
        </div>
        <Typography variant="body" textColor="secondary" className="max-w-2xl">
          Complete material database with drop locations, respawn timers, and usage information.
          Plan your farming routes efficiently.
        </Typography>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-2">
            <Package className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">{count}</Typography>
            <Typography variant="caption" textColor="tertiary">Total Materials</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-accent)/0.1)] p-2">
            <Star className="h-5 w-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">{filterOptions.categories.length}</Typography>
            <Typography variant="caption" textColor="tertiary">Categories</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-secondary)/0.1)] p-2">
            <Zap className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">{filterOptions.sources.length}</Typography>
            <Typography variant="caption" textColor="tertiary">Sources</Typography>
          </div>
        </div>
      </div>

      <MaterialListClient materials={materialList} filterOptions={filterOptions} />
    </>
  );
}
