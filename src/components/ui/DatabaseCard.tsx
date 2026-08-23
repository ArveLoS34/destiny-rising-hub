import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function DatabaseCard({
  icon: Icon,
  title,
  count,
  description,
  href,
  accent = "primary",
  className,
}: {
  icon: LucideIcon;
  title: string;
  count: string;
  description: string;
  href?: string;
  accent?: "primary" | "secondary" | "accent";
  className?: string;
}) {
  const accentColor = `rgb(var(--color-${accent}))`;
  const Wrapper = href ? Link : "div";

  return (
    <Wrapper
      href={href as string}
      className={cn(
        "glass card-interactive group relative block overflow-hidden rounded-xl p-5",
        !href && "cursor-default",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: accentColor }}
      />
      <div className="relative">
        <div
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 15%, transparent)` }}
        >
          <Icon className="h-5 w-5" style={{ color: accentColor }} />
        </div>
        <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">{title}</h3>
        <p className="mt-0.5 text-xs text-[rgb(var(--color-text-tertiary))]">{count}</p>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">{description}</p>
        {href ? (
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[rgb(var(--color-text-secondary))] transition-colors group-hover:text-[rgb(var(--color-primary-bright))]">
            View all
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        ) : (
          <span className="mt-4 inline-block text-xs font-medium text-[rgb(var(--color-text-tertiary))]">
            Page coming soon
          </span>
        )}
      </div>
    </Wrapper>
  );
}
