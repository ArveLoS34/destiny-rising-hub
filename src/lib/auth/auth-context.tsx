/**
 * Auth Context — Better Auth Client Integration
 *
 * Phase 2B-2: Migrated from mock auth fetch-based API to Better Auth client.
 *
 * Public interface (useAuth) is PRESERVED:
 *   - user, isLoading, isAuthenticated
 *   - signIn(email, password)
 *   - signUp(email, username, displayName, password)
 *   - signOut()
 *   - demoLogin() → redirects to login (no mock user in production)
 *   - refreshSession() → no-op (Better Auth handles automatically)
 *
 * Internal implementation uses Better Auth React client.
 * CSRF handling is now managed by Better Auth internally.
 */

"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authClient } from "@/lib/auth/client";
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

// ─── Better Auth Session → Our User Type Mapper ───

function mapSessionUserToUser(sessionUser: Record<string, unknown> | null): User | null {
  if (!sessionUser) return null;

  return {
    id: sessionUser.id as string,
    email: sessionUser.email as string,
    username: (sessionUser.username as string) || "",
    displayName: (sessionUser.name as string) || (sessionUser.displayName as string) || "",
    avatar: (sessionUser.image as string) || (sessionUser.avatar as string) || null,
    emailVerified: (sessionUser.emailVerified as boolean) || false,
    provider: "email",
    providerAccountId: sessionUser.id as string,
    role: (sessionUser.role as string) || "MEMBER",
    locale: (sessionUser.locale as string) || "en",
    theme: (sessionUser.theme as string) || "dark",
    bio: null,
    createdAt: (sessionUser.createdAt as string) || new Date().toISOString(),
    updatedAt: (sessionUser.updatedAt as string) || new Date().toISOString(),
    lastLoginAt: null,
  };
}

// ─── Auth Provider ───

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current session on mount using Better Auth
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          setUser(mapSessionUserToUser(data.user as unknown as Record<string, unknown>));
        }
      } catch (error) {
        console.error("Failed to load auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await authClient.signIn.email({ email, password });

      if (error) {
        return { error: error.message || "Sign in failed" };
      }

      if (data?.user) {
        setUser(mapSessionUserToUser(data.user as unknown as Record<string, unknown>));
        return {};
      }

      return { error: "Sign in failed" };
    } catch {
      return { error: "Network error" };
    }
  }, []);

  const signUp = useCallback(async (email: string, username: string, displayName: string, password: string) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: displayName,
        username,
      });

      if (error) {
        return { error: error.message || "Sign up failed" };
      }

      if (data?.user) {
        setUser(mapSessionUserToUser(data.user as unknown as Record<string, unknown>));
        return {};
      }

      return { error: "Sign up failed" };
    } catch {
      return { error: "Network error" };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setUser(null);
    }
  }, []);

  // Demo login is NOT supported in production.
  // Better Auth has no concept of demo/mock users.
  // The demo user (guardian@destinyrisinghub.com) existed only in mock auth's
  // in-memory store and does not exist in the production database.
  //
  // If demo login is required as a product feature, it should be implemented
  // as a separate data-seeding decision (creating a persistent demo user in
  // the database) — outside the scope of Phase 2B-2.
  const demoLogin = useCallback(async () => {
    console.warn("demoLogin() is not supported in production. Use email sign-in instead.");
    // No-op in production. Client components should handle this gracefully.
  }, []);

  // Better Auth handles session refresh automatically.
  // This is a no-op for interface compatibility.
  const refreshSession = useCallback(async () => {
    // Better Auth auto-refreshes sessions based on updateAge config.
    // No manual refresh needed.
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
