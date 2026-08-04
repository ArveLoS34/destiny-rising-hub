import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, ErrorCode } from './errors';

/**
 * API Permissions
 * Role-based access control for API endpoints
 */

export type Permission = 'public' | 'authenticated' | 'moderator' | 'admin' | 'superadmin';

export interface UserContext {
  userId?: string;
  role?: 'member' | 'contributor' | 'verified_creator' | 'moderator' | 'admin';
  isAuthenticated: boolean;
}

/**
 * Check if user has required permission
 */
export function checkPermission(
  user: UserContext,
  requiredPermission: Permission
): boolean {
  // Public endpoints are accessible to everyone
  if (requiredPermission === 'public') {
    return true;
  }

  // All other permissions require authentication
  if (!user.isAuthenticated) {
    return false;
  }

  // Role hierarchy
  const roleHierarchy: Record<string, number> = {
    member: 1,
    contributor: 2,
    verified_creator: 3,
    moderator: 4,
    admin: 5,
  };

  const userLevel = user.role ? roleHierarchy[user.role] || 0 : 0;

  switch (requiredPermission) {
    case 'authenticated':
      return user.isAuthenticated;
    case 'moderator':
      return userLevel >= roleHierarchy.moderator;
    case 'admin':
      return userLevel >= roleHierarchy.admin;
    case 'superadmin':
      return user.role === 'admin'; // Only admins can be superadmin
    default:
      return false;
  }
}

/**
 * Extract user context from request
 * In production, this would validate JWT/session
 */
export async function extractUserContext(request: NextRequest): Promise<UserContext> {
  // Get authorization header
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAuthenticated: false };
  }

  const token = authHeader.substring(7);

  try {
    // In production, validate token and extract user info
    // For now, return mock data
    // TODO: Implement real JWT validation
    
    return {
      userId: 'user_123',
      role: 'member',
      isAuthenticated: true,
    };
  } catch (error) {
    return { isAuthenticated: false };
  }
}

/**
 * Create permission denied error response
 */
export function createPermissionError(
  requiredPermission: Permission,
  requestId: string,
  path: string
) {
  const message = requiredPermission === 'authenticated'
    ? 'Authentication required'
    : `Insufficient permissions. Required: ${requiredPermission}`;

  const code: ErrorCode = requiredPermission === 'authenticated'
    ? 'UNAUTHORIZED'
    : 'FORBIDDEN';

  return createErrorResponse(code, message, undefined, requestId, path);
}

/**
 * Middleware to check permissions
 */
export async function withPermission(
  request: NextRequest,
  requiredPermission: Permission,
  handler: (request: NextRequest, user: UserContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await extractUserContext(request);
  const requestId = request.headers.get('x-request-id') || `req_${Date.now()}`;

  if (!checkPermission(user, requiredPermission)) {
    const error = createPermissionError(requiredPermission, requestId, request.nextUrl.pathname);
    const status = requiredPermission === 'authenticated' ? 401 : 403;
    return NextResponse.json(error, { status });
  }

  return handler(request, user);
}

/**
 * Get user's owned resource IDs
 * For resource-level permissions
 */
export function getUserOwnedResources(userId: string): string[] {
  // In production, query database for user's resources
  // For now, return empty array
  return [];
}

/**
 * Check if user owns a specific resource
 */
export function checkResourceOwnership(
  userId: string,
  resourceId: string
): boolean {
  const ownedResources = getUserOwnedResources(userId);
  return ownedResources.includes(resourceId);
}
