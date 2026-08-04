import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-primary))]",
        primary:
          "border-transparent bg-[rgb(var(--color-primary)/0.15)] text-[rgb(var(--color-primary))] [&_svg]:text-[rgb(var(--color-primary))]",
        secondary:
          "border-transparent bg-[rgb(var(--color-secondary)/0.15)] text-[rgb(var(--color-secondary))]",
        accent:
          "border-transparent bg-[rgb(var(--color-accent)/0.15)] text-[rgb(var(--color-accent))]",
        success:
          "border-transparent bg-[rgb(var(--color-success)/0.15)] text-[rgb(var(--color-success))]",
        warning:
          "border-transparent bg-[rgb(var(--color-warning)/0.15)] text-[rgb(var(--color-warning))]",
        error:
          "border-transparent bg-[rgb(var(--color-error)/0.15)] text-[rgb(var(--color-error))]",
        outline:
          "border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
export type { BadgeProps };
