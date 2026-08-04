import type { AuditLog } from '@/types/domain';

/**
 * Audit Service
 * Tracks all administrative actions and changes
 */

class AuditService {
  private logs: AuditLog[] = [];

  log(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    changes?: { before?: Record<string, any>; after?: Record<string, any> },
    metadata?: Record<string, any>,
    ipAddress: string = '127.0.0.1',
    userAgent: string = 'Unknown'
  ): AuditLog {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      entityType,
      entityId,
      changes,
      metadata,
      ipAddress,
      userAgent,
      createdAt: new Date().toISOString(),
    };

    this.logs.push(log);
    return log;
  }

  getByUser(userId: string, limit: number = 50): AuditLog[] {
    return this.logs
      .filter((log) => log.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  getByEntity(entityType: string, entityId: string): AuditLog[] {
    return this.logs
      .filter((log) => log.entityType === entityType && log.entityId === entityId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getByAction(action: string, limit: number = 50): AuditLog[] {
    return this.logs
      .filter((log) => log.action === action)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  getAll(limit: number = 100, offset: number = 0): AuditLog[] {
    return this.logs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  search(query: string): AuditLog[] {
    const queryLower = query.toLowerCase();
    return this.logs.filter(
      (log) =>
        log.action.toLowerCase().includes(queryLower) ||
        log.entityType.toLowerCase().includes(queryLower) ||
        log.entityId.toLowerCase().includes(queryLower) ||
        log.userId.toLowerCase().includes(queryLower)
    );
  }

  getStats(): {
    totalLogs: number;
    actionsByType: Record<string, number>;
    entitiesByType: Record<string, number>;
    recentActivity: number;
  } {
    const actionsByType: Record<string, number> = {};
    const entitiesByType: Record<string, number> = {};

    this.logs.forEach((log) => {
      actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
      entitiesByType[log.entityType] = (entitiesByType[log.entityType] || 0) + 1;
    });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = this.logs.filter((log) => new Date(log.createdAt) > oneDayAgo).length;

    return {
      totalLogs: this.logs.length,
      actionsByType,
      entitiesByType,
      recentActivity,
    };
  }
}

export const auditService = new AuditService();
