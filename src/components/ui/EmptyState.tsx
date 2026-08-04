"use client";

import { cn } from "@/lib/utils";
import { FileX, Inbox, SearchX, type LucideIcon } from "lucide-react";
import { type HTMLAttributes, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";

const emptyStateVariants = cva("flex flex-col items-center justify-center py-12 text-center", {
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

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const defaultIcons = {
  FileX,
  Inbox,
  SearchX,
};

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon = defaultIcons.Inbox, title, description, action, size, ...props }, ref) => {
    return (
      <div
        className={cn(emptyStateVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        <div className="mb-4 rounded-full bg-[rgb(var(--color-surface-elevated))] p-4">
          <Icon className="h-8 w-8 text-[rgb(var(--color-text-tertiary))]" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[rgb(var(--color-text-primary))]">
          {title}
        </h3>
        {description && (
          <p className="mb-6 max-w-sm text-sm text-[rgb(var(--color-text-secondary))]">
            {description}
          </p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
export type { EmptyStateProps };
