/**
 * Better Auth — Production Configuration
 *
 * Phase 2B-2: Migration from mock auth to Better Auth.
 * Phase 2B-3: Atomic Redis rate limiting via @better-auth/redis-storage.
 *
 * Key decisions:
 *   - Session persistence: PostgreSQL (storeSessionInDatabase: true)
 *   - Secondary storage: Redis via @better-auth/redis-storage (atomic increment)
 *   - Schema: Frozen PascalCase tables, no @@map()
 *   - Cookie contract: session_token (matches Phase 2A proven contract)
 *   - basePath: Default /api/auth (removed /api/auth-test)
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Redis } from "ioredis";
import { redisStorage } from "@better-auth/redis-storage";

// ─── Prisma Client (Prisma 7 driver adapter) ───
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// ─── Redis Client (persistent connection) ───
// Used for rate limiting counters and short-lived data.
// Session data stays in PostgreSQL (storeSessionInDatabase: true).
const redis = new Redis(process.env.REDIS_URL || "redis://redis:6379", {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

// ─── Redis Secondary Storage (Official Package) ───
// @better-auth/redis-storage provides:
//   - Atomic `increment` with Lua script (fixed TTL window)
//   - Atomic `getAndDelete` (GETDEL or Lua fallback)
//   - Key prefix support ("better-auth:")
// This replaces the manual get/set/delete implementation from Phase 2B-2.
const secondaryStorage = redisStorage({
  client: redis,
  keyPrefix: "better-auth:",
});

// ─── Better Auth Instance ───
export const auth = betterAuth({
  // ─── Database ───
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // ─── App Configuration ───
  appName: "Destiny Rising Hub",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // ─── Secret (production-grade, no fallback) ───
  // For non-destructive secret rotation, use BETTER_AUTH_SECRETS:
  //   BETTER_AUTH_SECRETS=2:new-secret,1:old-secret
  // See: https://better-auth.com/docs/reference/options#secrets
  secret: process.env.BETTER_AUTH_SECRET,

  // ─── Email/Password Authentication ───
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // ─── User Model Mapping ───
  // Frozen schema: User.displayName, User.avatar (not name, image)
  user: {
    fields: {
      name: "displayName",
      image: "avatar",
    },
    additionalFields: {
      username: {
        type: "string",
        required: false,
        input: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "MEMBER",
        input: false,
      },
      locale: {
        type: "string",
        required: false,
        defaultValue: "en",
        input: false,
      },
      theme: {
        type: "string",
        required: false,
        defaultValue: "dark",
        input: false,
      },
    },
  },

  // ─── Session Configuration ───
  // CRITICAL: storeSessionInDatabase: true preserves sessions in PostgreSQL
  // even when secondaryStorage (Redis) is configured.
  session: {
    storeSessionInDatabase: true,
    expiresIn: 60 * 60 * 24 * 7,   // 7 days
    updateAge: 60 * 60 * 24,        // 1 day
  },

  // ─── Secondary Storage (Redis — Official Package) ───
  // Used for rate limiting counters and short-lived data.
  // Sessions stay in PostgreSQL (storeSessionInDatabase: true above).
  // The official @better-auth/redis-storage package provides atomic
  // increment with fixed TTL windows, preventing concurrent bypass.
  secondaryStorage,

  // ─── Cookie Configuration ───
  // Matches Phase 2A proven contract: session_token cookie
  advanced: {
    cookiePrefix: "",
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        },
      },
    },
    disableCSRFCheck: false,
    disableOriginCheck: false,
  },

  // ─── Trusted Origins ───
  trustedOrigins: process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(",").map((o) => o.trim())
    : ["http://localhost:3000"],

  // ─── Rate Limiting (Redis-backed, atomic) ───
  // Uses @better-auth/redis-storage for strict enforcement.
  // Atomic increment ensures concurrent requests cannot bypass limits.
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
    window: parseInt(process.env.RATE_LIMIT_WINDOW || "60", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    customRules: {
      "/sign-in/email": {
        window: parseInt(process.env.RATE_LIMIT_SIGNIN_WINDOW || "900", 10),
        max: parseInt(process.env.RATE_LIMIT_SIGNIN_MAX || "5", 10),
      },
      "/sign-up/email": {
        window: parseInt(process.env.RATE_LIMIT_SIGNUP_WINDOW || "3600", 10),
        max: parseInt(process.env.RATE_LIMIT_SIGNUP_MAX || "3", 10),
      },
    },
  },

  // ─── Social Providers (DISABLED — credentials not available) ───
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   },
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //   },
  //   discord: {
  //     clientId: process.env.DISCORD_CLIENT_ID!,
  //     clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  //   },
  // },
});
