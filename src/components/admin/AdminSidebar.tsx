'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Sword,
  Package,
  Gem,
  Map,
  Download,
  CheckSquare,
  GitCompare,
  GitBranch,
  Calendar,
  Image,
  Search,
  ListChecks,
  Activity,
  ToggleLeft,
  Workflow,
  Code,
  Monitor,
  Rocket,
} from 'lucide-react';

const navigation = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { title: 'Activity Feed', href: '/admin/activity', icon: Activity },
    ],
  },
  {
    title: 'Content Editors',
    items: [
      { title: 'Characters', href: '/admin/characters', icon: Users },
      { title: 'Weapons', href: '/admin/weapons', icon: Sword },
      { title: 'Materials', href: '/admin/materials', icon: Package },
      { title: 'Artifacts', href: '/admin/artifacts', icon: Gem },
      { title: 'World Map', href: '/admin/world', icon: Map },
    ],
  },
  {
    title: 'Operations',
    items: [
      { title: 'Import Center', href: '/admin/imports', icon: Download },
      { title: 'Review Queue', href: '/admin/reviews', icon: CheckSquare },
      { title: 'Diff Viewer', href: '/admin/diffs', icon: GitCompare },
      { title: 'Patch Manager', href: '/admin/patches', icon: GitBranch },
      { title: 'Scheduler', href: '/admin/scheduler', icon: Calendar },
      { title: 'Media Library', href: '/admin/media', icon: Image },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Search', href: '/admin/search', icon: Search },
      { title: 'Bulk Operations', href: '/admin/bulk', icon: ListChecks },
      { title: 'Feature Flags', href: '/admin/flags', icon: ToggleLeft },
      { title: 'Background Jobs', href: '/admin/jobs', icon: Workflow },
      { title: 'API Explorer', href: '/admin/api', icon: Code },
      { title: 'System Monitor', href: '/admin/monitor', icon: Monitor },
      { title: 'Release Manager', href: '/admin/release', icon: Rocket },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Operations Center</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {navigation.map((section) => (
          <div key={section.title} className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              {section.title}
            </h2>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@drhub.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
