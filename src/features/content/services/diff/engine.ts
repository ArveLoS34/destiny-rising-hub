import type { DiffRecord, DiffResult, DiffOperationType } from '@/types/domain';

/**
 * Diff Engine
 * Detects changes between content versions
 */

export interface DiffConfig {
  ignoreFields?: string[];
  sensitivity?: 'low' | 'medium' | 'high';
}

export class DiffEngine {
  /**
   * Compare two versions of an entity
   */
  compare(
    entityType: string,
    entityId: string,
    oldData: Record<string, any>,
    newData: Record<string, any>,
    oldVersion: number,
    newVersion: number,
    config: DiffConfig = {}
  ): DiffResult {
    const changes: DiffRecord[] = [];
    const ignoreFields = new Set(config.ignoreFields || ['updatedAt', 'importedAt']);

    // Get all fields from both objects
    const allFields = new Set([
      ...Object.keys(oldData),
      ...Object.keys(newData),
    ]);

    for (const field of allFields) {
      if (ignoreFields.has(field)) continue;

      const oldValue = oldData[field];
      const newValue = newData[field];

      const diff = this.compareField(field, oldValue, newValue, config);
      if (diff) {
        changes.push(diff);
      }
    }

    return {
      entityId,
      entityType,
      oldVersion,
      newVersion,
      changes,
      summary: this.generateSummary(changes),
    };
  }

  /**
   * Compare a single field
   */
  private compareField(
    field: string,
    oldValue: any,
    newValue: any,
    config: DiffConfig
  ): DiffRecord | null {
    // Field added
    if (oldValue === undefined && newValue !== undefined) {
      return {
        field,
        operation: 'add',
        newValue,
        impact: this.calculateImpact(field, newValue, undefined, config),
      };
    }

    // Field removed
    if (oldValue !== undefined && newValue === undefined) {
      return {
        field,
        operation: 'remove',
        oldValue,
        impact: this.calculateImpact(field, undefined, oldValue, config),
      };
    }

    // Field modified
    if (!this.isEqual(oldValue, newValue)) {
      return {
        field,
        operation: 'modify',
        oldValue,
        newValue,
        impact: this.calculateImpact(field, newValue, oldValue, config),
      };
    }

    return null;
  }

  /**
   * Deep equality check
   */
  private isEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return false;

    if (typeof a === 'object') {
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((item, index) => this.isEqual(item, b[index]));
      }

      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;

