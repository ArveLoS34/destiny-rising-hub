import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { databaseService } from '@/lib/database';

/**
 * RC-2: API Integration Tests
 * 
 * Bu testler tüm API endpoint'lerin çalıştığını doğrular.
 * Testler gerçek PostgreSQL veritabanı üzerinde çalışır.
 * 
 * Test Coverage:
 * - Health API (1.1.x)
 * - Characters API (1.2.x)
 * - Authentication API (1.3.x) - Eğer mevcutsa
 */

describe('RC-2: API Integration Tests', () => {
  beforeAll(async () => {
    // Veritabanı bağlantısını kur
    await databaseService.connect();
  });

  afterAll(async () => {
    // Veritabanı bağlantısını kapat
    await databaseService.disconnect();
  });

  // ========================================================================
  // 1.1 Health API Tests
  // ========================================================================
  describe('1.1 Health API', () => {
    it('1.1.1 GET /api/health should return 200 OK with healthy status', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('healthy');
    });

    it('1.1.2 Health check should verify database connection', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();
      
      expect(data.checks).toBeDefined();
      expect(data.checks.database).toBe('healthy');
    });

    it('1.1.3 Health check should verify application status', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();
      
      expect(data.checks).toBeDefined();
      expect(data.checks.application).toBe('healthy');
    });

    it('1.1.4 Health check should include version', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();
      
      expect(data.version).toBeDefined();
      expect(typeof data.version).toBe('string');
    });
  });

  // ========================================================================
  // 1.2 Characters API Tests
  // ========================================================================
  describe('1.2 Characters API', () => {
    it('1.2.1 GET /api/v1/characters should return all characters', async () => {
      const response = await fetch('http://localhost:3000/api/v1/characters');
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(20); // Seed data'dan 20 karakter
    });

    it('1.2.2 GET /api/v1/characters/:slug should return specific character', async () => {
      const response = await fetch('http://localhost:3000/api/v1/characters/nova');
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.slug).toBe('nova');
      expect(data.name).toBe('Nova');
    });

    it('1.2.3 GET /api/v1/characters?element=Fire should filter by element', async () => {
      const response = await fetch('http://localhost:3000/api/v1/characters?element=Fire');
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      // Tüm karakterler Fire elementinde olmalı
      data.forEach((character: any) => {
        expect(character.element).toBe('Fire');
      });
    });

    it('1.2.4 GET /api/v1/characters?search=nova should search characters', async () => {
      const response = await fetch('http://localhost:3000/api/v1/characters?search=nova');
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      // Arama sonucu Nova içermeli
      const hasNova = data.some((character: any) => 
        character.name.toLowerCase().includes('nova')
      );
      expect(hasNova).toBe(true);
    });

    it('1.2.5 GET /api/v1/characters/:invalid should return 404', async () => {
      const response = await fetch('http://localhost:3000/api/v1/characters/invalid-character-xyz');
      
      expect(response.status).toBe(404);
    });

    it('1.2.6 Character should have all required fields', async () => {
      const response = await fetch('http://localhost:3000/api/v1/characters/nova');
      const data = await response.json();
      
      // Gerekli alanları kontrol et
      expect(data.id).toBeDefined();
      expect(data.slug).toBeDefined();
      expect(data.name).toBeDefined();
      expect(data.title).toBeDefined();
      expect(data.element).toBeDefined();
      expect(data.role).toBeDefined();
      expect(data.rarity).toBeDefined();
      expect(data.weaponType).toBeDefined();
      expect(data.faction).toBeDefined();
    });

    it('1.2.7 GET /api/v1/characters?role=DPS should filter by role', async () => {
      const response = await fetch('http://localhost:3000/api/v1/characters?role=DPS');
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      // Tüm karakterler DPS roleünde olmalı
      data.forEach((character: any) => {
        expect(character.role).toBe('DPS');
      });
    });

    it('1.2.8 GET /api/v1/characters?rarity=SSR should filter by rarity', async () => {
      const response = await fetch('http://localhost:3000/api/v1/characters?rarity=SSR');
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      
      // Tüm karakterler SSR rarity'de olmalı
      data.forEach((character: any) => {
        expect(character.rarity).toBe('SSR');
      });
    });
  });

  // ========================================================================
  // 1.3 Authentication API Tests (Conditional)
  // ========================================================================
  describe('1.3 Authentication API', () => {
    it('1.3.1 Authentication system should be available', async () => {
      // Auth endpoint'i kontrol et
      const response = await fetch('http://localhost:3000/api/auth/session');
      
      // Endpoint var olmalı (200 veya 401 dönebilir)
      expect([200, 401]).toContain(response.status);
    });

    // Not: Gerçek authentication testleri için test kullanıcısı gerekli
    // Bu testler şimdilik placeholder olarak kalıyor
  });
});
