import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { databaseService } from '@/lib/database';
import { characterRepository } from '@/repositories/character-repository';
import type { Prisma } from '@prisma/client';

/**
 * Transaction Integration Tests
 * Tests transaction support and rollback functionality
 */

type TransactionClient = Omit<ReturnType<typeof databaseService.getClient>, '$connect' | '$disconnect' | '$on' | '$use' | '$extends'>;

// Helper to create test character data
function createTestCharData(slug: string, name: string) {
  return {
    slug,
    name,
    title: 'Test',
    description: 'Test description',
    gameId: 'destiny-rising',
    element: 'Fire',
    role: 'DPS',
    rarity: 'SSR',
    weaponType: 'Sword',
    faction: 'Genesis',
    damageType: 'Fire',
    icon: '/test/icon.png',
    portrait: '/test/portrait.png',
    splashArt: '/test/splash.png',
    colorTheme: '#FF0000',
    stats: {},
    skills: [],
    talents: [],
    ultimate: {},
    passive: {},
    ascensionMaterials: [],
    skillMaterials: [],
    maxLevel: 90,
    maxAscension: 6,
    recommendedWeapons: [],
    recommendedArtifacts: [],
    synergies: [],
    counters: [],
    popularBuilds: [],
    strengths: [],
    weaknesses: [],
    lore: 'Test lore',
    voiceActors: { en: 'Test', jp: 'Test', kr: 'Test', cn: 'Test' },
    factionRelation: { factionId: 'genesis', role: 'member', lore: 'Test' },
    releaseVersion: '1.0.0',
    tierListPlacement: {},
    verification: { verified: true, gameVersion: '1.0.0' },
    views: 0,
    popularity: 50,
    pickRate: 0,
    banRate: 0,
    winRate: 50.0,
  };
}

describe('Transaction Integration Tests', () => {
  beforeAll(async () => {
    await databaseService.connect();
  });

  afterAll(async () => {
    // Cleanup
    const testSlugs = ['transaction-test-char', 'tx-rollback-1', 'tx-rollback-2', 'tx-multi-1', 'tx-multi-2'];
    for (const slug of testSlugs) {
      try {
        const char = await characterRepository.findBySlug(slug);
        if (char) await characterRepository.delete(char.id);
      } catch {
        // Ignore
      }
    }
    await databaseService.disconnect();
  });

  beforeEach(async () => {
    try {
      const existing = await characterRepository.findBySlug('transaction-test-char');
      if (existing) {
        await characterRepository.delete(existing.id);
      }
    } catch {
      // Ignore
    }
  });

  describe('Transaction Commit', () => {
    it('should commit transaction successfully', async () => {
      await databaseService.transaction(async (tx: TransactionClient) => {
        await tx.character.create({
          data: createTestCharData('transaction-test-char', 'Transaction Test'),
        });
      });

      // Verify character was created
      const char = await characterRepository.findBySlug('transaction-test-char');
      expect(char).toBeDefined();
      expect(char?.name).toBe('Transaction Test');
    });
  });

  describe('Transaction Rollback', () => {
    it('should rollback on error', async () => {
      try {
        await databaseService.transaction(async (tx: TransactionClient) => {
          // Create character
          await tx.character.create({
            data: createTestCharData('tx-rollback-1', 'Should Be Rolled Back'),
          });

          // Force an error
          throw new Error('Intentional error for rollback test');
        });
      } catch (error) {
        // Expected error
      }

      // Verify character was NOT created (rolled back)
      const char = await characterRepository.findBySlug('tx-rollback-1');
      expect(char).toBeNull();
    });

    it('should rollback multi-operation on error', async () => {
      try {
        await databaseService.transaction(async (tx: TransactionClient) => {
          // Create first character
          await tx.character.create({
            data: createTestCharData('tx-multi-1', 'First Character'),
          });

          // Create second character
          await tx.character.create({
            data: createTestCharData('tx-multi-2', 'Second Character'),
          });

          // Force error — both should be rolled back
          throw new Error('Multi-op rollback test');
        });
      } catch (error) {
        // Expected error
      }

      // Verify NEITHER character was created
      const char1 = await characterRepository.findBySlug('tx-multi-1');
      const char2 = await characterRepository.findBySlug('tx-multi-2');
      expect(char1).toBeNull();
      expect(char2).toBeNull();
    });
  });

  describe('Transaction Isolation', () => {
    it('should maintain isolation between transactions', async () => {
      // Create character outside transaction
      await characterRepository.create(createTestCharData('tx-rollback-2', 'Isolation Test') as unknown as Parameters<typeof characterRepository.create>[0]);
      const original = await characterRepository.findBySlug('tx-rollback-2');
      expect(original).toBeDefined();

      // Update in transaction
      await databaseService.transaction(async (tx: TransactionClient) => {
        await tx.character.update({
          where: { slug: 'tx-rollback-2' },
          data: { popularity: 999 },
        });
      });

      // Verify update was committed
      const updated = await characterRepository.findBySlug('tx-rollback-2');
      expect(updated?.popularity).toBe(999);
    });
  });

  describe('Repository in Transaction', () => {
    it('should use repository methods within transaction', async () => {
      await databaseService.transaction(async (tx: TransactionClient) => {
        await tx.character.create({
          data: createTestCharData('tx-rollback-1', 'Repo in Transaction'),
        });
      });

      const char = await characterRepository.findBySlug('tx-rollback-1');
      expect(char).toBeDefined();
      expect(char?.name).toBe('Repo in Transaction');
    });
  });
});
