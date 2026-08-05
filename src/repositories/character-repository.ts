import { databaseService } from '@/lib/database';
import { logger } from '@/lib/logger';
import type { Character } from '@/types/domain';
import type { Prisma } from '@prisma/client';

/**
 * Character Repository
 * Handles all database operations for characters
 */

class CharacterRepository {
  /**
   * Get all characters
   */
  async findAll(): Promise<Character[]> {
    try {
      const prisma = databaseService.getClient();
      const characters = await prisma.character.findMany({
        orderBy: { popularity: 'desc' },
      });
      return characters as unknown as Character[];
    } catch (error) {
      logger.error('CharacterRepository', 'Failed to fetch characters', { error });
      throw error;
    }
  }

  /**
   * Get character by ID
   */
  async findById(id: string): Promise<Character | null> {
    try {
      const prisma = databaseService.getClient();
      const character = await prisma.character.findUnique({
        where: { id },
      });
      return character as unknown as Character | null;
    } catch (error) {
      logger.error('CharacterRepository', 'Failed to fetch character', { id, error });
      throw error;
    }
  }

  /**
   * Get character by slug
   */
  async findBySlug(slug: string): Promise<Character | null> {
    try {
      const prisma = databaseService.getClient();
      const character = await prisma.character.findUnique({
        where: { slug },
      });
      return character as unknown as Character | null;
    } catch (error) {
      logger.error('CharacterRepository', 'Failed to fetch character by slug', { slug, error });
      throw error;
    }
  }

  /**
   * Create new character
   */
  async create(data: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<Character> {
    try {
      const prisma = databaseService.getClient();
      const character = await prisma.character.create({
        data: data as unknown as Prisma.CharacterCreateInput,
      });
      logger.info('CharacterRepository', 'Character created', { id: character.id });
      return character as unknown as Character;
    } catch (error) {
      logger.error('CharacterRepository', 'Failed to create character', { error });
      throw error;
    }
  }

  /**
   * Update character
   */
  async update(id: string, data: Partial<Character>): Promise<Character> {
    try {
      const prisma = databaseService.getClient();
      const updateData: Prisma.CharacterUpdateInput = { ...data } as unknown as Prisma.CharacterUpdateInput;
      
      // Handle JSON fields - cast to Prisma.InputJsonValue
      if (data.stats) updateData.stats = data.stats as unknown as Prisma.InputJsonValue;
      if (data.skills) updateData.skills = data.skills as unknown as Prisma.InputJsonValue;
      if (data.talents) updateData.talents = data.talents as unknown as Prisma.InputJsonValue;
      if (data.ascensionMaterials) updateData.ascensionMaterials = data.ascensionMaterials as unknown as Prisma.InputJsonValue;
      if (data.skillMaterials) updateData.skillMaterials = data.skillMaterials as unknown as Prisma.InputJsonValue;
      if (data.popularBuilds) updateData.popularBuilds = data.popularBuilds as unknown as Prisma.InputJsonValue;
      if (data.strengths) updateData.strengths = data.strengths as unknown as Prisma.InputJsonValue;
      if (data.weaknesses) updateData.weaknesses = data.weaknesses as unknown as Prisma.InputJsonValue;
      if (data.voiceActors) updateData.voiceActors = data.voiceActors as unknown as Prisma.InputJsonValue;
      if (data.factionRelation) updateData.factionRelation = data.factionRelation as unknown as Prisma.InputJsonValue;
      if (data.tierListPlacement) updateData.tierListPlacement = data.tierListPlacement as unknown as Prisma.InputJsonValue;
      if (data.verification) updateData.verification = data.verification as unknown as Prisma.InputJsonValue;

      const character = await prisma.character.update({
        where: { id },
        data: updateData,
      });
      logger.info('CharacterRepository', 'Character updated', { id });
      return character as unknown as Character;
    } catch (error) {
      logger.error('CharacterRepository', 'Failed to update character', { id, error });
      throw error;
    }
  }

  /**
   * Delete character
   */
  async delete(id: string): Promise<void> {
    try {
      const prisma = databaseService.getClient();
      await prisma.character.delete({
        where: { id },
      });
      logger.info('CharacterRepository', 'Character deleted', { id });
    } catch (error) {
      logger.error('CharacterRepository', 'Failed to delete character', { id, error });
      throw error;
    }
  }

  /**
   * Search characters
   */
  async search(query: string, limit: number = 20): Promise<Character[]> {
    try {
      const prisma = databaseService.getClient();
      const characters = await prisma.character.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        orderBy: { popularity: 'desc' },
      });
      return characters as unknown as Character[];
    } catch (error) {
      logger.error('CharacterRepository', 'Failed to search characters', { query, error });
      throw error;
    }
  }

  /**
   * Get characters by filter
   */
  async findByFilter(filter: {
    element?: string;
    role?: string;
    rarity?: string;
    weaponType?: string;
    faction?: string;
  }): Promise<Character[]> {
    try {
      const prisma = databaseService.getClient();
      const where: Prisma.CharacterWhereInput = {};
      
      if (filter.element) where.element = filter.element;
      if (filter.role) where.role = filter.role;
      if (filter.rarity) where.rarity = filter.rarity;
      if (filter.weaponType) where.weaponType = filter.weaponType;
      if (filter.faction) where.faction = filter.faction;

      const characters = await prisma.character.findMany({
        where,
        orderBy: { popularity: 'desc' },
      });
      return characters as unknown as Character[];
    } catch (error) {
      logger.error('CharacterRepository', 'Failed to fetch characters by filter', { filter, error });
      throw error;
    }
  }

  /**
   * Increment character views
   */
  async incrementViews(id: string): Promise<void> {
    try {
      const prisma = databaseService.getClient();
      await prisma.character.update({
        where: { id },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      logger.error('CharacterRepository', 'Failed to increment views', { id, error });
    }
  }

  /**
   * Get character count
   */
  async count(): Promise<number> {
    try {
      const prisma = databaseService.getClient();
      return await prisma.character.count();
    } catch (error) {
      logger.error('CharacterRepository', 'Failed to count characters', { error });
      throw error;
    }
  }
}

// Singleton instance
export const characterRepository = new CharacterRepository();
