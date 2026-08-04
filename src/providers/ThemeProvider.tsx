"use client";

import { type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/Tooltip";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider wraps the application with tooltip defaults
 * and any future theme-level providers.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={200}>
      {children}
    </TooltipProvider>
  );
}
