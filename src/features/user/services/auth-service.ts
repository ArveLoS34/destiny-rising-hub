
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
import bcrypt from 'bcryptjs';

// ─── Mock Auth System (Development) ───
// This will be replaced by Better Auth + Prisma in production

interface MockUser extends User {
  passwordHash: string;
}

const mockUsers: MockUser[] = [];
const sessions: Map<string, { userId: string; expiresAt: Date }> = new Map();

// Create a demo user for development with hashed password
const demoUserPasswordHash = bcrypt.hashSync('demo123', 10);
const demoUser: MockUser = {
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
  passwordHash: demoUserPasswordHash,
};

mockUsers.push(demoUser);

// ─── Security Constants ───
const SALT_ROUNDS = 10;
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MIN_PASSWORD_LENGTH = 8;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Login attempt tracking
const loginAttempts: Map<string, { count: number; firstAttempt: number }> = new Map();

// CSRF token storage (in-memory for mock auth)
const csrfTokens: Map<string, { token: string; expiresAt: Date }> = new Map();

// ─── CSRF Protection ───

/**
 * Generate CSRF token for a user session
 * Uses crypto.randomUUID() for secure random generation
 */
export function generateCsrfToken(sessionId: string): string {
  const crypto = require('crypto');
  const token = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  csrfTokens.set(sessionId, {
    token,
    expiresAt: new Date(Date.now() + CSRF_TOKEN_DURATION_MS)
  });
  return token;
}

/**
 * Validate CSRF token
 * Compares provided token with stored token for the session
 */
export function validateCsrfToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  if (!stored) return false;
  
  // Check expiration
  if (new Date() > stored.expiresAt) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  // Secure comparison to prevent timing attacks
  const crypto = require('crypto');
  return crypto.timingSafeEqual(
    Buffer.from(stored.token, 'hex'),
    Buffer.from(token, 'hex')
  );
}

/**
 * Remove CSRF token after use (single-use tokens for state-changing operations)
 */
export function revokeCsrfToken(sessionId: string): void {
  csrfTokens.delete(sessionId);
}

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
    
    const mockUser = mockUsers.find((u) => u.id === session.userId);
    if (!mockUser) return null;
    
    // Return user without password hash
    const { passwordHash, ...user } = mockUser;
    return user;
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

    const mockUser = mockUsers.find((u) => u.email === email);
    if (!mockUser) {
      recordLoginAttempt(email);
      return { user: null, error: "Invalid credentials" };
    }

    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, mockUser.passwordHash);
    if (!passwordMatch) {
      recordLoginAttempt(email);
      return { user: null, error: "Invalid credentials" };
    }
    
    clearLoginAttempts(email);
    
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, {
      userId: mockUser.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS)
    });
    
    // Return user without password hash
    const { passwordHash, ...user } = mockUser;
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
    const sanitizedEmail = sanitizeInput(email);

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser: MockUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: sanitizedEmail,
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
      passwordHash,
    };

    mockUsers.push(newUser);
    
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, {
      userId: newUser.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS)
    });
    
    // Return user without password hash
    const { passwordHash: _, ...user } = newUser;
    return { user, sessionToken };
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
    const mockUser = mockUsers.find((u) => u.id === userId);
    if (!mockUser) return null;

    // Sanitize inputs
    if (updates.displayName) {
      updates.displayName = sanitizeInput(updates.displayName);
    }
    if (updates.bio) {
      updates.bio = sanitizeInput(updates.bio);
    }

    Object.assign(mockUser, updates, { updatedAt: new Date().toISOString() });
    
    // Return user without password hash
    const { passwordHash, ...user } = mockUser;
    return user;
  },

  /**
   * Check if user has a specific role.
   */
  async hasRole(userId: string, requiredRole: UserRole): Promise<boolean> {
    const mockUser = mockUsers.find((u) => u.id === userId);
    if (!mockUser) return false;

    const roleHierarchy: Record<string, number> = {
      user: 1,
      moderator: 2,
      admin: 3,
      superadmin: 4,
    };

    return (roleHierarchy[mockUser.role] || 0) >= (roleHierarchy[requiredRole] || 0);
  },

  /**
   * Get the demo user (for development).
   */
  getDemoUser(): User {
    const { passwordHash, ...user } = demoUser;
    return user;
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
    
    const { passwordHash, ...user } = demoUser;
    return { user, sessionToken };
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
