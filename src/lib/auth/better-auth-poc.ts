/**
 * RC-5 Phase 2A — Better Auth Compatibility POC
 *
 * BU DOSYA TEST AMAÇLIDIR. Production route'u değildir.
 * Mock auth'ı değiştirmez, sadece Better Auth uyumluluğunu test eder.
 *
 * Test endpoint: /api/auth-test/[[...all]]
 *
 * KAPSAM:
 *   ✅ Better Auth instance oluşturma
 *   ✅ Prisma adapter ile frozen schema uyumluluğu
 *   ✅ User field mapping (displayName, avatar)
 *   ✅ Session persistence (PostgreSQL)
 *   ✅ Credential authentication (Account.password)
 *   ✅ Cookie contract (session_token)
 *
 * KAPSAM DIŞI (Phase 2B'de değerlendirilecek):
 *   ❌ Redis secondary storage (ioredis paketi yok)
 *   ❌ Rate limiting (Redis'e bağımlı)
 *   ❌ Social/OAuth providers (credential yok)
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

// ─── Prisma Client ───
const prisma = new PrismaClient();

// ─── Better Auth Instance ───
export const auth = betterAuth({
  // ─── Database ───
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // ─── App Configuration ───
  appName: "Destiny Rising Hub",
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // ─── Secret ───
  secret: process.env.BETTER_AUTH_SECRET || "poc-secret-not-for-production",

  // ─── Email/Password Authentication ───
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // ─── User Model Mapping ───
  // Schema is FROZEN — we must map Better Auth field names to our columns
  user: {
    fields: {
      name: "displayName",    // Better Auth "name" → Our "displayName"
      image: "avatar",        // Better Auth "image" → Our "avatar"
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
  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 gün
    updateAge: 60 * 60 * 24,       // 1 gün
  },

  // ─── Cookie Configuration ───
  // CRITICAL: Cookie isimleri mevcut contract ile uyumlu olmalı
  advanced: {
    // Better Auth default prefix'i kaldır
    // Default: "better-auth.session_token"
    // Bizim ihtiyacımız: "session_token"
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

    // CSRF/Origin Configuration
    disableCSRFCheck: false,
    disableOriginCheck: false,
  },

  // ─── Trusted Origins ───
  trustedOrigins: [
    "http://localhost:3000",
  ],

  // ─── Rate Limiting (Memory-based, no Redis) ───
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: "memory",  // Redis yok, memory kullan
  },

  // ─── Social Providers (DISABLED) ───
  // socialProviders: { ... },
});
