import type { Activity, ActivityType } from "@/types/domain";

/**
 * Activity Service
 * Manages user activity feed
 */

const mockActivities: Activity[] = [];

export const activityService = {
  /**
   * Get recent activities for a user
   */
  async getUserActivities(userId: string, limit: number = 20): Promise<Activity[]> {
    return mockActivities
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  /**
   * Log a new activity
   */
  async logActivity(userId: string, activity: Omit<Activity, "id" | "userId" | "createdAt">): Promise<Activity> {
    const newActivity: Activity = {
      ...activity,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      createdAt: new Date().toISOString(),
    };

    mockActivities.push(newActivity);

    // Keep only last 1000 activities per user
    const userActivities = mockActivities.filter((a) => a.userId === userId);
    if (userActivities.length > 1000) {
      const toRemove = userActivities.slice(0, userActivities.length - 1000);
      toRemove.forEach((a) => {
        const index = mockActivities.indexOf(a);
        if (index !== -1) mockActivities.splice(index, 1);
      });
    }

    return newActivity;
  },

  /**
   * Get activity count
   */
  async getActivityCount(userId: string): Promise<number> {
    return mockActivities.filter((a) => a.userId === userId).length;
  },

  /**
   * Get activities by type
   */
  async getActivitiesByType(userId: string, type: ActivityType, limit: number = 10): Promise<Activity[]> {
    return mockActivities
      .filter((a) => a.userId === userId && a.type === type)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
};
