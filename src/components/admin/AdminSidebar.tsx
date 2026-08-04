'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  Shield,
  Settings,
  BookOpen,
  Sword,
  Package,
  Gem,
  Map,
  Flag,
  Activity,
  Database,
  HardDrive,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Activity', href: '/admin/activity', icon: Activity },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Content', href: '/admin/content', icon: FileText },
      { label: 'Moderation', href: '/admin/moderation', icon: Shield },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Characters', href: '/admin/content/characters', icon: Users },
      { label: 'Weapons', href: '/admin/content/weapons', icon: Sword },
      { label: 'Materials', href: '/admin/content/materials', icon: Package },
      { label: 'Artifacts', href: '/admin/content/artifacts', icon: Gem },
      { label: 'Guides', href: '/admin/content/guides', icon: BookOpen },
      { label: 'World Map', href: '/admin/content/world', icon: Map },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Feature Flags', href: '/admin/features', icon: Flag },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Database', href: '/admin/database', icon: Database },
      { label: 'Backups', href: '/admin/backups', icon: HardDrive },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-[rgb(var(--color-border))] px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]">
          <span className="text-sm font-bold text-white">DR</span>
        </div>
        <div>
          <div className="text-sm font-semibold">Admin Panel</div>
          <div className="text-xs text-[rgb(var(--color-text-tertiary))]">Operations</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-tertiary))]">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]'
                        : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[rgb(var(--color-border))] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--color-surface-elevated))]">
            <span className="text-xs font-medium">A</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-[rgb(var(--color-text-tertiary))]">admin@destinyrisinghub.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
