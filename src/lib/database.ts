import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

/**
 * Database Service
 * Manages database connections and operations
 */

class DatabaseService {
  private prisma: PrismaClient;
  private isConnected: boolean = false;

  constructor() {
    this.prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      this.prisma.$on('query' as never, (e: any) => {
        logger.debug('Database', `Query: ${e.query}`, {
          duration: e.duration,
          params: e.params,
        });
      });
    }
  }

  /**
   * Connect to database
   */
  async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      this.isConnected = true;
      logger.info('Database', 'Connected to database');
    } catch (error) {
      logger.error('Database', 'Failed to connect to database', { error });
      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      this.isConnected = false;
      logger.info('Database', 'Disconnected from database');
    } catch (error) {
      logger.error('Database', 'Failed to disconnect from database', { error });
      throw error;
    }
  }

  /**
   * Check if connected
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database', 'Health check failed', { error });
      return false;
    }
  }

  /**
   * Execute transaction
   */
  async transaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  /**
   * Get Prisma client
   */
  getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Check connection status
   */
  isDatabaseConnected(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
export const databaseService = new DatabaseService();
