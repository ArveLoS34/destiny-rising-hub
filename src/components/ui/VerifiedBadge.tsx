import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[rgb(var(--color-success)/0.35)] bg-[rgb(var(--color-success)/0.12)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-success))]",
        className
      )}
    >
      <BadgeCheck className="h-3 w-3" />
      Verified
    </span>
  );
}
