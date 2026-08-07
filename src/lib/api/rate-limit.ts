import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from './errors';
import { logger } from '@/lib/logger';

/**
 * API Rate Limiting with Diagnostic Logging
 * Endpoint-based rate limiting with environment-based configuration
 */

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

export interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
    blocked: number;
  };
}

const store: RateLimitStore = {};

/**
 * Helper function to safely parse environment variables
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Default rate limit configurations per endpoint type
 */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'public': {
    windowMs: getEnvNumber('RATE_LIMIT_PUBLIC_WINDOW_MS', 60000),
    maxRequests: getEnvNumber(
      'RATE_LIMIT_PUBLIC_MAX_REQUESTS',
      process.env.NODE_ENV === 'test' ? 10000 : 60
    ),
    message: 'Too many requests, please try again later',
  },
  'authenticated': {
    windowMs: getEnvNumber('RATE_LIMIT_AUTHENTICATED_WINDOW_MS', 60000),
    maxRequests: getEnvNumber(
      'RATE_LIMIT_AUTHENTICATED_MAX_REQUESTS',
      process.env.NODE_ENV === 'test' ? 20000 : 120
    ),
    message: 'Rate limit exceeded',
  },
  'auth': {
    windowMs: getEnvNumber('RATE_LIMIT_AUTH_WINDOW_MS', 900000),
    maxRequests: getEnvNumber(
      'RATE_LIMIT_AUTH_MAX_REQUESTS',
      process.env.NODE_ENV === 'test' ? 1000 : 5
    ),
    message: 'Too many authentication attempts, please try again later',
  },
  'write': {
    windowMs: getEnvNumber('RATE_LIMIT_WRITE_WINDOW_MS', 60000),
    maxRequests: getEnvNumber(
      'RATE_LIMIT_WRITE_MAX_REQUESTS',
      process.env.NODE_ENV === 'test' ? 5000 : 30
    ),
    message: 'Too many write operations',
  },
  'search': {
    windowMs: getEnvNumber('RATE_LIMIT_SEARCH_WINDOW_MS', 60000),
    maxRequests: getEnvNumber(
      'RATE_LIMIT_SEARCH_MAX_REQUESTS',
      process.env.NODE_ENV === 'test' ? 5000 : 30
    ),
    message: 'Too many search requests',
  },
  'admin': {
    windowMs: getEnvNumber('RATE_LIMIT_ADMIN_WINDOW_MS', 60000),
    maxRequests: getEnvNumber(
      'RATE_LIMIT_ADMIN_MAX_REQUESTS',
      process.env.NODE_ENV === 'test' ? 10000 : 100
    ),
    message: 'Admin rate limit exceeded',
  },
};

/**
 * Generate rate limit key from request
 */
function getRateLimitKey(request: NextRequest, endpointType: string): string {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const authHeader = request.headers.get('authorization');
  const userId = authHeader ? authHeader.substring(7, 20) : ip;
  
  return `${endpointType}:${userId}`;
}

/**
 * Check rate limit with diagnostic logging
 */
export function checkRateLimit(
  request: NextRequest,
  endpointType: string = 'public'
): { allowed: boolean; remaining: number; resetAt: number } {
  const config = RATE_LIMITS[endpointType] || RATE_LIMITS.public;
  const key = getRateLimitKey(request, endpointType);
  const now = Date.now();
  
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetAt: now + config.windowMs,
      blocked: 0,
    };
  }
  
  const entry = store[key];
  
  if (now > entry.resetAt) {
    if (entry.blocked > 0) {
      logger.warn('RateLimit', `Rate limit diagnostics for ${key}: ${entry.blocked} requests blocked in last window`, {
        endpointType,
        blocked: entry.blocked,
        allowed: entry.count,
        limit: config.maxRequests,
        windowMs: config.windowMs,
      });
    }
    
    entry.count = 0;
    entry.resetAt = now + config.windowMs;
    entry.blocked = 0;
  }
  
  entry.count++;
  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  
  if (!allowed) {
    entry.blocked++;
    
    if (entry.blocked % 100 === 0) {
      logger.warn('RateLimit', `Rate limit exceeded for ${key}`, {
        endpointType,
        blocked: entry.blocked,
        current: entry.count,
        limit: config.maxRequests,
        remaining: 0,
        resetAt: entry.resetAt,
      });
    }
  }
  
  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Middleware to apply rate limiting with detailed error responses
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
        limit: config.maxRequests,
        endpointType,
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
  
  response.headers.set('X-RateLimit-Limit', String(config.maxRequests));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set('X-RateLimit-Reset', String(resetAt));
  
  return response;
}

/**
 * Get current rate limit statistics (for diagnostics)
 */
export function getRateLimitStats(): {
  totalKeys: number;
  totalBlocked: number;
  topBlocked: Array<{ key: string; blocked: number; count: number }>;
} {
  const entries = Object.entries(store);
  const totalBlocked = entries.reduce((sum, [, entry]) => sum + entry.blocked, 0);
  
  const topBlocked = entries
    .map(([key, entry]) => ({ key, blocked: entry.blocked, count: entry.count }))
    .sort((a, b) => b.blocked - a.blocked)
    .slice(0, 10);
  
  return {
    totalKeys: entries.length,
    totalBlocked,
    topBlocked,
  };
}

/**
 * Clean up old entries from store
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
  
  const endpointType = key.split(':')[0];
  const config = RATE_LIMITS[endpointType] || RATE_LIMITS.public;
  
  return {
    count: entry.count,
    resetAt: entry.resetAt,
    config,
  };
}
