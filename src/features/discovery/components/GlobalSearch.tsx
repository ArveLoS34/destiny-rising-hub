'use client';

import { useState, useEffect, useRef } from 'react';
import { searchService } from '@/features/discovery/services/search/search-service';
import type { SearchResult } from '@/features/discovery/types';
import { Search, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search when query changes
  useEffect(() => {
    if (query.trim().length > 0) {
      const response = searchService.search({
        query,
        limit: 8,
        includeFuzzy: true,
      });
      setResults(response.results);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
    setSelectedIndex(0);
  }, [query]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].item.url);
          setIsOpen(false);
          setQuery('');
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search characters, weapons, builds..."
          className="h-10 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] pl-9 pr-9 text-sm text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-primary))]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-lg">
          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((result, index) => (
              <Link
                key={result.item.id}
                href={result.item.url}
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  selectedIndex === index
                    ? 'bg-[rgb(var(--color-primary)/0.1)]'
                    : 'hover:bg-[rgb(var(--color-surface-elevated))]'
                }`}
              >
                {result.item.icon && (
                  <img
                    src={result.item.icon}
                    alt=""
                    className="h-8 w-8 rounded object-cover"
                  />
                )}
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
              </Link>
            ))}
          </div>
          <div className="border-t border-[rgb(var(--color-border))] px-3 py-2">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-xs text-[rgb(var(--color-primary))] hover:underline"
            >
              <span>View all results</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
