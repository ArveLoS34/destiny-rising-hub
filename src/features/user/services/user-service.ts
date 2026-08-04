import type { User, UserSettings, UserStats } from "@/types/domain";
import { favoritesService } from "./favorites-service";
import { savedBuildsService } from "./saved-builds-service";
import { savedTeamsService } from "./saved-teams-service";
import { collectionsService } from "./collections-service";
import { defaultUserSettings } from "@/types/domain";

/**
 * User Service
 * Main service for user management
 */

// Mock current user (will be replaced with session-based auth)
let mockCurrentUser: User | null = null;
let mockSettings: UserSettings = defaultUserSettings;

export const userService = {
  /**
   * Get current user (from session)
   */
  async getCurrentUser(): Promise<User | null> {
    // TODO: Replace with actual session check
    return mockCurrentUser;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    if (!mockCurrentUser || mockCurrentUser.id !== userId) {
      throw new Error("User not found");
    }

    mockCurrentUser = {
      ...mockCurrentUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return mockCurrentUser;
  },

  /**
   * Get user settings
   */
  async getSettings(userId: string): Promise<UserSettings> {
    // TODO: Replace with actual DB call
    return mockSettings;
  },

  /**
   * Update user settings
   */
  async updateSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
    mockSettings = {
      ...mockSettings,
      ...updates,
    };

    return mockSettings;
  },

  /**
   * Get user statistics
   */
  async getStats(userId: string): Promise<UserStats> {
    const [favorites, builds, teams, collections] = await Promise.all([
      favoritesService.getUserFavorites(userId),
      savedBuildsService.getUserBuilds(userId),
      savedTeamsService.getUserTeams(userId),
      collectionsService.getUserCollections(userId),
    ]);

    return {
      totalFavorites: favorites.length,
      totalSavedBuilds: builds.length,
      totalSavedTeams: teams.length,
      totalCollections: collections.length,
      memberSince: mockCurrentUser?.createdAt || new Date().toISOString(),
      lastActive: mockCurrentUser?.lastLoginAt || new Date().toISOString(),
    };
  },

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    if (mockCurrentUser && mockCurrentUser.id === userId) {
      mockCurrentUser.lastLoginAt = new Date().toISOString();
    }
  },

  /**
   * Check if user has role
   */
  async hasRole(userId: string, role: string): Promise<boolean> {
    if (!mockCurrentUser || mockCurrentUser.id !== userId) {
      return false;
    }

    const roleHierarchy: Record<string, number> = {
      user: 1,
      moderator: 2,
      admin: 3,
      superadmin: 4,
    };

    const userRoleLevel = roleHierarchy[mockCurrentUser.role] || 0;
    const requiredRoleLevel = roleHierarchy[role] || 0;

    return userRoleLevel >= requiredRoleLevel;
  },
};
