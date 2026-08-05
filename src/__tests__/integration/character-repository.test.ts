import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { characterRepository } from '@/repositories/character-repository';
import { databaseService } from '@/lib/database';

/**
 * Character Repository Integration Tests
 * Tests real database operations with PostgreSQL
 * 
 * Note: Tests use 'as any' for test data to avoid domain type vs Prisma type conflicts.
 * The repository layer handles the mapping between Prisma and domain types.
 */

describe('CharacterRepository Integration Tests', () => {
  let testCharacterId: string;

  beforeAll(async () => {
    await databaseService.connect();
  });

  afterAll(async () => {
    if (testCharacterId) {
      try {
        await characterRepository.delete(testCharacterId);
      } catch {
        // Ignore if already deleted
      }
    }
    await databaseService.disconnect();
  });

  beforeEach(async () => {
    try {
      const existing = await characterRepository.findBySlug('test-character-integration');
      if (existing) {
        await characterRepository.delete(existing.id);
      }
    } catch {
      // Ignore
    }
  });

  describe('Database Connection', () => {
    it('should connect to database successfully', async () => {
      const isConnected = await databaseService.healthCheck();
      expect(isConnected).toBe(true);
    });

    it('should have character table', async () => {
      const prisma = databaseService.getClient();
      await prisma.character.count();
    });
  });

  describe('CRUD Operations', () => {
    it('should create a character', async () => {
      const characterData = {
        slug: 'test-character-integration',
        name: 'Test Character',
        title: 'Test Title',
        description: 'Test Description',
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
        stats: {
          baseHP: 10000,
          baseATK: 300,
          baseDEF: 200,
          baseSPD: 100,
          baseCR: 5,
          baseCD: 50,
          growthHP: 1000,
          growthATK: 30,
          growthDEF: 20,
          growthSPD: 0,
        },
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
        tierListPlacement: { overall: 'S', dps: 'S', support: 'B', pve: 'S', pvp: 'A' },
        verification: { verified: true, gameVersion: '1.0.0' },
        views: 0,
        popularity: 50,
        pickRate: 0,
        banRate: 0,
        winRate: 50.0,
      };

      const created = await characterRepository.create(characterData as unknown as Parameters<typeof characterRepository.create>[0]);

      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.slug).toBe('test-character-integration');
      expect(created.name).toBe('Test Character');
      testCharacterId = created.id;
    });

    it('should find character by ID', async () => {
      const found = await characterRepository.findById(testCharacterId);
      
      expect(found).toBeDefined();
      expect(found?.id).toBe(testCharacterId);
      expect(found?.name).toBe('Test Character');
    });

    it('should find character by slug', async () => {
      const found = await characterRepository.findBySlug('test-character-integration');
      
      expect(found).toBeDefined();
      expect(found?.slug).toBe('test-character-integration');
      expect(found?.name).toBe('Test Character');
    });

    it('should update character', async () => {
      const updated = await characterRepository.update(testCharacterId, {
        name: 'Updated Test Character',
        popularity: 75,
      } as Parameters<typeof characterRepository.update>[1]);

      expect(updated).toBeDefined();
      expect(updated.name).toBe('Updated Test Character');
      expect(updated.popularity).toBe(75);
    });

    it('should delete character', async () => {
      await characterRepository.delete(testCharacterId);

      const found = await characterRepository.findById(testCharacterId);
      expect(found).toBeNull();
    });
  });

  describe('Search and Filter', () => {
    const testSlugs = ['test-fire-dps', 'test-water-support', 'test-fire-support'];

    beforeAll(async () => {
      const testChars = [
        { slug: 'test-fire-dps', name: 'Fire DPS', element: 'Fire', role: 'DPS', rarity: 'SSR' },
        { slug: 'test-water-support', name: 'Water Support', element: 'Water', role: 'Support', rarity: 'SR' },
        { slug: 'test-fire-support', name: 'Fire Support', element: 'Fire', role: 'Support', rarity: 'SR' },
      ];

      for (const char of testChars) {
        await characterRepository.create({
          slug: char.slug,
          name: char.name,
          title: 'Test',
          description: 'Test',
          gameId: 'destiny-rising',
          element: char.element,
          role: char.role,
          rarity: char.rarity,
          weaponType: 'Sword',
          faction: 'Genesis',
          damageType: char.element,
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
          lore: 'Test',
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
        } as unknown as Parameters<typeof characterRepository.create>[0]);
      }
    });

    afterAll(async () => {
      for (const slug of testSlugs) {
        try {
          const char = await characterRepository.findBySlug(slug);
          if (char) {
            await characterRepository.delete(char.id);
          }
        } catch {
          // Ignore
        }
      }
    });

    it('should search characters by name', async () => {
      const results = await characterRepository.search('Fire');
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(c => c.name.includes('Fire'))).toBe(true);
    });

    it('should filter characters by element', async () => {
      const results = await characterRepository.findByFilter({ element: 'Fire' });
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(c => c.element === 'Fire')).toBe(true);
    });

    it('should filter characters by role', async () => {
      const results = await characterRepository.findByFilter({ role: 'DPS' });
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(c => c.role === 'DPS')).toBe(true);
    });

    it('should filter characters by rarity', async () => {
      const results = await characterRepository.findByFilter({ rarity: 'SSR' });
      
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(c => c.rarity === 'SSR')).toBe(true);
    });

    it('should sort characters by popularity', async () => {
      const results = await characterRepository.findAll();
      
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].popularity).toBeGreaterThanOrEqual(results[i].popularity);
      }
    });

    it('should count characters', async () => {
      const count = await characterRepository.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should increment views efficiently', async () => {
      const char = await characterRepository.findBySlug('test-fire-dps');
      if (!char) return;

      const initialViews = char.views || 0;
      
      await characterRepository.incrementViews(char.id);
      await characterRepository.incrementViews(char.id);
      await characterRepository.incrementViews(char.id);

      const updated = await characterRepository.findById(char.id);
      expect(updated?.views).toBe(initialViews + 3);
    });

    it('should handle concurrent requests', async () => {
      const char = await characterRepository.findBySlug('test-fire-dps');
      if (!char) return;

      const initialViews = char.views || 0;
      
      await Promise.all([
        characterRepository.incrementViews(char.id),
        characterRepository.incrementViews(char.id),
        characterRepository.incrementViews(char.id),
        characterRepository.incrementViews(char.id),
        characterRepository.incrementViews(char.id),
      ]);

      const updated = await characterRepository.findById(char.id);
      expect(updated?.views).toBe(initialViews + 5);
    });
  });
});
