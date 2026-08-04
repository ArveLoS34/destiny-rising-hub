/**
 * Authentication Configuration
 * 
 * This file configures Better Auth for production use.
 * Currently using mock auth service for development.
 * 
 * To enable production auth:
 * 1. Install PostgreSQL adapter: npm install @prisma/adapter-pg pg
 * 2. Set DATABASE_URL in .env
 * 3. Run: npx prisma migrate deploy
 * 4. Uncomment the Better Auth configuration below
 */

// ─── Mock Auth (Development) ───
// Using in-memory auth service for development/sandbox
export { authService } from "@/features/user/services/auth-service";

// ─── Production Better Auth Configuration ───
// Uncomment and configure when deploying to production
/*
import { betterAuth } from "better-auth";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: {
    provider: "pg",
    adapter: adapter,
  },
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
      locale: {
        type: "string",
        required: false,
        defaultValue: "en",
      },
      theme: {
        type: "string",
        required: false,
        defaultValue: "dark",
      },
    },
  },
  
  advanced: {
    csrf: { enabled: true },
    crossSubDomainCookies: { enabled: false },
  },
  
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
});
*/
