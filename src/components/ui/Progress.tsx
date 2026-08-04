import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "gradient";
  progressSize?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const variantClasses = {
  primary: "bg-[rgb(var(--color-primary))]",
  secondary: "bg-[rgb(var(--color-secondary))]",
  accent: "bg-[rgb(var(--color-accent))]",
  success: "bg-[rgb(var(--color-success))]",
  warning: "bg-[rgb(var(--color-warning))]",
  error: "bg-[rgb(var(--color-error))]",
  gradient: "gradient-primary",
};

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, variant = "primary", progressSize = "md", value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-[rgb(var(--color-surface-elevated))]",
          sizeClasses[progressSize],
          className
        )}
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
export type { ProgressProps };
