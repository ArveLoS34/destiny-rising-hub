import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from './errors';

/**
 * API Rate Limiting
 * Endpoint-based rate limiting
 */

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
}

export interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

// In-memory store (use Redis in production)
const store: RateLimitStore = {};

/**
 * Default rate limit configurations per endpoint type
 */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Public endpoints
  'public': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    message: 'Too many requests, please try again later',
  },
  
  // Authenticated endpoints
  'authenticated': {
    windowMs: 60 * 1000,
    maxRequests: 120,
    message: 'Rate limit exceeded',
  },
  
  // Authentication endpoints (stricter)
  'auth': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later',
  },
  
  // Write operations
  'write': {
    windowMs: 60 * 1000,
    maxRequests: 30,
    message: 'Too many write operations',
  },
  
  // Search operations
  'search': {
    windowMs: 60 * 1000,
    maxRequests: 30,
    message: 'Too many search requests',
  },
  
  // Admin operations
  'admin': {
    windowMs: 60 * 1000,
    maxRequests: 100,
    message: 'Admin rate limit exceeded',
  },
};

/**
 * Generate rate limit key from request
 */
function getRateLimitKey(request: NextRequest, endpointType: string): string {
  // Use IP address for public endpoints
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Use user ID for authenticated endpoints
  const authHeader = request.headers.get('authorization');
  const userId = authHeader ? authHeader.substring(7, 20) : ip;
  
  return `${endpointType}:${userId}`;
}

/**
 * Check rate limit
 */
export function checkRateLimit(
  request: NextRequest,
  endpointType: string = 'public'
): { allowed: boolean; remaining: number; resetAt: number } {
  const config = RATE_LIMITS[endpointType] || RATE_LIMITS.public;
  const key = getRateLimitKey(request, endpointType);
  const now = Date.now();
  
  // Get or create entry
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetAt: now + config.windowMs,
    };
  }
  
  const entry = store[key];
  
  // Reset if window has passed
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + config.windowMs;
  }
  
  // Check limit
  entry.count++;
  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  
  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Middleware to apply rate limiting
 */
export async function withRateLimit(
  request: NextRequest,
  endpointType: string,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const { allowed, remaining, resetAt } = checkRateLimit(request, endpointType);
  const config = RATE_LIMITS[endpointType] || RATE_LIMITS.public;
  
  if (!allowed) {
    const error = createErrorResponse(
      'RATE_LIMIT_EXCEEDED',
      config.message || 'Rate limit exceeded',
      {
        retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
      },
      request.headers.get('x-request-id') || `req_${Date.now()}`,
      request.nextUrl.pathname
    );
    
    return NextResponse.json(error, {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(config.maxRequests),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(resetAt),
        'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
      },
    });
  }
  
  const response = await handler(request);
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', String(config.maxRequests));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set('X-RateLimit-Reset', String(resetAt));
  
  return response;
}

/**
 * Clean up old entries from store
 * Call this periodically in production
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}

/**
 * Get current rate limit status for a key
 */
export function getRateLimitStatus(key: string): {
  count: number;
  resetAt: number;
  config: RateLimitConfig;
} | null {
  const entry = store[key];
  if (!entry) return null;
  
  // Determine endpoint type from key
  const endpointType = key.split(':')[0];
  const config = RATE_LIMITS[endpointType] || RATE_LIMITS.public;
  
  return {
    count: entry.count,
    resetAt: entry.resetAt,
    config,
  };
}
