import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { PlannerClient } from "./PlannerClient";
import { Target, Calendar, Zap, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Resource Planner",
  description: "Plan your character and weapon progression. Calculate material requirements, energy costs, and daily tasks automatically.",
};

export default function PlannerPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "Resource Planner" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1">Resource Planner</Typography>
          <Badge variant="accent">Beta</Badge>
        </div>
        <Typography variant="body" textColor="secondary" className="max-w-2xl">
          Set your progression goals and get a complete farming plan with material requirements,
          energy costs, daily tasks, and time estimates.
        </Typography>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-2">
            <Target className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Set Goals</Typography>
            <Typography variant="caption" textColor="tertiary">
              Characters, weapons, builds
            </Typography>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-accent)/0.1)] p-2">
            <Zap className="h-5 w-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Calculate</Typography>
            <Typography variant="caption" textColor="tertiary">
              Materials & energy needed
            </Typography>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-secondary)/0.1)] p-2">
            <Calendar className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Daily Plan</Typography>
            <Typography variant="caption" textColor="tertiary">
              What to farm today
            </Typography>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-success)/0.1)] p-2">
            <TrendingUp className="h-5 w-5 text-[rgb(var(--color-success))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Track</Typography>
            <Typography variant="caption" textColor="tertiary">
              Weekly progress
            </Typography>
          </div>
        </div>
      </div>

      {/* Planner Client */}
      <PlannerClient />
    </>
  );
}
