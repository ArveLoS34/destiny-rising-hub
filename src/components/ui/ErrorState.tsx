"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw, type LucideIcon } from "lucide-react";
import { type HTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Button } from "./Button";

const errorStateVariants = cva("flex flex-col items-center justify-center py-12 text-center", {
  variants: {
    size: {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  size?: "sm" | "md" | "lg";
}

const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      icon: Icon = AlertTriangle,
      title,
      description,
      onRetry,
      retryLabel = "Try Again",
      size,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(errorStateVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        <div className="mb-4 rounded-full bg-[rgb(var(--color-error)/0.1)] p-4">
          <Icon className="h-8 w-8 text-[rgb(var(--color-error))]" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[rgb(var(--color-text-primary))]">
          {title}
        </h3>
        {description && (
          <p className="mb-6 max-w-sm text-sm text-[rgb(var(--color-text-secondary))]">
            {description}
          </p>
        )}
        {onRetry && (
          <Button variant="outline" onClick={onRetry} icon={RefreshCw}>
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }
);
ErrorState.displayName = "ErrorState";

export { ErrorState };
export type { ErrorStateProps };
