import { NextResponse } from 'next/server';
import { getRateLimitStats } from '@/lib/api/rate-limit';
import { databaseService } from '@/lib/database';

/**
 * GET /api/debug/performance
 * Diagnostic endpoint for performance investigation
 * Shows rate limit stats, database connection pool status, etc.
 */

export async function GET() {
  try {
    // Get rate limit statistics
    const rateLimitStats = getRateLimitStats();
    
    // Get database connection pool stats
    const prisma = databaseService.getClient();
    let dbStats = {
      connected: false,
      poolSize: 0,
      activeConnections: 0,
      idleConnections: 0,
      waitingRequests: 0,
    };
    
    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      dbStats.connected = true;
      
      // Note: Prisma doesn't expose pool stats directly, but we can track this via logs
      // For now, we'll just confirm the connection is working
    } catch (error) {
      dbStats.connected = false;
    }
    
    // Get application stats
    const appStats = {
      nodeEnv: process.env.NODE_ENV,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      rateLimits: {
        public: parseInt(process.env.RATE_LIMIT_PUBLIC_MAX_REQUESTS || (process.env.NODE_ENV === 'test' ? '10000' : '60')),
        authenticated: parseInt(process.env.RATE_LIMIT_AUTHENTICATED_MAX_REQUESTS || (process.env.NODE_ENV === 'test' ? '20000' : '120')),
        write: parseInt(process.env.RATE_LIMIT_WRITE_MAX_REQUESTS || (process.env.NODE_ENV === 'test' ? '5000' : '30')),
        search: parseInt(process.env.RATE_LIMIT_SEARCH_MAX_REQUESTS || (process.env.NODE_ENV === 'test' ? '5000' : '30')),
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
