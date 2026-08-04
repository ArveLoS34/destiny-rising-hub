"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { type HTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Button } from "./Button";

const paginationVariants = cva("flex items-center justify-center gap-1", {
  variants: {
    size: {
      sm: "gap-0.5",
      md: "gap-1",
      lg: "gap-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  size?: "sm" | "md" | "lg";
}

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ className, currentPage, totalPages, onPageChange, siblingCount = 1, size, ...props }, ref) => {
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const leftSibling = Math.max(currentPage - siblingCount, 1);
      const rightSibling = Math.min(currentPage + siblingCount, totalPages);

      const showLeftDots = leftSibling > 2;
      const showRightDots = rightSibling < totalPages - 1;

      if (!showLeftDots && showRightDots) {
        const leftRange = 3 + 2 * siblingCount;
        for (let i = 1; i <= leftRange; i++) {
          pages.push(i);
        }
        pages.push("dots");
        pages.push(totalPages);
      } else if (showLeftDots && !showRightDots) {
        pages.push(1);
        pages.push("dots");
        const rightRange = 3 + 2 * siblingCount;
        for (let i = totalPages - rightRange + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else if (showLeftDots && showRightDots) {
        pages.push(1);
        pages.push("dots-left");
        for (let i = leftSibling; i <= rightSibling; i++) {
          pages.push(i);
        }
        pages.push("dots-right");
        pages.push(totalPages);
      } else {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      }

      return pages;
    };

    const pages = getPageNumbers();

    return (
      <nav ref={ref} aria-label="Pagination" className={className} {...props}>
        <div className={cn(paginationVariants({ size }))}>
          <Button
            variant="outline"
            size={size === "sm" ? "icon-sm" : "icon"}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pages.map((page, index) => {
            if (typeof page === "string") {
              return (
                <span
                  key={`dots-${index}`}
                  className="flex h-8 w-8 items-center justify-center text-[rgb(var(--color-text-tertiary))]"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                size={size === "sm" ? "icon-sm" : "icon"}
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size={size === "sm" ? "icon-sm" : "icon"}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </nav>
    );
  }
);
Pagination.displayName = "Pagination";

export { Pagination };
export type { PaginationProps };
