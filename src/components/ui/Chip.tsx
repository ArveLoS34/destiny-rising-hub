import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]",
        primary:
          "bg-[rgb(var(--color-primary)/0.15)] text-[rgb(var(--color-primary))]",
        interactive:
          "bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))] cursor-pointer hover:bg-[rgb(var(--color-surface-overlay))] hover:text-[rgb(var(--color-text-primary))]",
        active:
          "bg-[rgb(var(--color-primary))] text-white",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface ChipProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  icon?: React.ComponentType<{ className?: string }>;
}

const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant, size, icon: Icon, children, ...props }, ref) => {
    return (
      <span
        className={cn(chipVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {Icon && <Icon className="h-3 w-3" />}
        {children}
      </span>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
export type { ChipProps };
