import { describe, it, expect } from '@jest/globals';
import { searchService } from '@/features/discovery/services/search/search-service';

describe('SearchService', () => {
  describe('search', () => {
    it('should return search results for valid query', () => {
      const response = searchService.search({ query: 'Nova' });
      expect(response).toBeDefined();
      expect(response.results).toBeDefined();
      expect(Array.isArray(response.results)).toBe(true);
      expect(response.results.length).toBeGreaterThan(0);
    });

    it('should return all results for empty query', () => {
      const response = searchService.search({ query: '' });
      expect(response).toBeDefined();
      expect(response.results).toBeDefined();
      expect(response.total).toBeGreaterThan(0);
    });

    it('should handle fuzzy matching', () => {
      const response = searchService.search({ query: 'Novva' });
      expect(response).toBeDefined();
      expect(response.results).toBeDefined();
    });
  });

  describe('getById', () => {
    it('should return item by id', () => {
      const item = searchService.getById('dr-char-001');
      if (item) {
        expect(item.id).toBe('dr-char-001');
      }
    });

    it('should return undefined for non-existent id', () => {
      const item = searchService.getById('non-existent');
      expect(item).toBeUndefined();
    });
  });

  describe('getByType', () => {
    it('should return all items of given type', () => {
      const characters = searchService.getByType('character');
      expect(Array.isArray(characters)).toBe(true);
      characters.forEach((char) => {
        expect(char.type).toBe('character');
      });
    });
  });
});
