import { NextRequest, NextResponse } from 'next/server';

/**
 * API Metrics
 * Track performance and usage metrics for all endpoints
 */

export interface ApiMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number; // milliseconds
  timestamp: string;
  userId?: string;
  requestId: string;
  cacheHit?: boolean;
  error?: string;
}

// In-memory store (use database/Redis in production)
const metricsStore: ApiMetrics[] = [];
const MAX_METRICS = 10000; // Keep last 10000 metrics

/**
 * Record API metric
 */
export function recordMetric(metric: ApiMetrics): void {
  metricsStore.push(metric);
  
  // Keep only last MAX_METRICS
  if (metricsStore.length > MAX_METRICS) {
    metricsStore.splice(0, metricsStore.length - MAX_METRICS);
  }
}

/**
 * Get metrics for an endpoint
 */
export function getEndpointMetrics(endpoint: string): {
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
  last24h: {
    requests: number;
    averageResponseTime: number;
    errorRate: number;
  };
} {
  const endpointMetrics = metricsStore.filter((m) => m.endpoint === endpoint);
  const last24h = Date.now() - 24 * 60 * 60 * 1000;
  const recentMetrics = endpointMetrics.filter(
    (m) => new Date(m.timestamp).getTime() > last24h
  );
  
  const totalRequests = endpointMetrics.length;
  const averageResponseTime =
    endpointMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests || 0;
  const errorCount = endpointMetrics.filter((m) => m.statusCode >= 400).length;
  const errorRate = (errorCount / totalRequests) * 100 || 0;
  const cacheHits = endpointMetrics.filter((m) => m.cacheHit).length;
  const cacheHitRate = (cacheHits / totalRequests) * 100 || 0;
  
  const recentRequests = recentMetrics.length;
  const recentAvgResponseTime =
    recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentRequests || 0;
  const recentErrors = recentMetrics.filter((m) => m.statusCode >= 400).length;
  const recentErrorRate = (recentErrors / recentRequests) * 100 || 0;
  
  return {
    totalRequests,
    averageResponseTime,
    errorRate,
    cacheHitRate,
    last24h: {
      requests: recentRequests,
      averageResponseTime: recentAvgResponseTime,
      errorRate: recentErrorRate,
    },
  };
}

/**
 * Get all metrics summary
 */
export function getAllMetricsSummary(): {
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
  topEndpoints: { endpoint: string; requests: number }[];
} {
  const totalRequests = metricsStore.length;
  const averageResponseTime =
    metricsStore.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests || 0;
  const errorCount = metricsStore.filter((m) => m.statusCode >= 400).length;
  const errorRate = (errorCount / totalRequests) * 100 || 0;
  const cacheHits = metricsStore.filter((m) => m.cacheHit).length;
  const cacheHitRate = (cacheHits / totalRequests) * 100 || 0;
  
  // Get top endpoints by request count
  const endpointCounts: Record<string, number> = {};
  metricsStore.forEach((m) => {
    endpointCounts[m.endpoint] = (endpointCounts[m.endpoint] || 0) + 1;
  });
  
  const topEndpoints = Object.entries(endpointCounts)
    .map(([endpoint, requests]) => ({ endpoint, requests }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 10);
  
  return {
    totalRequests,
    averageResponseTime,
    errorRate,
    cacheHitRate,
    topEndpoints,
  };
}

/**
 * Middleware to track metrics
 */
export async function withMetrics(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = request.headers.get('x-request-id') || `req_${Date.now()}`;
  const endpoint = request.nextUrl.pathname;
  const method = request.method;
  
  let response: NextResponse;
  let error: string | undefined;
  
  try {
    response = await handler(request);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
    response = NextResponse.json(
      {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        requestId,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
  
  const responseTime = Date.now() - startTime;
  const statusCode = response.status;
  const userId = request.headers.get('x-user-id') || undefined;
  const cacheHit = response.headers.get('x-cache') === 'HIT';
  
  // Record metric
  recordMetric({
    endpoint,
    method,
    statusCode,
    responseTime,
    timestamp: new Date().toISOString(),
    userId,
    requestId,
    cacheHit,
    error,
  });
  
  // Add timing header
  response.headers.set('X-Response-Time', `${responseTime}ms`);
  response.headers.set('X-Request-Id', requestId);
  
  return response;
}

/**
 * Clear metrics store (for testing)
 */
export function clearMetrics(): void {
  metricsStore.length = 0;
}
