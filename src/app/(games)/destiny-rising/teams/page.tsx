import { Metadata } from "next";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { getAllTeams, getTeamCount, getTeamFilterOptions } from "@/features/teams/services/team-service";
import { TeamListClient } from "./TeamListClient";
import { TeamComparisonPanel } from "./TeamComparisonClient";
import { Shield, Users, Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "Team Builder",
  description: "Build the perfect team for any content. Synergy engine, team comparison, and pre-built templates for Boss, Raid, PvP, and more.",
};

export default function TeamsPage() {
  const allTeams = getAllTeams();
  const count = getTeamCount();
  const filterOptions = getTeamFilterOptions();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "Team Builder" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1">Team Builder</Typography>
          <Badge variant="accent">New</Badge>
          <Badge variant="primary">{count} teams</Badge>
        </div>
        <Typography variant="body" textColor="secondary" className="max-w-2xl">
          Find the optimal team for any content. Synergy engine calculates character compatibility,
          team comparison helps you choose, and templates give you a head start.
        </Typography>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-2">
            <Users className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">{count}</Typography>
            <Typography variant="caption" textColor="tertiary">Team Templates</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-accent)/0.1)] p-2">
            <Shield className="h-5 w-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">v1</Typography>
            <Typography variant="caption" textColor="tertiary">Synergy Engine</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-secondary)/0.1)] p-2">
            <Brain className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">v2</Typography>
            <Typography variant="caption" textColor="tertiary">Recommendation</Typography>
          </div>
        </div>
      </div>

      {/* Team List */}
      <TeamListClient teams={allTeams} filterOptions={filterOptions} />

      {/* Team Comparison */}
      <div className="mt-12">
        <TeamComparisonPanel teams={allTeams} />
      </div>
    </>
  );
}
