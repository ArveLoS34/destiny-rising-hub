"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { type HTMLAttributes, forwardRef } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator = <ChevronRight className="h-4 w-4" />, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
        <ol className="flex items-center gap-1.5 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isHome = index === 0 && item.href === "/";

            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span className="text-[rgb(var(--color-text-tertiary))]">
                    {separator}
                  </span>
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-[rgb(var(--color-text-secondary))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
                  >
                    {isHome && <Home className="h-3.5 w-3.5" />}
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "flex items-center gap-1",
                      isLast
                        ? "font-medium text-[rgb(var(--color-text-primary))]"
                        : "text-[rgb(var(--color-text-secondary))]"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {isHome && <Home className="h-3.5 w-3.5" />}
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
export type { BreadcrumbProps, BreadcrumbItem };
