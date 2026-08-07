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

// ─── Environment Detection ───
// Secure flag is only applied over HTTPS.
// In development/Docker (HTTP), Secure is omitted so cookies are set correctly.
const isSecure = process.env.NODE_ENV === 'production' || process.env.FORCE_HTTPS === 'true';
const secureFlag = isSecure ? ' Secure;' : '';

// ─── Helper Functions ───

function getSessionToken(request: NextRequest): string | null {
  // Check Authorization header first (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Parse cookie header manually using indexOf (safe for values containing '=')
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookiePairs = cookieHeader.split(';');
    for (const pair of cookiePairs) {
      const trimmed = pair.trim();
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();
      if (key === 'session_token' && value) {
        return value;
      }
    }
  }
  
  return null;
}

function getCsrfTokenFromCookie(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const cookiePairs = cookieHeader.split(';');
  for (const pair of cookiePairs) {
    const trimmed = pair.trim();
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();
    if (key === 'csrf_token' && value) {
      return value;
    }
  }
  return null;
}

/**
 * Validate CSRF token for state-changing operations.
 * Compares cookie-stored token with header-provided token.
 * Returns true only when BOTH match AND server-side validation passes.
 */
function validateCsrfHeader(request: NextRequest, sessionToken: string): boolean {
  const csrfFromCookie = getCsrfTokenFromCookie(request);
  const csrfFromHeader = request.headers.get('x-csrf-token');
  
  // Both must be present
  if (!csrfFromCookie || !csrfFromHeader) return false;
  // Both must match
  if (csrfFromCookie !== csrfFromHeader) return false;
  // Server-side validation (timing-safe comparison)
  return validateCsrfToken(sessionToken, csrfFromCookie);
}

function setCsrfCookie(response: NextResponse, sessionId: string, token: string): void {
  response.cookies.set('csrf_token', token, {
    path: '/',
    sameSite: 'strict',
    secure: isSecure,
    maxAge: 24 * 60 * 60,
  });
}

function setSessionCookie(response: NextResponse, sessionToken: string): void {
  response.cookies.set('session_token', sessionToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: isSecure,
    maxAge: 7 * 24 * 60 * 60,
  });
}

function clearSessionCookie(response: NextResponse): void {
  response.cookies.set('session_token', '', {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: isSecure,
    maxAge: 0,
  });
}

function clearCsrfCookie(response: NextResponse): void {
  response.cookies.set('csrf_token', '', {
    path: '/',
    sameSite: 'strict',
    secure: isSecure,
    maxAge: 0,
  });
}

function createErrorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Map auth service error messages to appropriate HTTP status codes.
 * REST semantics:
 * - 401 Unauthorized: Authentication failures (invalid credentials)
 * - 409 Conflict: Resource already exists (duplicate email/username)
 * - 422 Unprocessable Entity: Validation failures (format, strength)
 * - 429 Too Many Requests: Rate limiting
 */
function getAuthErrorStatus(error: string | undefined): number {
  if (!error) return 400;
  
  if (error.includes("Invalid credentials")) return 401;
  if (error.includes("already in use") || error.includes("already taken")) return 409;
  if (error.includes("Too many login attempts")) return 429;
  if (
    error.includes("Invalid email") ||
    error.includes("Username must be") ||
    error.includes("Password must be")
  ) return 422;
  
  return 400;
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
        
        return createErrorResponse(result.error || 'Sign in failed', getAuthErrorStatus(result.error));
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
        
        return createErrorResponse(result.error || 'Sign up failed', getAuthErrorStatus(result.error));
      }
      
      case "sign-out": {
        const sessionToken = getSessionToken(request);
        const csrfFromCookie = getCsrfTokenFromCookie(request);
        
        // CSRF validation is mandatory when a CSRF cookie exists,
        // regardless of whether a session token is present.
        // This prevents logout CSRF attacks and ensures the client
        // explicitly provides the CSRF token via header.
        if (csrfFromCookie) {
          if (!sessionToken || !validateCsrfHeader(request, sessionToken)) {
            return createErrorResponse('CSRF validation failed', 403);
          }
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
