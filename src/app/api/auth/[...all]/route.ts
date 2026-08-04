/**
 * Auth API Routes
 * 
 * In production, this uses Better Auth's Next.js handler.
 * In development/sandbox, we use a simplified mock API.
 * 
 * Production setup:
 * 1. Install and configure Better Auth
 * 2. Set up PostgreSQL database
 * 3. Run: npx prisma migrate deploy
 * 4. Uncomment the Better Auth handler below
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/features/user/services/auth-service";

// ─── Mock Auth API (Development) ───

export async function GET(request: NextRequest) {
  const user = await authService.getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, email, password, username, displayName, provider } = body;

  switch (action) {
    case "sign-in": {
      const result = await authService.signInWithEmail(email, password);
      return NextResponse.json(result);
    }
    case "sign-up": {
      const result = await authService.signUp(email, username, displayName, password);
      return NextResponse.json(result);
    }
    case "sign-out": {
      await authService.signOut();
      return NextResponse.json({ success: true });
    }
    case "demo-login": {
      const user = await authService.loginAsDemo();
      return NextResponse.json({ user });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}

// ─── Production Better Auth Handler (uncomment when ready) ───
/*
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const { GET: betterGet, POST: betterPost } = toNextJsHandler(auth);
export { betterGet as GET, betterPost as POST };
*/
