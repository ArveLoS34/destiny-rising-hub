import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { characterRepository } from '@/repositories/character-repository';
import { databaseService } from '@/lib/database';
import type { Character } from '@/types/domain';

/**
 * Character Repository Integration Tests
 * Tests real database operations with PostgreSQL
 */

describe('CharacterRepository Integration Tests', () => {
  let testCharacter: Character;

  beforeAll(async () => {
    // Connect to database
    await databaseService.connect();
  });

  afterAll(async () => {
    // Clean up test data
    if (testCharacter) {
      try {
        await characterRepository.delete(testCharacter.id);
      } catch (error) {
        // Ignore if already deleted
      }
    }
    // Disconnect from database
    await databaseService.disconnect();
  });

  beforeEach(async () => {
    // Clean up any existing test data
    try {
      const existing = await characterRepository.findBySlug('test-character-integration');
      if (existing) {
        await characterRepository.delete(existing.id);
      }
    } catch (error) {
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
      // This will throw if table doesn't exist
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
        lore: 'Test lore',
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
      };

      testCharacter = await characterRepository.create(characterData);

      expect(testCharacter).toBeDefined();
      expect(testCharacter.id).toBeDefined();
      expect(testCharacter.slug).toBe('test-character-integration');
      expect(testCharacter.name).toBe('Test Character');
      expect(testCharacter.createdAt).toBeDefined();
      expect(testCharacter.updatedAt).toBeDefined();
    });

    it('should find character by ID', async () => {
      const found = await characterRepository.findById(testCharacter.id);
      
      expect(found).toBeDefined();
      expect(found?.id).toBe(testCharacter.id);
      expect(found?.name).toBe('Test Character');
    });

    it('should find character by slug', async () => {
      const found = await characterRepository.findBySlug('test-character-integration');
      
      expect(found).toBeDefined();
      expect(found?.slug).toBe('test-character-integration');
      expect(found?.name).toBe('Test Character');
    });

    it('should update character', async () => {
      const updated = await characterRepository.update(testCharacter.id, {
        name: 'Updated Test Character',
        popularity: 75,
      });

      expect(updated).toBeDefined();
      expect(updated.name).toBe('Updated Test Character');
      expect(updated.popularity).toBe(75);
    });

    it('should delete character', async () => {
      await characterRepository.delete(testCharacter.id);

      const found = await characterRepository.findById(testCharacter.id);
      expect(found).toBeNull();

      // Reset testCharacter to null to avoid cleanup errors
      testCharacter = null as any;
    });
  });

  describe('Search and Filter', () => {
    beforeAll(async () => {
      // Create multiple test characters
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
          element: char.element,
          role: char.role,
          rarity: char.rarity,
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
      }
    });

    afterAll(async () => {
      // Clean up test characters
      const testSlugs = ['test-fire-dps', 'test-water-support', 'test-fire-support'];
      for (const slug of testSlugs) {
        try {
          const char = await characterRepository.findBySlug(slug);
          if (char) {
            await characterRepository.delete(char.id);
          }
        } catch (error) {
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
      
      // Check if sorted by popularity descending
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

      const initialViews = char.views;
      
      // Increment multiple times
      await characterRepository.incrementViews(char.id);
      await characterRepository.incrementViews(char.id);
      await characterRepository.incrementViews(char.id);

      const updated = await characterRepository.findById(char.id);
      expect(updated?.views).toBe(initialViews + 3);
    });

    it('should handle concurrent requests', async () => {
      const char = await characterRepository.findBySlug('test-fire-dps');
      if (!char) return;

      const initialViews = char.views;
      
      // Concurrent increments
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
