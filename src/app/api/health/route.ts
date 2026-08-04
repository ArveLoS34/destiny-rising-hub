import { NextResponse } from 'next/server';
import { databaseService } from '@/lib/database';

/**
 * Health Check API
 * Used by Docker, load balancers, and monitoring tools
 * 
 * GET /api/health
 */
export async function GET() {
  const checks: Record<string, 'healthy' | 'unhealthy'> = {};
  let overallHealthy = true;

  // ─── Database Check ────────────────────────────────────
  try {
    const dbHealthy = await databaseService.healthCheck();
    checks.database = dbHealthy ? 'healthy' : 'unhealthy';
    if (!dbHealthy) overallHealthy = false;
  } catch {
    checks.database = 'unhealthy';
    overallHealthy = false;
  }

  // ─── Application Check ─────────────────────────────────
  checks.application = 'healthy';

  // ─── Response ──────────────────────────────────────────
  const status = overallHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: overallHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      checks,
      uptime: process.uptime(),
    },
    { status }
  );
}
