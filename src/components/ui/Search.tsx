"use client";

import { cn } from "@/lib/utils";
import { Search as SearchIcon, X } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";
import { type VariantProps, cva } from "class-variance-authority";

const searchVariants = cva("relative flex items-center", {
  variants: {
    size: {
      sm: "h-8",
      md: "h-10",
      lg: "h-12",
    },
    variant: {
      default:
        "border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] rounded-lg focus-within:border-[rgb(var(--color-primary))] focus-within:ring-1 focus-within:ring-[rgb(var(--color-primary)/0.3)]",
      filled:
        "bg-[rgb(var(--color-surface-elevated))] rounded-lg focus-within:bg-[rgb(var(--color-surface-overlay))] focus-within:ring-1 focus-within:ring-[rgb(var(--color-primary))] focus-within:border-transparent",
      ghost:
        "rounded-lg focus-within:bg-[rgb(var(--color-surface-elevated))] focus-within:border-transparent",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

interface SearchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof searchVariants> {
  onClear?: () => void;
}

const Search = forwardRef<HTMLInputElement, SearchProps>(
  ({ className, size, variant, onClear, value, ...props }, ref) => {
    return (
      <div className={cn(searchVariants({ size, variant, className }))}>
        <SearchIcon className="absolute left-3 h-4 w-4 text-[rgb(var(--color-text-tertiary))]" />
        <input
          ref={ref}
          type="search"
          className={cn(
            "h-full w-full bg-transparent pl-9 pr-8 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none"
          )}
          value={value}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 rounded-md p-1 text-[rgb(var(--color-text-tertiary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);
Search.displayName = "Search";

export { Search };
export type { SearchProps };
