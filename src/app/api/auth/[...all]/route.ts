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
import { authService, generateCsrfToken, validateCsrfToken } from "@/features/user/services/auth-service";

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

function getCsrfTokenFromCookie(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  return cookies['csrf_token'] || null;
}

/**
 * Validate CSRF token for state-changing operations.
 * Compares cookie-stored token with header-provided token.
 */
function validateCsrfHeader(request: NextRequest, sessionToken: string): boolean {
  const csrfFromCookie = getCsrfTokenFromCookie(request);
  const csrfFromHeader = request.headers.get('x-csrf-token');
  
  if (!csrfFromCookie || !csrfFromHeader) return false;
  if (csrfFromCookie !== csrfFromHeader) return false;
  
  return validateCsrfToken(sessionToken, csrfFromCookie);
}

function setCsrfCookie(response: NextResponse, sessionId: string, token: string): void {
  response.headers.set('Set-Cookie', `csrf_token=${token}; Path=/; SameSite=Strict; Secure; Max-Age=${24 * 60 * 60}`);
}

function setSessionCookie(response: NextResponse, sessionToken: string): void {
  response.headers.set('Set-Cookie', `session_token=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`);
}

function clearSessionCookie(response: NextResponse): void {
  response.headers.set('Set-Cookie', 'session_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/');
}

function clearCsrfCookie(response: NextResponse): void {
  response.headers.set('Set-Cookie', 'csrf_token=; Path=/; SameSite=Strict; Secure; Max-Age=0');
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
          // Generate CSRF token for authenticated session
          const csrfToken = generateCsrfToken(result.sessionToken);
          const response = NextResponse.json({ user: result.user, csrfToken });
          setSessionCookie(response, result.sessionToken);
          setCsrfCookie(response, result.sessionToken, csrfToken);
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
          // Generate CSRF token for authenticated session
          const csrfToken = generateCsrfToken(result.sessionToken);
          const response = NextResponse.json({ user: result.user, csrfToken });
          setSessionCookie(response, result.sessionToken);
          setCsrfCookie(response, result.sessionToken, csrfToken);
          return response;
        }
        
        return NextResponse.json({ error: result.error });
      }
      
      case "sign-out": {
        const sessionToken = getSessionToken(request);
        
        // CSRF validation for state-changing operation
        if (sessionToken && !validateCsrfHeader(request, sessionToken)) {
          return createErrorResponse('CSRF validation failed', 403);
        }
        
        await authService.signOut(sessionToken || undefined);
        
        const response = NextResponse.json({ success: true });
        clearSessionCookie(response);
        clearCsrfCookie(response);
        return response;
      }
      
      case "demo-login": {
        const result = await authService.loginAsDemo();
        
        // Generate CSRF token for demo session
        const csrfToken = generateCsrfToken(result.sessionToken);
        const response = NextResponse.json({ user: result.user, csrfToken });
        setSessionCookie(response, result.sessionToken);
        setCsrfCookie(response, result.sessionToken, csrfToken);
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
        
        // CSRF validation for state-changing operation
        if (!validateCsrfHeader(request, sessionToken)) {
          return createErrorResponse('CSRF validation failed', 403);
        }
        
        const newToken = await authService.refreshSession(sessionToken);
        if (!newToken) {
          return createErrorResponse('Session expired or invalid');
        }
        
        // Generate new CSRF token for refreshed session
        const newCsrfToken = generateCsrfToken(newToken);
        const response = NextResponse.json({ success: true, csrfToken: newCsrfToken });
        setSessionCookie(response, newToken);
        setCsrfCookie(response, newToken, newCsrfToken);
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
