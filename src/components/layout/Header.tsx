"use client";

import { cn } from "@/lib/utils";
import { Search, Menu, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Search as SearchInput } from "@/components/ui/Search";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useState } from "react";

export function Header() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] h-[var(--header-height)] border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-background)/0.8)] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-6">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]">
              <span className="text-sm font-bold text-white">DR</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))] group-hover:text-[rgb(var(--color-primary))] transition-colors">
                {siteConfig.name}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <SearchInput
            placeholder="Search characters, weapons, builds..."
            size="sm"
            variant="filled"
            className="w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue("")}
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon-sm" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="hidden sm:block h-6 w-px bg-[rgb(var(--color-border))] mx-1" />

          <Button variant="ghost" size="sm" className="gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]" />
            <span className="hidden sm:inline text-xs">Guardian</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </header>
  );
}
