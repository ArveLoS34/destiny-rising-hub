import type {
  ContentLifecycleStatus,
  ContentMetadata,
  ContentVersionRecord,
  ContentPatch,
  ContentPatchChange,
} from '@/types/domain';
import { validationEngine } from './validation/engine';
import { diffEngine } from './diff/engine';
import { importRegistry } from './import/framework';

/**
 * Content Service
 * Manages the complete content lifecycle
 */

export interface ContentEntity {
  id: string;
  type: string;
  data: Record<string, any>;
  status: ContentLifecycleStatus;
  version: number;
  versions: ContentVersionRecord[];
  metadata: ContentMetadata;
  createdAt: string;
  updatedAt: string;
}

export class ContentService {
  // In production, this would use a database
  private entities: Map<string, ContentEntity> = new Map();
  private patches: Map<string, ContentPatch> = new Map();

  /**
   * Create new content
   */
  async create(
    type: string,
    data: Record<string, any>,
    source: string,
    sourceVersion: string
  ): Promise<ContentEntity> {
    const id = data.id || `${type}-${Date.now()}`;
    const now = new Date().toISOString();

    // Validate content
    const validationResult = validationEngine.validate({
      entityType: type,
      data,
      rules: [],
    });

    if (!validationResult.valid) {
      throw new Error(`Validation failed: ${validationResult.errors.map((e: any) => e.message).join(', ')}`);
    }

    const entity: ContentEntity = {
      id,
      type,
      data,
      status: 'imported',
      version: 1,
      versions: [
        {
          version: 1,
          data: { ...data },
          createdAt: now,
          createdBy: 'system',
          changelog: 'Initial import',
        },
      ],
      metadata: {
        source,
        sourceVersion,
        sourceHash: this.generateHash(data),
        importedAt: now,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.entities.set(id, entity);
    return entity;
  }

  /**
   * Update existing content
   */
  async update(
    id: string,
    newData: Record<string, any>,
    source: string,
    sourceVersion: string,
    updatedBy: string = 'system'
  ): Promise<ContentEntity> {
    const entity = this.entities.get(id);
    if (!entity) {
      throw new Error(`Entity ${id} not found`);
    }

    // Generate diff
    const diff = diffEngine.compare(
      entity.type,
      id,
      entity.data,
      newData,
      entity.version,
      entity.version + 1
    );

    // Validate new data
    const validationResult = validationEngine.validate({
      entityType: entity.type,
      data: newData,
      rules: [],
    });

    if (!validationResult.valid) {
      throw new Error(`Validation failed: ${validationResult.errors.map((e: any) => e.message).join(', ')}`);
    }

    const now = new Date().toISOString();
    const newVersion = entity.version + 1;

    entity.data = newData;
    entity.version = newVersion;
    entity.status = 'imported';
    entity.updatedAt = now;
    entity.metadata = {
      ...entity.metadata,
      source,
      sourceVersion,
      sourceHash: this.generateHash(newData),
      importedAt: now,
    };

    entity.versions.push({
      version: newVersion,
      data: { ...newData },
      createdAt: now,
      createdBy: updatedBy,
      changelog: `Updated from v${newVersion - 1}`,
    });

    return entity;
  }

  /**
   * Get content by ID
   */
  async get(id: string): Promise<ContentEntity | undefined> {
    return this.entities.get(id);
  }

  /**
   * Get all content of a type
   */
  async getByType(type: string): Promise<ContentEntity[]> {
    return Array.from(this.entities.values()).filter((e) => e.type === type);
  }

  /**
   * Transition content status
   */
  async transitionStatus(
    id: string,
    newStatus: ContentLifecycleStatus,
    reviewedBy?: string
  ): Promise<ContentEntity> {
    const entity = this.entities.get(id);
    if (!entity) {
      throw new Error(`Entity ${id} not found`);
    }

    const now = new Date().toISOString();
    entity.status = newStatus;
    entity.updatedAt = now;

    if (newStatus === 'published') {
      entity.metadata.publishedAt = now;
    } else if (newStatus === 'archived') {
      entity.metadata.archivedAt = now;
    }

    if (reviewedBy) {
      entity.metadata.reviewedBy = reviewedBy;
      entity.metadata.reviewedAt = now;
    }

    return entity;
  }

  /**
   * Rollback to previous version
   */
  async rollback(id: string, targetVersion: number): Promise<ContentEntity> {
    const entity = this.entities.get(id);
    if (!entity) {
      throw new Error(`Entity ${id} not found`);
    }

    const targetVersionData = entity.versions.find((v) => v.version === targetVersion);
    if (!targetVersionData) {
      throw new Error(`Version ${targetVersion} not found`);
    }

    const now = new Date().toISOString();
    entity.data = { ...targetVersionData.data };
    entity.version = entity.version + 1;
    entity.updatedAt = now;

    entity.versions.push({
      version: entity.version,
      data: { ...targetVersionData.data },
      createdAt: now,
      createdBy: 'system',
      changelog: `Rolled back to v${targetVersion}`,
    });

    return entity;
  }

  /**
   * Import content from source
   */
  async importFromSource(
    sourceId: string,
    sourceType: string,
    data: any[]
  ): Promise<{ imported: number; failed: number; errors: string[] }> {
    const importer = importRegistry.getBySourceType(sourceType);
    if (!importer) {
      throw new Error(`No importer found for source type: ${sourceType}`);
    }

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const item of data) {
      try {
        const existing = this.entities.get(item.id);
        if (existing) {
          await this.update(existing.id, item, sourceId, 'latest');
        } else {
          await this.create(item.type || 'unknown', item, sourceId, 'latest');
        }
        imported++;
      } catch (error) {
        failed++;
        errors.push(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return { imported, failed, errors };
  }

  /**
   * Create patch from version changes
   */
  async createPatch(
    version: string,
    title: string,
    description: string,
    changes: ContentPatchChange[]
  ): Promise<ContentPatch> {
    const now = new Date().toISOString();

    const patch: ContentPatch = {
      id: `patch-${version}`,
      version,
      releaseDate: now,
      title,
      description,
      status: 'released',
      changes,
      diffResults: [],
      createdAt: now,
      updatedAt: now,
    };

    this.patches.set(patch.id, patch);
    return patch;
  }

  /**
   * Get patch by version
   */
  async getPatch(version: string): Promise<ContentPatch | undefined> {
    return Array.from(this.patches.values()).find((p) => p.version === version);
  }

  /**
   * Get all patches
   */
  async getAllPatches(): Promise<ContentPatch[]> {
    return Array.from(this.patches.values()).sort(
      (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
  }

  /**
   * Generate hash for data
   */
  private generateHash(data: Record<string, any>): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get content statistics
   */
  async getStats(): Promise<{
    totalEntities: number;
    byType: Record<string, number>;
    byStatus: Record<ContentLifecycleStatus, number>;
  }> {
    const entities = Array.from(this.entities.values());

    const byType: Record<string, number> = {};
    const byStatus: Record<ContentLifecycleStatus, number> = {
      draft: 0,
      imported: 0,
      validated: 0,
      in_review: 0,
      approved: 0,
      published: 0,
      archived: 0,
    };

    for (const entity of entities) {
      byType[entity.type] = (byType[entity.type] || 0) + 1;
      byStatus[entity.status]++;
    }

    return {
      totalEntities: entities.length,
      byType,
      byStatus,
    };
  }
}

export const contentService = new ContentService();
