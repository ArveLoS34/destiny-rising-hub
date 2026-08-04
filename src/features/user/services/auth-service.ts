/**
 * Authentication Service
 * 
 * Architecture: Provider-agnostic auth system.
 * In production, this connects to Better Auth + PostgreSQL.
 * In development/sandbox, it uses an in-memory mock system
 * that maintains the same API surface.
 * 
 * When deploying to production:
 * 1. Set DATABASE_URL to your PostgreSQL connection string
 * 2. Set BETTER_AUTH_SECRET to a secure random string
 * 3. Set social provider credentials (Google, GitHub, Discord)
 * 4. Run: npx prisma migrate deploy
 */

import type { User, UserRole, AuthProvider, ThemePreference } from "@/types/domain";

// ─── Mock Auth System (Development) ───
// This will be replaced by Better Auth + Prisma in production

const mockUsers: User[] = [];
let currentSession: { userId: string; expiresAt: Date } | null = null;

// Create a demo user for development
const demoUser: User = {
  id: "user_demo_001",
  username: "guardian",
  displayName: "Guardian",
  avatar: null,
  email: "guardian@destinyrisinghub.com",
  emailVerified: true,
  provider: "email",
  providerAccountId: "demo-account",
  role: "user",
  locale: "en",
  theme: "dark",
  bio: "Destiny Rising enthusiast. Main: Phantom & Nova.",
  createdAt: "2025-01-15T00:00:00Z",
  updatedAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
};

mockUsers.push(demoUser);

// ─── Auth Service ───

export const authService = {
  /**
   * Get current authenticated user.
   * In production, this reads from the session cookie.
   */
  async getCurrentUser(): Promise<User | null> {
    if (!currentSession) return null;
    if (new Date() > currentSession.expiresAt) {
      currentSession = null;
      return null;
    }
    return mockUsers.find((u) => u.id === currentSession?.userId) || null;
  },

  /**
   * Sign in with email and password.
   * In production, Better Auth handles this with bcrypt + JWT.
   */
  async signInWithEmail(email: string, _password: string): Promise<{ user: User | null; error?: string }> {
    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      return { user: null, error: "Invalid credentials" };
    }
    currentSession = { userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
    return { user };
  },

  /**
   * Sign in with social provider.
   * In production, this uses OAuth 2.0 flow via Better Auth.
   */
  async signInWithSocial(provider: AuthProvider): Promise<{ user: User | null; error?: string }> {
    // In production, this would redirect to the OAuth provider
    return { user: null, error: "Social login requires production environment" };
  },

  /**
   * Register a new user.
   */
  async signUp(email: string, username: string, displayName: string, _password: string): Promise<{ user: User | null; error?: string }> {
    if (mockUsers.some((u) => u.email === email)) {
      return { user: null, error: "Email already in use" };
    }
    if (mockUsers.some((u) => u.username === username)) {
      return { user: null, error: "Username already taken" };
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      emailVerified: false,
      username,
      displayName,
      avatar: null,
      provider: "email",
      providerAccountId: `email-${email}`,
      role: "user",
      locale: "en",
      theme: "dark",
      bio: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    currentSession = { userId: newUser.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
    return { user: newUser };
  },

  /**
   * Sign out the current user.
   */
  async signOut(): Promise<void> {
    currentSession = null;
  },

  /**
   * Update user profile.
   */
  async updateProfile(userId: string, updates: Partial<Pick<User, "displayName" | "avatar" | "bio" | "locale" | "theme">>): Promise<User | null> {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return null;

    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    return user;
  },

  /**
   * Check if user has a specific role.
   */
  async hasRole(userId: string, requiredRole: UserRole): Promise<boolean> {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return false;

    const roleHierarchy: Record<string, number> = {
      user: 1,
      moderator: 2,
      admin: 3,
      superadmin: 4,
    };

    return (roleHierarchy[user.role] || 0) >= (roleHierarchy[requiredRole] || 0);
  },

  /**
   * Get the demo user (for development).
   */
  getDemoUser(): User {
    return demoUser;
  },

  /**
   * Auto-login as demo user (for development/testing).
   */
  async loginAsDemo(): Promise<User> {
    currentSession = { userId: demoUser.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
    return demoUser;
  },
};
