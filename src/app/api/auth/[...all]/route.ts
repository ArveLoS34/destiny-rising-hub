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

// ─── Helper Functions ───

function getSessionToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    return cookies['session_token'] || null;
  }
  
  return null;
}

function createErrorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

// ─── Mock Auth API (Development) ───

export async function GET(request: NextRequest) {
  try {
    const sessionToken = getSessionToken(request);
    const user = await authService.getCurrentUser(sessionToken || undefined);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('GET /api/auth error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, username, displayName, provider } = body;

    if (!action) {
      return createErrorResponse('Action is required');
    }

    switch (action) {
      case "sign-in": {
        if (!email || !password) {
          return createErrorResponse('Email and password are required');
        }
        
        const result = await authService.signInWithEmail(email, password);
        
        if (result.user && result.sessionToken) {
          const response = NextResponse.json({ user: result.user });
          response.headers.set('Set-Cookie', `session_token=${result.sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`);
          return response;
        }
        
        return NextResponse.json({ error: result.error });
      }
      
      case "sign-up": {
        if (!email || !password || !username || !displayName) {
          return createErrorResponse('Email, password, username, and displayName are required');
        }
        
        const result = await authService.signUp(email, username, displayName, password);
        
        if (result.user && result.sessionToken) {
          const response = NextResponse.json({ user: result.user });
          response.headers.set('Set-Cookie', `session_token=${result.sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`);
          return response;
        }
        
        return NextResponse.json({ error: result.error });
      }
      
      case "sign-out": {
        const sessionToken = getSessionToken(request);
        await authService.signOut(sessionToken || undefined);
        
        const response = NextResponse.json({ success: true });
        response.headers.set('Set-Cookie', 'session_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
        return response;
      }
      
      case "demo-login": {
        const result = await authService.loginAsDemo();
        
        const response = NextResponse.json({ user: result.user });
        response.headers.set('Set-Cookie', `session_token=${result.sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`);
        return response;
      }
      
      case "validate-session": {
        const sessionToken = getSessionToken(request);
        if (!sessionToken) {
          return NextResponse.json({ valid: false });
        }
        
        const isValid = await authService.validateSession(sessionToken);
        return NextResponse.json({ valid: isValid });
      }
      
      case "refresh-session": {
        const sessionToken = getSessionToken(request);
        if (!sessionToken) {
          return createErrorResponse('No session token provided');
        }
        
        const newToken = await authService.refreshSession(sessionToken);
        if (!newToken) {
          return createErrorResponse('Session expired or invalid');
        }
        
        const response = NextResponse.json({ success: true });
        response.headers.set('Set-Cookie', `session_token=${newToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`);
        return response;
      }
      
      default:
        return createErrorResponse('Unknown action');
    }
  } catch (error) {
    console.error('POST /api/auth error:', error);
    
    if (error instanceof SyntaxError) {
      return createErrorResponse('Invalid JSON in request body');
    }
    
    return createErrorResponse('Internal server error', 500);
  }
}

// ─── Production Better Auth Handler (uncomment when ready) ───
/*
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const { GET: betterGet, POST: betterPost } = toNextJsHandler(auth);
export { betterGet as GET, betterPost as POST };
*/
