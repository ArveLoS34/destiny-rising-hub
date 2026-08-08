/**
 * Better Auth — Production Configuration
 *
 * Phase 2B-2: Migration from mock auth to Better Auth.
 *
 * Key decisions:
 *   - Session persistence: PostgreSQL (storeSessionInDatabase: true)
 *   - Secondary storage: Redis (rate limiting only, NOT session storage)
 *   - Schema: Frozen PascalCase tables, no @@map()
 *   - Cookie contract: session_token (matches Phase 2A proven contract)
 *   - basePath: Default /api/auth (removed /api/auth-test)
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// ─── Prisma Client (Prisma 7 driver adapter) ───
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// ─── Redis Secondary Storage ───
// Used for rate limiting counters and short-lived data.
// Session data stays in PostgreSQL (storeSessionInDatabase: true).
const redisStorage = {
  get: async (key: string) => {
    try {
      const { default: Redis } = await import("ioredis");
      const redis = new Redis(process.env.REDIS_URL || "redis://redis:6379");
      const value = await redis.get(key);
      await redis.quit();
      return value;
    } catch {
      return null;
    }
  },
  set: async (key: string, value: string, ttl?: number) => {
    try {
      const { default: Redis } = await import("ioredis");
      const redis = new Redis(process.env.REDIS_URL || "redis://redis:6379");
      if (ttl) {
        await redis.set(key, value, "EX", ttl);
      } else {
        await redis.set(key, value);
      }
      await redis.quit();
    } catch {
      // Redis unavailable — rate limiting degrades gracefully
    }
  },
  delete: async (key: string) => {
    try {
      const { default: Redis } = await import("ioredis");
      const redis = new Redis(process.env.REDIS_URL || "redis://redis:6379");
      await redis.del(key);
      await redis.quit();
    } catch {
      // Redis unavailable — degrade gracefully
    }
  },
};

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

  // ─── Secondary Storage (Redis) ───
  // Used for rate limiting counters.
  // Sessions stay in PostgreSQL (storeSessionInDatabase: true above).
  secondaryStorage: redisStorage,

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

  // ─── Rate Limiting (Redis-backed) ───
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
