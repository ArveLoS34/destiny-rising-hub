"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook for tracking media query matches.
 * Uses useSyncExternalStore for React 19 compatibility.
 */
export function useMediaQuery(query: string): boolean {
  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => false;

  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const mediaQuery = window.matchMedia(query);
      const handler = () => onStoreChange();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    },
    getSnapshot,
    getServerSnapshot
  );
}

/**
 * Predefined breakpoints matching Tailwind's defaults.
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}
