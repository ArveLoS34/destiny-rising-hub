import type { SavedTeam } from "@/types/domain";

/**
 * Saved Teams Service
 * Manages user's custom teams
 */

const mockSavedTeams: SavedTeam[] = [];

export const savedTeamsService = {
  /**
   * Get all saved teams for a user
   */
  async getUserTeams(userId: string): Promise<SavedTeam[]> {
    return mockSavedTeams.filter((t) => t.userId === userId);
  },

  /**
   * Get a specific saved team
   */
  async getTeam(userId: string, teamId: string): Promise<SavedTeam | null> {
    return mockSavedTeams.find((t) => t.userId === userId && t.id === teamId) || null;
  },

  /**
   * Create a new saved team
   */
  async createTeam(userId: string, team: Omit<SavedTeam, "id" | "userId" | "version" | "createdAt" | "updatedAt">): Promise<SavedTeam> {
    const newTeam: SavedTeam = {
      ...team,
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSavedTeams.push(newTeam);
    return newTeam;
  },

  /**
   * Update a saved team
   */
  async updateTeam(userId: string, teamId: string, updates: Partial<SavedTeam>): Promise<SavedTeam> {
    const index = mockSavedTeams.findIndex((t) => t.userId === userId && t.id === teamId);

    if (index === -1) {
      throw new Error("Team not found");
    }

    const updated = {
      ...mockSavedTeams[index],
      ...updates,
      version: mockSavedTeams[index].version + 1,
      updatedAt: new Date().toISOString(),
    };

    mockSavedTeams[index] = updated;
    return updated;
  },

  /**
   * Delete a saved team
   */
  async deleteTeam(userId: string, teamId: string): Promise<void> {
    const index = mockSavedTeams.findIndex((t) => t.userId === userId && t.id === teamId);

    if (index === -1) {
      throw new Error("Team not found");
    }

    mockSavedTeams.splice(index, 1);
  },

  /**
   * Get team count
   */
  async getTeamCount(userId: string): Promise<number> {
    return mockSavedTeams.filter((t) => t.userId === userId).length;
  },
};
