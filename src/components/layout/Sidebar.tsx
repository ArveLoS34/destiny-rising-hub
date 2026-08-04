"use client";

import { cn } from "@/lib/utils";
import { mainNavigation, type NavItem, type NavSection } from "@/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
}

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] transition-[width] duration-200",
        isCollapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]",
        className
      )}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        {mainNavigation.map((section, index) => (
          <SidebarSection
            key={section.title}
            section={section}
            pathname={pathname}
            isCollapsed={isCollapsed}
            isFirst={index === 0}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[rgb(var(--color-border))] p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[rgb(var(--color-text-primary))] truncate">
                Guardian
              </p>
              <p className="text-[10px] text-[rgb(var(--color-text-tertiary))] truncate">
                Level 50
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

interface SidebarSectionProps {
  section: NavSection;
  pathname: string;
  isCollapsed: boolean;
  isFirst: boolean;
}

function SidebarSection({ section, pathname, isCollapsed, isFirst }: SidebarSectionProps) {
  return (
    <div className={cn(!isFirst && "mt-6")}>
      {!isCollapsed && (
        <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))]">
          {section.title}
        </p>
      )}
      <nav className="flex flex-col gap-0.5 px-2">
        {section.items.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            pathname={pathname}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </div>
  );
}

interface SidebarNavItemProps {
  item: NavItem;
  pathname: string;
  isCollapsed: boolean;
}

function SidebarNavItem({ item, pathname, isCollapsed }: SidebarNavItemProps) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]"
          : "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]",
        isCollapsed && "justify-center px-2"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive
            ? "text-[rgb(var(--color-primary))]"
            : "text-[rgb(var(--color-text-tertiary))] group-hover:text-[rgb(var(--color-text-secondary))]"
        )}
      />
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <Badge variant="primary" className="px-1.5 py-0 text-[10px]">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <p className="font-medium">{item.label}</p>
          {item.description && (
            <p className="mt-0.5 text-[10px] text-[rgb(var(--color-text-tertiary))]">
              {item.description}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
