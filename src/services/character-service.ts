import { characterRepository } from '@/repositories/character-repository';
import { logger } from '@/lib/logger';
import type { Character } from '@/types/domain';

/**
 * Character Service
 * Business logic layer for character operations
 */

class CharacterService {
  /**
   * Get all characters
   */
  async getAllCharacters(): Promise<Character[]> {
    try {
      const characters = await characterRepository.findAll();
      logger.info('CharacterService', 'Fetched all characters', { count: characters.length });
      return characters;
    } catch (error) {
      logger.error('CharacterService', 'Failed to get all characters', { error });
      throw error;
    }
  }

  /**
   * Get character by ID
   */
  async getCharacterById(id: string): Promise<Character | null> {
    try {
      const character = await characterRepository.findById(id);
      if (character) {
        // Increment views
        await characterRepository.incrementViews(id);
      }
      return character;
    } catch (error) {
      logger.error('CharacterService', 'Failed to get character by ID', { id, error });
      throw error;
    }
  }

  /**
   * Get character by slug
   */
  async getCharacterBySlug(slug: string): Promise<Character | null> {
    try {
      const character = await characterRepository.findBySlug(slug);
      if (character) {
        // Increment views
        await characterRepository.incrementViews(character.id);
      }
      return character;
    } catch (error) {
      logger.error('CharacterService', 'Failed to get character by slug', { slug, error });
      throw error;
    }
  }

  /**
   * Create new character
   */
  async createCharacter(data: Omit<Character, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<Character> {
    try {
      const characterData = {
        ...data,
        views: 0,
      };
      const character = await characterRepository.create(characterData);
      logger.info('CharacterService', 'Character created', { id: character.id, name: character.name });
      return character;
    } catch (error) {
      logger.error('CharacterService', 'Failed to create character', { error });
      throw error;
    }
  }

  /**
   * Update character
   */
  async updateCharacter(id: string, data: Partial<Character>): Promise<Character> {
    try {
      const character = await characterRepository.update(id, data);
      logger.info('CharacterService', 'Character updated', { id });
      return character;
    } catch (error) {
      logger.error('CharacterService', 'Failed to update character', { id, error });
      throw error;
    }
  }

  /**
   * Delete character
   */
  async deleteCharacter(id: string): Promise<void> {
    try {
      await characterRepository.delete(id);
      logger.info('CharacterService', 'Character deleted', { id });
    } catch (error) {
      logger.error('CharacterService', 'Failed to delete character', { id, error });
      throw error;
    }
  }

  /**
   * Search characters
   */
  async searchCharacters(query: string, limit: number = 20): Promise<Character[]> {
    try {
      const characters = await characterRepository.search(query, limit);
      logger.info('CharacterService', 'Searched characters', { query, count: characters.length });
      return characters;
    } catch (error) {
      logger.error('CharacterService', 'Failed to search characters', { query, error });
      throw error;
    }
  }

  /**
   * Get characters by filter
   */
  async getCharactersByFilter(filter: {
    element?: string;
    role?: string;
    rarity?: string;
    weaponType?: string;
    faction?: string;
  }): Promise<Character[]> {
    try {
      const characters = await characterRepository.findByFilter(filter);
      logger.info('CharacterService', 'Fetched characters by filter', { filter, count: characters.length });
      return characters;
    } catch (error) {
      logger.error('CharacterService', 'Failed to get characters by filter', { filter, error });
      throw error;
    }
  }

  /**
   * Get character count
   */
  async getCharacterCount(): Promise<number> {
    try {
      const count = await characterRepository.count();
      return count;
    } catch (error) {
      logger.error('CharacterService', 'Failed to get character count', { error });
      throw error;
    }
  }
}

// Singleton instance
export const characterService = new CharacterService();
