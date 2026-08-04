"use client";

import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Zap, Sword, Star, Shield, ArrowRightLeft, Clock } from "lucide-react";

interface RotationStep {
  id: string;
  order: number;
  action: string;
  skillName: string;
  skillType: "basic" | "skill" | "ultimate" | "passive" | "swap" | "wait";
  duration: string;
  description: string;
  isKeyStep: boolean;
}

interface RotationTimelineProps {
  steps: RotationStep[];
  description?: string;
}

const skillIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  basic: Sword,
  skill: Zap,
  ultimate: Star,
  passive: Shield,
  swap: ArrowRightLeft,
  wait: Clock,
};

const skillColors: Record<string, string> = {
  basic: "bg-[rgb(var(--color-surface-elevated))] border-[rgb(var(--color-border))]",
  skill: "bg-[rgb(var(--color-primary)/0.1)] border-[rgb(var(--color-primary)/0.3)]",
  ultimate: "bg-[rgb(var(--color-accent)/0.1)] border-[rgb(var(--color-accent)/0.3)]",
  passive: "bg-[rgb(var(--color-success)/0.1)] border-[rgb(var(--color-success)/0.3)]",
  swap: "bg-[rgb(var(--color-warning)/0.1)] border-[rgb(var(--color-warning)/0.3)]",
  wait: "bg-[rgb(var(--color-surface-elevated))] border-[rgb(var(--color-border))]",
};

export function RotationTimeline({ steps, description }: RotationTimelineProps) {
  return (
    <Card padding="md">
      <div className="space-y-4">
        {description && (
          <Typography variant="bodySm" textColor="secondary">{description}</Typography>
        )}

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[rgb(var(--color-border))]" />

          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = skillIcons[step.skillType] || Zap;
              const colorClass = skillColors[step.skillType] || skillColors.basic;

              return (
                <div key={step.id} className="relative flex items-start gap-4 pl-2">
                  {/* Timeline Dot */}
                  <div className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                    colorClass,
                    step.isKeyStep && "ring-2 ring-[rgb(var(--color-primary)/0.5)]"
                  )}>
                    <Icon className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
                  </div>

                  {/* Content */}
                  <div className={cn(
                    "flex-1 rounded-lg border border-[rgb(var(--color-border))] p-3",
                    step.isKeyStep && "border-[rgb(var(--color-primary)/0.3)] bg-[rgb(var(--color-primary)/0.03)]"
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Typography variant="bodySm" weight="semibold">{step.skillName}</Typography>
                        {step.isKeyStep && (
                          <Badge variant="primary" className="text-[10px]">Key</Badge>
                        )}
                      </div>
                      <Typography variant="caption" textColor="tertiary">{step.duration}</Typography>
                    </div>
                    <Typography variant="caption" textColor="secondary">{step.description}</Typography>
                  </div>

                  {/* Step Number */}
                  <div className="absolute -left-3 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[rgb(var(--color-surface-overlay))] text-[9px] font-bold text-[rgb(var(--color-text-secondary))]">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
