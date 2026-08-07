"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User } from "@/types/domain";

// ─── Auth Context Types ───

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, username: string, displayName: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  demoLogin: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── CSRF Helper ───

function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : null;
}

// ─── API Helper ───

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const csrfToken = getCsrfTokenFromCookie();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  // Attach CSRF token for state-changing operations
  if (csrfToken && options.method && options.method !== "GET") {
    headers["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Send cookies automatically
  });

  return response;
}

// ─── Auth Provider ───

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authFetch("/api/auth");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await authFetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "sign-in", email, password }),
      });

      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
        return {};
      }
      
      return { error: data.error || "Sign in failed" };
    } catch {
      return { error: "Network error" };
    }
  }, []);

  const signUp = useCallback(async (email: string, username: string, displayName: string, password: string) => {
    try {
      const response = await authFetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "sign-up", email, username, displayName, password }),
      });

      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
        return {};
      }
      
      return { error: data.error || "Sign up failed" };
    } catch {
      return { error: "Network error" };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authFetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "sign-out" }),
      });
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      // Clear local state even on error
      setUser(null);
    }
  }, []);

  const demoLogin = useCallback(async () => {
    try {
      const response = await authFetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "demo-login" }),
      });

      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Demo login error:", error);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      await authFetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "refresh-session" }),
      });
    } catch (error) {
      console.error("Session refresh error:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        demoLogin,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
