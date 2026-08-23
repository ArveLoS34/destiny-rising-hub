import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  value,
  label,
  sublabel,
  accent = "primary",
  className,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  sublabel?: string;
  accent?: "primary" | "secondary" | "accent" | "success" | "warning";
  className?: string;
}) {
  const accentColor = `rgb(var(--color-${accent}))`;
  return (
    <div
      className={cn(
        "glass card-interactive group rounded-xl p-4 text-center",
        className
      )}
    >
      <div
        className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 15%, transparent)` }}
      >
        <Icon className="h-5 w-5" style={{ color: accentColor }} />
      </div>
      <p className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-[rgb(var(--color-text-secondary))]">{label}</p>
      {sublabel && (
        <p className="mt-1 text-[10px] uppercase tracking-wider text-[rgb(var(--color-text-tertiary))]">
          {sublabel}
        </p>
      )}
    </div>
  );
}
