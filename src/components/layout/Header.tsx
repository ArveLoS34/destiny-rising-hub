"use client";

import { Search, Menu, Bell, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useCommandPalette } from "@/features/discovery/components/CommandPalette";
import { mainNavigation } from "@/config/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { open: openCommandPalette } = useCommandPalette();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] h-[var(--header-height)] border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-background)/0.75)] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-6">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))] shadow-[0_0_16px_rgb(var(--color-primary)/0.35)]">
              <span className="text-sm font-bold text-white">DR</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))] group-hover:text-[rgb(var(--color-primary-bright))] transition-colors">
                {siteConfig.name}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search (opens the command palette — same search the site already uses) */}
        <div className="hidden md:flex flex-1 max-w-md">
          <button
            onClick={openCommandPalette}
            className="glass flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[rgb(var(--color-text-tertiary))] transition-colors hover:border-[rgb(var(--color-border-hover))] hover:text-[rgb(var(--color-text-secondary))]"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">Search characters, weapons, materials, builds...</span>
            <kbd className="hidden shrink-0 rounded border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] px-1.5 py-0.5 text-[10px] font-medium text-[rgb(var(--color-text-tertiary))] lg:inline-block">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={openCommandPalette} aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon-sm" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="hidden sm:block h-6 w-px bg-[rgb(var(--color-border))] mx-1" />

          {isAuthenticated && user ? (
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]" />
              <span className="hidden sm:inline text-xs">{user.displayName || user.username || user.email}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile navigation drawer — real Sidebar content, reachable on small screens */}
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen} side="left" size="sm">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] p-4">
            <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
              DESTINY <span className="text-[rgb(var(--color-primary-bright))]">RISING HUB</span>
            </span>
            <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            {mainNavigation.map((section) => (
              <div key={section.title} className="mb-5">
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))]">
                  {section.title}
                </p>
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[rgb(var(--color-primary)/0.15)] text-[rgb(var(--color-primary-bright))]"
                            : "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </Drawer>
    </header>
  );
}
