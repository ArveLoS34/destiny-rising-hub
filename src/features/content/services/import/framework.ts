import type { ImportSource, ImportJob, ImportResult, ImportError } from '@/types/domain';

/**
 * Import Framework
 * Common interface for all data importers
 */

export interface ImporterConfig {
  batchSize?: number;
  validateOnImport?: boolean;
  skipDuplicates?: boolean;
  updateExisting?: boolean;
}

export interface ImporterContext {
  source: ImportSource;
  job: ImportJob;
  config: ImporterConfig;
  stats: {
    total: number;
    processed: number;
    failed: number;
    skipped: number;
  };
}

export interface Importer {
  /**
   * Unique identifier for this importer
   */
  id: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Import source type
   */
  sourceType: string;

  /**
   * Validate source configuration
   */
  validateConfig(config: Record<string, any>): { valid: boolean; errors: string[] };

  /**
   * Fetch raw data from source
   */
  fetchData(context: ImporterContext): Promise<any[]>;

  /**
   * Transform raw data to internal format
   */
  transformData(rawData: any[], context: ImporterContext): Promise<any[]>;

  /**
   * Import transformed data
   */
  importData(data: any[], context: ImporterContext): Promise<ImportResult>;

  /**
   * Execute full import pipeline
   */
  execute(context: ImporterContext): Promise<ImportResult>;
}

/**
 * Base Importer with common functionality
 */
export abstract class BaseImporter implements Importer {
  abstract id: string;
  abstract name: string;
  abstract sourceType: string;

  validateConfig(config: Record<string, any>): { valid: boolean; errors: string[] } {
    return { valid: true, errors: [] };
  }

  abstract fetchData(context: ImporterContext): Promise<any[]>;
  abstract transformData(rawData: any[], context: ImporterContext): Promise<any[]>;
  abstract importData(data: any[], context: ImporterContext): Promise<ImportResult>;

  async execute(context: ImporterContext): Promise<ImportResult> {
    const errors: ImportError[] = [];

    try {
      // Fetch data
      const rawData = await this.fetchData(context);
      context.stats.total = rawData.length;

      // Transform data
      const transformedData = await this.transformData(rawData, context);

      // Import data
      const result = await this.importData(transformedData, context);

      return result;
    } catch (error) {
      errors.push({
        recordId: 'import-job',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: { error },
      });

      return {
        success: false,
        totalRecords: context.stats.total,
        processedRecords: context.stats.processed,
        failedRecords: context.stats.failed,
        errors,
      };
    }
  }

  protected async processInBatches<T>(
    data: T[],
    batchSize: number,
    processor: (batch: T[], context: ImporterContext) => Promise<void>,
    context: ImporterContext
  ): Promise<void> {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await processor(batch, context);
      context.stats.processed += batch.length;
    }
  }
}

/**
 * Import Registry - manages all available importers
 */
export class ImportRegistry {
  private importers: Map<string, Importer> = new Map();

  register(importer: Importer): void {
    this.importers.set(importer.id, importer);
  }

  get(id: string): Importer | undefined {
    return this.importers.get(id);
  }

  getBySourceType(sourceType: string): Importer | undefined {
    return Array.from(this.importers.values()).find(
      (imp) => imp.sourceType === sourceType
    );
  }

  getAll(): Importer[] {
    return Array.from(this.importers.values());
  }
}

export const importRegistry = new ImportRegistry();
