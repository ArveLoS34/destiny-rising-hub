"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { type HTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";

const loadingStateVariants = cva("flex flex-col items-center justify-center", {
  variants: {
    size: {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
      fullscreen: "fixed inset-0 z-[var(--z-overlay)] bg-[rgb(var(--color-background)/0.9)]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: "sm" | "md" | "lg" | "fullscreen";
}

const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ className, message, size, ...props }, ref) => {
    return (
      <div
        className={cn(loadingStateVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        <Loader2 className="h-8 w-8 animate-spin text-[rgb(var(--color-primary))]" />
        {message && (
          <p className="mt-4 text-sm text-[rgb(var(--color-text-secondary))]">
            {message}
          </p>
        )}
      </div>
    );
  }
);
LoadingState.displayName = "LoadingState";

export { LoadingState };
export type { LoadingStateProps };
