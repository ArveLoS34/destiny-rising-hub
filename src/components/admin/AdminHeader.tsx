'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]" />
          <Input
            placeholder="Search anything... (Ctrl+K)"
            className="pl-9"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-6 w-px bg-[rgb(var(--color-border))]" />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--color-primary))]">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Admin</div>
            <div className="text-xs text-[rgb(var(--color-text-tertiary))]">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