      return keysA.every((key) => this.isEqual(a[key], b[key]));
    }

    return false;
  }

  /**
   * Calculate impact level of a change
   */
  private calculateImpact(
    field: string,
    newValue: any,
    oldValue: any,
    config: DiffConfig
  ): 'low' | 'medium' | 'high' {
    const sensitivity = config.sensitivity || 'medium';

    // High impact fields
    const highImpactFields = [
      'stats',
      'skills',
      'talents',
      'rarity',
      'element',
      'role',
    ];

    // Medium impact fields
    const mediumImpactFields = [
      'name',
      'description',
      'weaponType',
      'faction',
      'tier',
    ];

    if (highImpactFields.some((f) => field.toLowerCase().includes(f.toLowerCase()))) {
      return 'high';
    }

    if (mediumImpactFields.some((f) => field.toLowerCase().includes(f.toLowerCase()))) {
      return 'medium';
    }

    // Numeric changes
    if (typeof newValue === 'number' && typeof oldValue === 'number') {
      const changePercent = Math.abs((newValue - oldValue) / oldValue) * 100;
      
      if (changePercent > 20) return 'high';
      if (changePercent > 10) return 'medium';
      return 'low';
    }

    return sensitivity === 'high' ? 'medium' : 'low';
  }

  /**
   * Generate summary of changes
   */
  private generateSummary(changes: DiffRecord[]): DiffResult['summary'] {
    const additions = changes.filter((c) => c.operation === 'add').length;
    const removals = changes.filter((c) => c.operation === 'remove').length;
    const modifications = changes.filter((c) => c.operation === 'modify').length;
    const highImpactChanges = changes.filter((c) => c.impact === 'high').length;

    return {
      totalChanges: changes.length,
      additions,
      removals,
      modifications,
      highImpactChanges,
    };
  }

  /**
   * Compare multiple entities
   */
  compareBatch(
    entityType: string,
    oldEntities: Record<string, Record<string, any>>,
    newEntities: Record<string, Record<string, any>>,
    config: DiffConfig = {}
  ): {
    results: DiffResult[];
    summary: {
      totalEntities: number;
      changedEntities: number;
      unchangedEntities: number;
      newEntities: number;
      removedEntities: number;
    };
  } {
    const results: DiffResult[] = [];
    const allIds = new Set([
      ...Object.keys(oldEntities),
      ...Object.keys(newEntities),
    ]);

    let changedEntities = 0;
    let newEntitiesCount = 0;
    let removedEntitiesCount = 0;

    for (const entityId of allIds) {
      const oldData = oldEntities[entityId];
      const newData = newEntities[entityId];

      if (!oldData && newData) {
        // New entity
        results.push({
          entityId,
          entityType,
          oldVersion: 0,
          newVersion: 1,
          changes: Object.keys(newData).map((field) => ({
            field,
            operation: 'add' as DiffOperationType,
            newValue: newData[field],
            impact: 'medium' as const,
          })),
          summary: {
            totalChanges: Object.keys(newData).length,
            additions: Object.keys(newData).length,
            removals: 0,
            modifications: 0,
            highImpactChanges: 0,
          },
        });
        newEntitiesCount++;
        changedEntities++;
      } else if (oldData && !newData) {
        // Removed entity
        results.push({
          entityId,
          entityType,
          oldVersion: 1,
          newVersion: 0,
          changes: Object.keys(oldData).map((field) => ({
            field,
            operation: 'remove' as DiffOperationType,
            oldValue: oldData[field],
            impact: 'high' as const,
          })),
          summary: {
            totalChanges: Object.keys(oldData).length,
            additions: 0,
            removals: Object.keys(oldData).length,
            modifications: 0,
            highImpactChanges: Object.keys(oldData).length,
          },
        });
        removedEntitiesCount++;
        changedEntities++;
      } else if (oldData && newData) {
        // Modified entity
        const diff = this.compare(entityType, entityId, oldData, newData, 1, 2, config);
        if (diff.changes.length > 0) {
          results.push(diff);
          changedEntities++;
        }
      }
    }

    return {
      results,
      summary: {
        totalEntities: allIds.size,
        changedEntities,
        unchangedEntities: allIds.size - changedEntities,
        newEntities: newEntitiesCount,
        removedEntities: removedEntitiesCount,
      },
    };
  }

  /**
   * Generate human-readable diff report
   */
  generateReport(diff: DiffResult): string {
    const lines: string[] = [];

    lines.push(`# Diff Report: ${diff.entityType} ${diff.entityId}`);
    lines.push(`Version ${diff.oldVersion} → ${diff.newVersion}`);
    lines.push('');

    lines.push(`## Summary`);
    lines.push(`- Total Changes: ${diff.summary.totalChanges}`);
    lines.push(`- Additions: ${diff.summary.additions}`);
    lines.push(`- Removals: ${diff.summary.removals}`);
    lines.push(`- Modifications: ${diff.summary.modifications}`);
    lines.push(`- High Impact: ${diff.summary.highImpactChanges}`);
    lines.push('');

    if (diff.changes.length > 0) {
      lines.push(`## Changes`);
      
      const highImpact = diff.changes.filter((c) => c.impact === 'high');
      const mediumImpact = diff.changes.filter((c) => c.impact === 'medium');
      const lowImpact = diff.changes.filter((c) => c.impact === 'low');

      if (highImpact.length > 0) {
        lines.push(`### High Impact Changes`);
        highImpact.forEach((change) => {
          lines.push(this.formatChange(change));
        });
        lines.push('');
      }

      if (mediumImpact.length > 0) {
        lines.push(`### Medium Impact Changes`);
        mediumImpact.forEach((change) => {
          lines.push(this.formatChange(change));
        });
        lines.push('');
      }

      if (lowImpact.length > 0) {
        lines.push(`### Low Impact Changes`);
        lowImpact.forEach((change) => {
          lines.push(this.formatChange(change));
        });
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * Format a single change for report
   */
  private formatChange(change: DiffRecord): string {
    const operationSymbol = {
      add: '+',
      remove: '-',
      modify: '~',
    }[change.operation];

    if (change.operation === 'add') {
      return `- ${operationSymbol} ${change.field}: ${JSON.stringify(change.newValue)}`;
    }

    if (change.operation === 'remove') {
      return `- ${operationSymbol} ${change.field}: ${JSON.stringify(change.oldValue)}`;
    }

    return `- ${operationSymbol} ${change.field}: ${JSON.stringify(change.oldValue)} → ${JSON.stringify(change.newValue)}`;
  }
}

export const diffEngine = new DiffEngine();
