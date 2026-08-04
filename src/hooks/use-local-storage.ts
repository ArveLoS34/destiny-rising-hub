"use client";

import { useCallback, useSyncExternalStore } from "react";

function createLocalStorageStore<T>(key: string, initialValue: T) {
  function getSnapshot(): T {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }

  function subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};

    const handler = (e: StorageEvent) => {
      if (e.key === key) {
        callback();
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }

  return { getSnapshot, subscribe };
}

/**
 * Hook for syncing state with localStorage.
 * Uses useSyncExternalStore for React 19 compatibility.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const store = createLocalStorageStore(key, initialValue);
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  const setValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // Dispatch storage event for other tabs
          window.dispatchEvent(
            new StorageEvent("storage", { key, newValue: JSON.stringify(valueToStore) })
          );
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, value]
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new StorageEvent("storage", { key }));
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  return { value, setValue, removeValue, isHydrated: true } as const;
}
