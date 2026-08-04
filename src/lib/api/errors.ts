/**
 * API Error Types and Handlers
 * Standardized error format for all API endpoints
 */

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE';

export interface ApiError {
  success: false;
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
  requestId: string;
  timestamp: string;
  path: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  requestId: string;
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Create standardized error response
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  details?: Record<string, any>,
  requestId?: string,
  path?: string
): ApiError {
  return {
    success: false,
    code,
    message,
    details,
    requestId: requestId || generateRequestId(),
    timestamp: new Date().toISOString(),
    path: path || 'unknown',
  };
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: ApiSuccess<T>['meta'],
  requestId?: string
): ApiSuccess<T> {
  return {
    success: true,
    data,
    meta,
    requestId: requestId || generateRequestId(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Map HTTP status codes to error codes
 */
export function getErrorCodeFromStatus(status: number): ErrorCode {
  const mapping: Record<number, ErrorCode> = {
    400: 'VALIDATION_ERROR',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    429: 'RATE_LIMIT_EXCEEDED',
    500: 'INTERNAL_ERROR',
    503: 'SERVICE_UNAVAILABLE',
  };
  return mapping[status] || 'INTERNAL_ERROR';
}

/**
 * Get HTTP status code from error code
 */
export function getStatusFromErrorCode(code: ErrorCode): number {
  const mapping: Record<ErrorCode, number> = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    RATE_LIMIT_EXCEEDED: 429,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  };
  return mapping[code];
}
