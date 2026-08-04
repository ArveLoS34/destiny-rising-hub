import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { CombatLabClient } from "./CombatLabClient";
import { Sword, Brain, Zap, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Combat Lab",
  description: "Calculate damage, optimize builds, and simulate combat rotations with our advanced combat intelligence system.",
};

export default function CombatLabPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "Combat Lab" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1">Combat Lab</Typography>
          <Badge variant="accent" className="gap-1">
            <Brain className="h-3 w-3" />
            AI Powered
          </Badge>
        </div>
        <Typography variant="body" textColor="secondary" className="max-w-2xl">
          Advanced combat intelligence system. Calculate damage, optimize artifacts,
          simulate rotations, and get AI-powered build recommendations with explanations.
        </Typography>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-2">
            <Sword className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Damage Calculator</Typography>
            <Typography variant="caption" textColor="tertiary">
              Calculate DPS with full stat breakdown
            </Typography>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-accent)/0.1)] p-2">
            <Zap className="h-5 w-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Build Sandbox</Typography>
            <Typography variant="caption" textColor="tertiary">
              Real-time build optimization
            </Typography>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-secondary)/0.1)] p-2">
            <Target className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Artifact Optimizer</Typography>
            <Typography variant="caption" textColor="tertiary">
              Find optimal artifact combinations
            </Typography>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-success)/0.1)] p-2">
            <Brain className="h-5 w-5 text-[rgb(var(--color-success))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">AI Advisor v2</Typography>
            <Typography variant="caption" textColor="tertiary">
              Explainable AI recommendations
            </Typography>
          </div>
        </div>
      </div>

      {/* Combat Lab Client */}
      <CombatLabClient />
    </>
  );
}
