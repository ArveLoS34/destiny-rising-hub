import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { databaseService } from '@/lib/database';
import { characterRepository } from '@/repositories/character-repository';

/**
 * Transaction Integration Tests
 * Tests transaction support and rollback functionality
 */

describe('Transaction Integration Tests', () => {
  beforeAll(async () => {
    await databaseService.connect();
  });

  afterAll(async () => {
    await databaseService.disconnect();
  });

  beforeEach(async () => {
    // Clean up any test data
    try {
      const existing = await characterRepository.findBySlug('transaction-test-char');
      if (existing) {
        await characterRepository.delete(existing.id);
      }
    } catch (error) {
      // Ignore
    }
  });

  describe('Transaction Commit', () => {
    it('should commit transaction successfully', async () => {
      const prisma = databaseService.getClient();

      await databaseService.transaction(async (tx) => {
        // Create character within transaction
        await tx.character.create({
          data: {
            slug: 'transaction-test-char',
            name: 'Transaction Test',
            title: 'Test',
            description: 'Test',
            element: 'Fire',
            role: 'DPS',
            rarity: 'SSR',
            weaponType: 'Sword',
            faction: 'Genesis',
            icon: '/test/icon.png',
            portrait: '/test/portrait.png',
            colorTheme: '#FF0000',
            stats: {
              baseHP: 10000,
              baseATK: 300,
              baseDEF: 200,
              baseSPD: 100,
              baseCR: 0.05,
              baseCD: 0.5,
              growthHP: 1000,
              growthATK: 30,
              growthDEF: 20,
              growthSPD: 0,
            },
            skills: [],
            talents: [],
            ascensionMaterials: [],
            skillMaterials: [],
            recommendedWeapons: [],
            recommendedArtifacts: [],
            synergies: [],
            counters: [],
            popularBuilds: [],
            strengths: [],
            weaknesses: [],
            lore: 'Test',
            voiceActors: { en: 'Test', jp: 'Test', kr: 'Test', cn: 'Test' },
            factionRelation: { factionId: 'genesis', role: 'member', lore: 'Test' },
            releaseVersion: '1.0.0',
            tierListPlacement: { overall: 'S', dps: 'S', support: 'B', pve: 'S', pvp: 'A' },
            verification: {
              source: 'Test',
              gameVersion: '1.0.0',
              verified: true,
              verifiedAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
            },
            views: 0,
            popularity: 50,
            winRate: 50.0,
          },
        });

        // Create audit log within same transaction
        await tx.auditLog.create({
          data: {
            userId: 'test-user',
            action: 'CREATE_CHARACTER',
            entityType: 'character',
            entityId: 'transaction-test-char',
            changes: { before: null, after: { name: 'Transaction Test' } },
            metadata: { test: true },
            ipAddress: '127.0.0.1',
            userAgent: 'test',
          },
        });
      });

      // Verify both were committed
      const character = await characterRepository.findBySlug('transaction-test-char');
      expect(character).toBeDefined();

      const prisma = databaseService.getClient();
      const auditLog = await prisma.auditLog.findFirst({
        where: { entityId: 'transaction-test-char' },
      });
      expect(auditLog).toBeDefined();
    });
  });

  describe('Transaction Rollback', () => {
    it('should rollback transaction on error', async () => {
      const prisma = databaseService.getClient();

      try {
        await databaseService.transaction(async (tx) => {
          // Create character
          await tx.character.create({
            data: {
              slug: 'rollback-test-char',
              name: 'Rollback Test',
              title: 'Test',
              description: 'Test',
              element: 'Fire',
              role: 'DPS',
              rarity: 'SSR',
              weaponType: 'Sword',
              faction: 'Genesis',
              icon: '/test/icon.png',
              portrait: '/test/portrait.png',
              colorTheme: '#FF0000',
              stats: {
                baseHP: 10000,
                baseATK: 300,
                baseDEF: 200,
                baseSPD: 100,
                baseCR: 0.05,
                baseCD: 0.5,
                growthHP: 1000,
                growthATK: 30,
                growthDEF: 20,
                growthSPD: 0,
              },
              skills: [],
              talents: [],
              ascensionMaterials: [],
              skillMaterials: [],
              recommendedWeapons: [],
              recommendedArtifacts: [],
              synergies: [],
              counters: [],
              popularBuilds: [],
              strengths: [],
              weaknesses: [],
              lore: 'Test',
              voiceActors: { en: 'Test', jp: 'Test', kr: 'Test', cn: 'Test' },
              factionRelation: { factionId: 'genesis', role: 'member', lore: 'Test' },
              releaseVersion: '1.0.0',
              tierListPlacement: { overall: 'S', dps: 'S', support: 'B', pve: 'S', pvp: 'A' },
              verification: {
                source: 'Test',
                gameVersion: '1.0.0',
                verified: true,
                verifiedAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
              },
              views: 0,
              popularity: 50,
              winRate: 50.0,
            },
          });

          // Throw error to trigger rollback
          throw new Error('Intentional error for rollback test');
        });
      } catch (error) {
        // Expected error
        expect(error).toBeInstanceOf(Error);
      }

      // Verify character was NOT created (rollback worked)
      const character = await characterRepository.findBySlug('rollback-test-char');
      expect(character).toBeNull();
    });

    it('should rollback multiple operations on error', async () => {
      const prisma = databaseService.getClient();

      try {
        await databaseService.transaction(async (tx) => {
          // Create multiple characters
          await tx.character.create({
            data: {
              slug: 'rollback-multi-1',
              name: 'Rollback Multi 1',
              title: 'Test',
              description: 'Test',
              element: 'Fire',
              role: 'DPS',
              rarity: 'SSR',
              weaponType: 'Sword',
              faction: 'Genesis',
              icon: '/test/icon.png',
              portrait: '/test/portrait.png',
              colorTheme: '#FF0000',
              stats: {
                baseHP: 10000,
                baseATK: 300,
                baseDEF: 200,
                baseSPD: 100,
                baseCR: 0.05,
                baseCD: 0.5,
                growthHP: 1000,
                growthATK: 30,
                growthDEF: 20,
                growthSPD: 0,
              },
              skills: [],
              talents: [],
              ascensionMaterials: [],
              skillMaterials: [],
              recommendedWeapons: [],
              recommendedArtifacts: [],
              synergies: [],
              counters: [],
              popularBuilds: [],
              strengths: [],
              weaknesses: [],
              lore: 'Test',
              voiceActors: { en: 'Test', jp: 'Test', kr: 'Test', cn: 'Test' },
              factionRelation: { factionId: 'genesis', role: 'member', lore: 'Test' },
              releaseVersion: '1.0.0',
              tierListPlacement: { overall: 'S', dps: 'S', support: 'B', pve: 'S', pvp: 'A' },
              verification: {
                source: 'Test',
                gameVersion: '1.0.0',
                verified: true,
                verifiedAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
              },
              views: 0,
              popularity: 50,
              winRate: 50.0,
            },
          });

          await tx.character.create({
            data: {
              slug: 'rollback-multi-2',
              name: 'Rollback Multi 2',
              title: 'Test',
              description: 'Test',
              element: 'Water',
              role: 'Support',
              rarity: 'SR',
              weaponType: 'Staff',
              faction: 'Stellar',
              icon: '/test/icon.png',
              portrait: '/test/portrait.png',
              colorTheme: '#0000FF',
              stats: {
                baseHP: 12000,
                baseATK: 250,
                baseDEF: 250,
                baseSPD: 90,
                baseCR: 0.05,
                baseCD: 0.5,
                growthHP: 1200,
                growthATK: 25,
                growthDEF: 25,
                growthSPD: 0,
              },
              skills: [],
              talents: [],
              ascensionMaterials: [],
              skillMaterials: [],
              recommendedWeapons: [],
              recommendedArtifacts: [],
              synergies: [],
              counters: [],
              popularBuilds: [],
              strengths: [],
              weaknesses: [],
              lore: 'Test',
              voiceActors: { en: 'Test', jp: 'Test', kr: 'Test', cn: 'Test' },
              factionRelation: { factionId: 'stellar', role: 'member', lore: 'Test' },
              releaseVersion: '1.0.0',
              tierListPlacement: { overall: 'S', dps: 'S', support: 'B', pve: 'S', pvp: 'A' },
              verification: {
                source: 'Test',
                gameVersion: '1.0.0',
                verified: true,
                verifiedAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
              },
              views: 0,
              popularity: 50,
              winRate: 50.0,
            },
          });

          // Throw error to trigger rollback
          throw new Error('Intentional error for multi-rollback test');
        });
      } catch (error) {
        // Expected error
        expect(error).toBeInstanceOf(Error);
      }

      // Verify neither character was created (rollback worked)
      const char1 = await characterRepository.findBySlug('rollback-multi-1');
      const char2 = await characterRepository.findBySlug('rollback-multi-2');
      
      expect(char1).toBeNull();
      expect(char2).toBeNull();
    });
  });

  describe('Transaction Isolation', () => {
    it('should isolate concurrent transactions', async () => {
      const prisma = databaseService.getClient();

      // Create initial character
      await characterRepository.create({
        slug: 'isolation-test-char',
        name: 'Isolation Test',
        title: 'Test',
        description: 'Test',
        element: 'Fire',
        role: 'DPS',
        rarity: 'SSR',
        weaponType: 'Sword',
        faction: 'Genesis',
        icon: '/test/icon.png',
        portrait: '/test/portrait.png',
        colorTheme: '#FF0000',
        stats: {
          baseHP: 10000,
          baseATK: 300,
          baseDEF: 200,
          baseSPD: 100,
          baseCR: 0.05,
          baseCD: 0.5,
          growthHP: 1000,
          growthATK: 30,
          growthDEF: 20,
          growthSPD: 0,
        },
        skills: [],
        talents: [],
        ascensionMaterials: [],
        skillMaterials: [],
        recommendedWeapons: [],
        recommendedArtifacts: [],
        synergies: [],
        counters: [],
        popularBuilds: [],
        strengths: [],
        weaknesses: [],
        lore: 'Test',
        voiceActors: { en: 'Test', jp: 'Test', kr: 'Test', cn: 'Test' },
        factionRelation: { factionId: 'genesis', role: 'member', lore: 'Test' },
        releaseVersion: '1.0.0',
        tierListPlacement: { overall: 'S', dps: 'S', support: 'B', pve: 'S', pvp: 'A' },
        verification: {
          source: 'Test',
          gameVersion: '1.0.0',
          verified: true,
          verifiedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        },
        views: 0,
        popularity: 50,
        winRate: 50.0,
      });

      const char = await characterRepository.findBySlug('isolation-test-char');
      if (!char) return;

      // Run concurrent transactions
      await Promise.all([
        databaseService.transaction(async (tx) => {
          await tx.character.update({
            where: { id: char.id },
            data: { popularity: { increment: 10 } },
          });
          // Simulate long-running transaction
          await new Promise(resolve => setTimeout(resolve, 100));
        }),
        databaseService.transaction(async (tx) => {
          await tx.character.update({
            where: { id: char.id },
            data: { popularity: { increment: 20 } },
          });
          // Simulate long-running transaction
          await new Promise(resolve => setTimeout(resolve, 100));
        }),
      ]);

      // Verify both increments were applied
      const updated = await characterRepository.findById(char.id);
      expect(updated?.popularity).toBe(80); // 50 + 10 + 20

      // Cleanup
      await characterRepository.delete(char.id);
    });
  });
});
