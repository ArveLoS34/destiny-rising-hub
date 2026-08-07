import { NextResponse } from 'next/server';
import { getRateLimitStats } from '@/lib/api/rate-limit';
import { databaseService } from '@/lib/database';

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
 * GET /api/debug/performance
 * Diagnostic endpoint for performance investigation
 */

export async function GET() {
  try {
    const rateLimitStats = getRateLimitStats();
    
    const prisma = databaseService.getClient();
    let dbStats = {
      connected: false,
    };
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStats.connected = true;
    } catch (error) {
      dbStats.connected = false;
    }
    
    const appStats = {
      nodeEnv: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      rateLimits: {
        public: getEnvNumber('RATE_LIMIT_PUBLIC_MAX_REQUESTS', process.env.NODE_ENV === 'test' ? 10000 : 60),
        authenticated: getEnvNumber('RATE_LIMIT_AUTHENTICATED_MAX_REQUESTS', process.env.NODE_ENV === 'test' ? 20000 : 120),
        write: getEnvNumber('RATE_LIMIT_WRITE_MAX_REQUESTS', process.env.NODE_ENV === 'test' ? 5000 : 30),
        search: getEnvNumber('RATE_LIMIT_SEARCH_MAX_REQUESTS', process.env.NODE_ENV === 'test' ? 5000 : 30),
      },
    };
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        application: appStats,
        database: dbStats,
        rateLimit: rateLimitStats,
      },
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get performance diagnostics',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
