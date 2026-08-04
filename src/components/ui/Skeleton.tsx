"use client";

import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";

const skeletonVariants = cva("animate-pulse rounded-lg bg-[rgb(var(--color-surface-elevated))]", {
  variants: {
    variant: {
      default: "",
      circle: "rounded-full",
      text: "h-4 rounded",
      card: "rounded-xl",
    },
    size: {
      sm: "h-4",
      md: "h-6",
      lg: "h-8",
      xl: "h-12",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(skeletonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
export type { SkeletonProps };
