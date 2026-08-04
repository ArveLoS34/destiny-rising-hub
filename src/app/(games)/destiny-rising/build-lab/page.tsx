import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { getAllBuilds, getBuildCount, getBuildFilterOptions } from "@/features/builds/services/build-service";
import { BuildListClient } from "./BuildListClient";
import { BuildComparisonPanel } from "@/features/builds/components/comparison/BuildComparisonPanel";
import { FlaskConical, Trophy, Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "Build Lab",
  description: "Find the best builds for every character. AI-powered recommendations, build comparison, and combat rotation guides.",
};

export default function BuildLabPage() {
  const allBuilds = getAllBuilds();
  const count = getBuildCount();
  const filterOptions = getBuildFilterOptions();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "Build Lab" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1">Build Lab</Typography>
          <Badge variant="accent">Beta</Badge>
          <Badge variant="primary">{count} builds</Badge>
        </div>
        <Typography variant="body" textColor="secondary" className="max-w-2xl">
          Find the optimal build for every character. Rule-based recommendations, build comparison,
          and combat rotation guides — everything you need to play at your best.
        </Typography>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-2">
            <FlaskConical className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">{count}</Typography>
            <Typography variant="caption" textColor="tertiary">Total Builds</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-accent)/0.1)] p-2">
            <Trophy className="h-5 w-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">{filterOptions.characters.length}</Typography>
            <Typography variant="caption" textColor="tertiary">Characters</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-secondary)/0.1)] p-2">
            <Brain className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">v1</Typography>
            <Typography variant="caption" textColor="tertiary">Recommendation Engine</Typography>
          </div>
        </div>
      </div>

      {/* Build List */}
      <BuildListClient builds={allBuilds} filterOptions={filterOptions} />

      {/* Build Comparison */}
      <div className="mt-12">
        <BuildComparisonPanel builds={allBuilds} />
      </div>
    </>
  );
}
