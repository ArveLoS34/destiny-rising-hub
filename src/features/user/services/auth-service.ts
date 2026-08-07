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
import bcrypt from 'bcrypt';

// ─── Mock Auth System (Development) ───
// This will be replaced by Better Auth + Prisma in production

const mockUsers: User[] = [];
const sessions: Map<string, { userId: string; expiresAt: Date }> = new Map();

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

// ─── Security Constants ───
const SALT_ROUNDS = 10;
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MIN_PASSWORD_LENGTH = 8;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Login attempt tracking
const loginAttempts: Map<string, { count: number; firstAttempt: number }> = new Map();

// ─── Helper Functions ───

function generateSessionToken(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

function isStrongPassword(password: string): boolean {
  if (password.length < MIN_PASSWORD_LENGTH) return false;
  // Enforce: at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

function sanitizeInput(input: string): string {
  // Basic XSS prevention
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function checkLoginAttempts(email: string): boolean {
  const attempt = loginAttempts.get(email);
  if (!attempt) return true;
  
  const now = Date.now();
  if (now - attempt.firstAttempt > LOGIN_ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(email);
    return true;
  }
  
  return attempt.count < MAX_LOGIN_ATTEMPTS;
}

function recordLoginAttempt(email: string): void {
  const attempt = loginAttempts.get(email);
  const now = Date.now();
  
  if (!attempt || now - attempt.firstAttempt > LOGIN_ATTEMPT_WINDOW_MS) {
    loginAttempts.set(email, { count: 1, firstAttempt: now });
  } else {
    attempt.count++;
  }
}

function clearLoginAttempts(email: string): void {
  loginAttempts.delete(email);
}

// ─── Auth Service ───

export const authService = {
  /**
   * Get current authenticated user.
   * In production, this reads from the session cookie.
   */
  async getCurrentUser(sessionToken?: string): Promise<User | null> {
    if (!sessionToken) return null;
    
    const session = sessions.get(sessionToken);
    if (!session) return null;
    
    if (new Date() > session.expiresAt) {
      sessions.delete(sessionToken);
      return null;
    }
    
    return mockUsers.find((u) => u.id === session.userId) || null;
  },

  /**
   * Sign in with email and password.
   * In production, Better Auth handles this with bcrypt + JWT.
   */
  async signInWithEmail(email: string, password: string): Promise<{ user: User | null; error?: string; sessionToken?: string }> {
    // Input validation
    if (!isValidEmail(email)) {
      return { user: null, error: "Invalid email format" };
    }

    // Rate limiting check
    if (!checkLoginAttempts(email)) {
      return { user: null, error: "Too many login attempts. Please try again later." };
    }

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      recordLoginAttempt(email);
      return { user: null, error: "Invalid credentials" };
    }

    // In production, verify password hash
    // For now, accept any password in development
    // TODO: Implement bcrypt password verification
    
    clearLoginAttempts(email);
    
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, {
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS)
    });
    
    return { user, sessionToken };
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
  async signUp(email: string, username: string, displayName: string, password: string): Promise<{ user: User | null; error?: string; sessionToken?: string }> {
    // Input validation
    if (!isValidEmail(email)) {
      return { user: null, error: "Invalid email format" };
    }
    
    if (!isValidUsername(username)) {
      return { user: null, error: "Username must be 3-20 characters, alphanumeric and underscores only" };
    }
    
    if (!isStrongPassword(password)) {
      return { 
        user: null, 
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters and include uppercase, lowercase, number, and special character` 
      };
    }

    if (mockUsers.some((u) => u.email === email)) {
      return { user: null, error: "Email already in use" };
    }
    
    if (mockUsers.some((u) => u.username === username)) {
      return { user: null, error: "Username already taken" };
    }

    // Sanitize inputs
    const sanitizedDisplayName = sanitizeInput(displayName);

    // In production, hash password with bcrypt
    // const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: sanitizeInput(email),
      emailVerified: false,
      username: sanitizeInput(username),
      displayName: sanitizedDisplayName,
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
    
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, {
      userId: newUser.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS)
    });
    
    return { user: newUser, sessionToken };
  },

  /**
   * Sign out the current user.
   */
  async signOut(sessionToken?: string): Promise<void> {
    if (sessionToken) {
      sessions.delete(sessionToken);
    }
  },

  /**
   * Update user profile.
   */
  async updateProfile(userId: string, updates: Partial<Pick<User, "displayName" | "avatar" | "bio" | "locale" | "theme">>): Promise<User | null> {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return null;

    // Sanitize inputs
    if (updates.displayName) {
      updates.displayName = sanitizeInput(updates.displayName);
    }
    if (updates.bio) {
      updates.bio = sanitizeInput(updates.bio);
    }

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
  async loginAsDemo(): Promise<{ user: User; sessionToken: string }> {
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, {
      userId: demoUser.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS)
    });
    return { user: demoUser, sessionToken };
  },

  /**
   * Validate session token.
   */
  async validateSession(sessionToken: string): Promise<boolean> {
    const session = sessions.get(sessionToken);
    if (!session) return false;
    
    if (new Date() > session.expiresAt) {
      sessions.delete(sessionToken);
      return false;
    }
    
    return true;
  },

  /**
   * Refresh session.
   */
  async refreshSession(sessionToken: string): Promise<string | null> {
    const session = sessions.get(sessionToken);
    if (!session) return null;
    
    if (new Date() > session.expiresAt) {
      sessions.delete(sessionToken);
      return null;
    }
    
    // Generate new session token
    const newToken = generateSessionToken();
    sessions.set(newToken, {
      userId: session.userId,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS)
    });
    
    // Delete old session
    sessions.delete(sessionToken);
    
    return newToken;
  },
};
