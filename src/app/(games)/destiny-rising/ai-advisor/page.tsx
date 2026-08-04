import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { AdvisorClient } from "./AdvisorClient";
import { Brain, Sparkles, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Advisor",
  description: "Get personalized recommendations for builds, weapons, teams, materials, and progression. Tell us your character and we'll tell you what to do next.",
};

export default function AIAdvisorPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "AI Advisor" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1">AI Advisor</Typography>
          <Badge variant="accent" className="gap-1">
            <Sparkles className="h-3 w-3" />
            v1
          </Badge>
        </div>
        <Typography variant="body" textColor="secondary" className="max-w-2xl">
          Select your character and get personalized recommendations for the best build,
          weapon, team, materials, and progression path. Powered by rule-based analysis engine.
        </Typography>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-2">
            <Brain className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Smart Analysis</Typography>
            <Typography variant="caption" textColor="tertiary">
              Analyzes builds, weapons, teams, and synergy
            </Typography>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-accent)/0.1)] p-2">
            <Target className="h-5 w-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Actionable Tips</Typography>
            <Typography variant="caption" textColor="tertiary">
              Clear progression path with time estimates
            </Typography>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-secondary)/0.1)] p-2">
            <Sparkles className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Alternatives</Typography>
            <Typography variant="caption" textColor="tertiary">
              F2P options and different playstyles
            </Typography>
          </div>
        </div>
      </div>

      {/* Advisor Client */}
      <AdvisorClient />
    </>
  );
}
