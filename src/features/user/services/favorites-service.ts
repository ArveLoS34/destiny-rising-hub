import type { Favorite, FavoriteType } from "@/types/domain";

/**
 * Favorites Service
 * Manages user favorites (characters, weapons, builds, teams)
 */

// Mock data for development (will be replaced with DB calls)
const mockFavorites: Favorite[] = [];

export const favoritesService = {
  /**
   * Get all favorites for a user
   */
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    // TODO: Replace with actual DB call
    return mockFavorites.filter((f) => f.userId === userId);
  },

  /**
   * Get favorites by type
   */
  async getFavoritesByType(userId: string, type: FavoriteType): Promise<Favorite[]> {
    const favorites = await this.getUserFavorites(userId);
    return favorites.filter((f) => f.type === type);
  },

  /**
   * Add a favorite
   */
  async addFavorite(userId: string, favorite: Omit<Favorite, "id" | "userId" | "createdAt">): Promise<Favorite> {
    const newFavorite: Favorite = {
      ...favorite,
      id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      createdAt: new Date().toISOString(),
    };

    // Check if already exists
    const exists = mockFavorites.some(
      (f) => f.userId === userId && f.type === favorite.type && f.itemId === favorite.itemId
    );

    if (exists) {
      throw new Error("Favorite already exists");
    }

    mockFavorites.push(newFavorite);
    return newFavorite;
  },

  /**
   * Remove a favorite
   */
  async removeFavorite(userId: string, type: FavoriteType, itemId: string): Promise<void> {
    const index = mockFavorites.findIndex(
      (f) => f.userId === userId && f.type === type && f.itemId === itemId
    );

    if (index === -1) {
      throw new Error("Favorite not found");
    }

    mockFavorites.splice(index, 1);
  },

  /**
   * Check if an item is favorited
   */
  async isFavorited(userId: string, type: FavoriteType, itemId: string): Promise<boolean> {
    return mockFavorites.some(
      (f) => f.userId === userId && f.type === type && f.itemId === itemId
    );
  },

  /**
   * Get favorite count by type
   */
  async getFavoriteCount(userId: string, type?: FavoriteType): Promise<number> {
    const favorites = await this.getUserFavorites(userId);
    if (type) {
      return favorites.filter((f) => f.type === type).length;
    }
    return favorites.length;
  },
};
