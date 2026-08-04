import type { UserManagementAction, UserSession } from '@/types/domain';

/**
 * User Management Service
 * Handles user administration actions
 */

class UserManagementService {
  private actions: Map<string, UserManagementAction> = new Map();
  private bannedUsers: Set<string> = new Set();
  private suspendedUsers: Map<string, { until: string; reason: string }> = new Map();

  banUser(adminId: string, userId: string, reason: string, duration?: number): UserManagementAction {
    const id = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const expiresAt = duration ? new Date(now.getTime() + duration * 24 * 60 * 60 * 1000) : undefined;

    const action: UserManagementAction = {
      id,
      adminId,
      targetUserId: userId,
      action: 'ban',
      reason,
      duration,
      createdAt: now.toISOString(),
      expiresAt: expiresAt?.toISOString(),
    };

    this.actions.set(id, action);
    this.bannedUsers.add(userId);

    return action;
  }

  suspendUser(adminId: string, userId: string, reason: string, duration: number): UserManagementAction {
    const id = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

    const action: UserManagementAction = {
      id,
      adminId,
      targetUserId: userId,
      action: 'suspend',
      reason,
      duration,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    this.actions.set(id, action);
    this.suspendedUsers.set(userId, { until: expiresAt.toISOString(), reason });

    return action;
  }

  warnUser(adminId: string, userId: string, reason: string): UserManagementAction {
    const id = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const action: UserManagementAction = {
      id,
      adminId,
      targetUserId: userId,
      action: 'warn',
      reason,
      createdAt: new Date().toISOString(),
    };

    this.actions.set(id, action);
    return action;
  }

  verifyUser(adminId: string, userId: string): UserManagementAction {
    const id = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const action: UserManagementAction = {
      id,
      adminId,
      targetUserId: userId,
      action: 'verify',
      reason: 'Manual verification by admin',
      createdAt: new Date().toISOString(),
    };

    this.actions.set(id, action);
    return action;
  }

  changeUserRole(adminId: string, userId: string, newRole: string, reason: string): UserManagementAction {
    const id = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const action: UserManagementAction = {
      id,
      adminId,
      targetUserId: userId,
      action: 'role_change',
      reason,
      metadata: { newRole },
      createdAt: new Date().toISOString(),
    };

    this.actions.set(id, action);
    return action;
  }

  isBanned(userId: string): boolean {
    return this.bannedUsers.has(userId);
  }

  isSuspended(userId: string): boolean {
    const suspension = this.suspendedUsers.get(userId);
    if (!suspension) return false;
    
    const now = new Date();
    const until = new Date(suspension.until);
    
    if (now > until) {
      this.suspendedUsers.delete(userId);
      return false;
    }
    
    return true;
  }

  getUserActions(userId: string): UserManagementAction[] {
    return Array.from(this.actions.values())
      .filter((action) => action.targetUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllActions(limit: number = 50): UserManagementAction[] {
    return Array.from(this.actions.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  revokeAction(actionId: string): boolean {
    const action = this.actions.get(actionId);
    if (!action) return false;

    if (action.action === 'ban') {
      this.bannedUsers.delete(action.targetUserId);
    } else if (action.action === 'suspend') {
      this.suspendedUsers.delete(action.targetUserId);
    }

    this.actions.delete(actionId);
    return true;
  }
}

export const userManagementService = new UserManagementService();
