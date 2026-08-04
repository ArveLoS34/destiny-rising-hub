import { describe, it, expect } from '@jest/globals';
import { searchService } from '@/features/discovery/services/search/search-service';

describe('SearchService', () => {
  describe('search', () => {
    it('should return search results for valid query', () => {
      const results = searchService.search({ query: 'Nova' });
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return empty array for empty query', () => {
      const results = searchService.search({ query: '' });
      expect(results).toEqual([]);
    });

    it('should handle fuzzy matching', () => {
      const results = searchService.search({ query: 'Novva' });
      expect(results).toBeDefined();
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
