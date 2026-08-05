'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { searchService } from '@/features/discovery/services/search/search-service';
import { knowledgeGraphService } from '@/features/discovery/services/knowledge/knowledge-service';
import type { SearchableType, SearchResult, Command, CommandCategory } from '../types';
import { 
  Search, Users, Sword, Shield, FlaskConical, Map, Package, 
  Brain, Settings, User, Star, Clock, ArrowRight, X, Command as CommandIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build commands
  useEffect(() => {
    const cmds: Command[] = [
      // Navigation commands
      {
        id: 'nav-characters',
        category: 'navigation',
        title: 'Go to Characters',
        description: 'Browse all characters',
        icon: 'Users',
        shortcut: 'G C',
        action: () => router.push('/destiny-rising/characters'),
        priority: 90,
      },
      {
        id: 'nav-weapons',
        category: 'navigation',
        title: 'Go to Weapons',
        description: 'Browse all weapons',
        icon: 'Sword',
        shortcut: 'G W',
        action: () => router.push('/destiny-rising/weapons'),
        priority: 90,
      },
      {
        id: 'nav-builds',
        category: 'navigation',
        title: 'Go to Build Lab',
        description: 'Explore builds',
        icon: 'FlaskConical',
        shortcut: 'G B',
        action: () => router.push('/destiny-rising/build-lab'),
        priority: 90,
      },
      {
        id: 'nav-teams',
        category: 'navigation',
        title: 'Go to Teams',
        description: 'Browse team compositions',
        icon: 'Shield',
        shortcut: 'G T',
        action: () => router.push('/destiny-rising/teams'),
        priority: 90,
      },
      {
        id: 'nav-materials',
        category: 'navigation',
        title: 'Go to Materials',
        description: 'Browse materials',
        icon: 'Package',
        shortcut: 'G M',
        action: () => router.push('/destiny-rising/materials'),
        priority: 90,
      },
      {
        id: 'nav-world',
        category: 'navigation',
        title: 'Go to World Map',
        description: 'Explore the world',
        icon: 'Map',
        shortcut: 'G W',
        action: () => router.push('/destiny-rising/world'),
        priority: 90,
      },
      {
        id: 'nav-advisor',
        category: 'navigation',
        title: 'Open AI Advisor',
        description: 'Get AI recommendations',
        icon: 'Brain',
        shortcut: 'G A',
        action: () => router.push('/destiny-rising/ai-advisor'),
        priority: 90,
      },
      {
        id: 'nav-planner',
        category: 'navigation',
        title: 'Open Resource Planner',
        description: 'Plan your resources',
        icon: 'Settings',
        shortcut: 'G P',
        action: () => router.push('/destiny-rising/planner'),
        priority: 90,
      },
      {
        id: 'nav-profile',
        category: 'navigation',
        title: 'Open Profile',
        description: 'View your profile',
        icon: 'User',
        shortcut: 'G U',
        action: () => router.push('/profile'),
        priority: 85,
      },
      // Action commands
      {
        id: 'action-search-character',
        category: 'action',
        title: 'Search Character',
        description: 'Find a specific character',
        icon: 'Search',
        action: () => {
          setQuery('');
          inputRef.current?.focus();
        },
        keywords: ['character', 'find', 'search'],
        priority: 80,
      },
      {
        id: 'action-create-build',
        category: 'action',
        title: 'Create Build',
        description: 'Create a new build',
        icon: 'FlaskConical',
        action: () => router.push('/destiny-rising/build-lab'),
        priority: 75,
      },
    ];

    setCommands(cmds);
  }, [router]);

  const handleSelect = useCallback((index: number) => {
    if (index < commands.length) {
      commands[index].action();
      onClose();
    } else {
      const resultIndex = index - commands.length;
      if (results[resultIndex]) {
        router.push(results[resultIndex].item.url);
        onClose();
      }
    }
  }, [commands, results, router, onClose]);

  // Search when query changes
  // eslint-disable-next-line
  useEffect(() => {
    if (query.trim()) {
      const response = searchService.search({
        query,
        limit: 10,
        includeFuzzy: true,
      });
      setResults(response.results);
    } else {
      setResults([]);
    }
    setSelectedIndex(0); // Reset selection when query changes
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length + commands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          handleSelect(selectedIndex);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, selectedIndex, results.length, commands.length, onClose, handleSelect]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const getIcon = (iconName?: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Search,
      Users,
      Sword,
      Shield,
      FlaskConical,
      Map,
      Package,
      Brain,
      Settings,
      User,
      Star,
      Clock,
    };
    return icons[iconName || 'Search'] || Search;
  };

  const getCategoryLabel = (category: CommandCategory) => {
    const labels: Record<CommandCategory, string> = {
      navigation: 'Navigation',
      action: 'Actions',
      search: 'Search',
      recent: 'Recent',
      quick: 'Quick Actions',
    };
    return labels[category];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="relative w-full max-w-2xl rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-[rgb(var(--color-border))] px-4 py-3">
          <Search className="h-5 w-5 text-[rgb(var(--color-text-tertiary))]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything or type a command..."
            className="flex-1 bg-transparent text-base text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[rgb(var(--color-text-tertiary))] hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Commands */}
          {!query && commands.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-semibold text-[rgb(var(--color-text-tertiary))]">
                Commands
              </div>
              {commands.map((cmd, index) => {
                const Icon = getIcon(cmd.icon);
                return (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(index)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      selectedIndex === index
                        ? 'bg-[rgb(var(--color-primary)/0.1)]'
                        : 'hover:bg-[rgb(var(--color-surface-elevated))]'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[rgb(var(--color-text-primary))]">
                        {cmd.title}
                      </div>
                      {cmd.description && (
                        <div className="text-xs text-[rgb(var(--color-text-tertiary))]">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <div className="text-xs text-[rgb(var(--color-text-tertiary))]">
                        {cmd.shortcut}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Search Results */}
          {query && results.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-semibold text-[rgb(var(--color-text-tertiary))]">
                Search Results ({results.length})
              </div>
              {results.map((result, index) => {
                const actualIndex = commands.length + index;
                return (
                  <button
                    key={result.item.id}
                    onClick={() => handleSelect(actualIndex)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      selectedIndex === actualIndex
                        ? 'bg-[rgb(var(--color-primary)/0.1)]'
                        : 'hover:bg-[rgb(var(--color-surface-elevated))]'
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                      {result.item.icon ? (
                        <img src={result.item.icon} alt="" className="h-5 w-5" />
                      ) : (
                        <Search className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate">
                          {result.item.title}
                        </div>
                        <div className="text-xs text-[rgb(var(--color-text-tertiary))] capitalize">
                          {result.item.type}
                        </div>
                      </div>
                      <div className="text-xs text-[rgb(var(--color-text-tertiary))] truncate">
                        {result.item.description}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[rgb(var(--color-text-tertiary))]" />
                  </button>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <Search className="mx-auto h-8 w-8 text-[rgb(var(--color-text-tertiary))]" />
              <div className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
                No results found for "{query}"
              </div>
              <div className="mt-1 text-xs text-[rgb(var(--color-text-tertiary))]">
                Try a different search term
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] px-4 py-2 text-xs text-[rgb(var(--color-text-tertiary))]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-[rgb(var(--color-surface-elevated))] px-1.5 py-0.5">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-[rgb(var(--color-surface-elevated))] px-1.5 py-0.5">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-[rgb(var(--color-surface-elevated))] px-1.5 py-0.5">esc</kbd>
              Close
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CommandIcon className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to use command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}
