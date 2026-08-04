import type { SavedBuild } from "@/types/domain";

/**
 * Saved Builds Service
 * Manages user's custom builds
 */

const mockSavedBuilds: SavedBuild[] = [];

export const savedBuildsService = {
  /**
   * Get all saved builds for a user
   */
  async getUserBuilds(userId: string): Promise<SavedBuild[]> {
    return mockSavedBuilds.filter((b) => b.userId === userId);
  },

  /**
   * Get a specific saved build
   */
  async getBuild(userId: string, buildId: string): Promise<SavedBuild | null> {
    return mockSavedBuilds.find((b) => b.userId === userId && b.id === buildId) || null;
  },

  /**
   * Create a new saved build
   */
  async createBuild(userId: string, build: Omit<SavedBuild, "id" | "userId" | "version" | "createdAt" | "updatedAt">): Promise<SavedBuild> {
    const newBuild: SavedBuild = {
      ...build,
      id: `build_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSavedBuilds.push(newBuild);
    return newBuild;
  },

  /**
   * Update a saved build
   */
  async updateBuild(userId: string, buildId: string, updates: Partial<SavedBuild>): Promise<SavedBuild> {
    const index = mockSavedBuilds.findIndex((b) => b.userId === userId && b.id === buildId);

    if (index === -1) {
      throw new Error("Build not found");
    }

    const updated = {
      ...mockSavedBuilds[index],
      ...updates,
      version: mockSavedBuilds[index].version + 1,
      updatedAt: new Date().toISOString(),
    };

    mockSavedBuilds[index] = updated;
    return updated;
  },

  /**
   * Delete a saved build
   */
  async deleteBuild(userId: string, buildId: string): Promise<void> {
    const index = mockSavedBuilds.findIndex((b) => b.userId === userId && b.id === buildId);

    if (index === -1) {
      throw new Error("Build not found");
    }

    mockSavedBuilds.splice(index, 1);
  },

  /**
   * Get build count
   */
  async getBuildCount(userId: string): Promise<number> {
    return mockSavedBuilds.filter((b) => b.userId === userId).length;
  },

  /**
   * Get builds by character
   */
  async getBuildsByCharacter(userId: string, characterId: string): Promise<SavedBuild[]> {
    return mockSavedBuilds.filter((b) => b.userId === userId && b.characterId === characterId);
  },
};
