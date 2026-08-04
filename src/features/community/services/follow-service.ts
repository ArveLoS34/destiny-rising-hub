import type { Follow } from '@/types/domain';
import { notificationService } from './notification-service';

/**
 * Follow Service
 * Manages user follow relationships
 */

class FollowService {
  private follows: Map<string, Follow> = new Map();

  follow(followerId: string, followingId: string): Follow {
    const id = `follow-${followerId}-${followingId}`;

    const newFollow: Follow = {
      id,
      followerId,
      followingId,
      createdAt: new Date().toISOString(),
    };

    this.follows.set(id, newFollow);

    // Notify the followed user
    // In a real app, we'd get the follower's name from a user service
    notificationService.notifyNewFollower(followingId, 'User');

    return newFollow;
  }

  unfollow(followerId: string, followingId: string): boolean {
    const id = `follow-${followerId}-${followingId}`;
    return this.follows.delete(id);
  }

  isFollowing(followerId: string, followingId: string): boolean {
    const id = `follow-${followerId}-${followingId}`;
    return this.follows.has(id);
  }

  getFollowers(userId: string): string[] {
    return Array.from(this.follows.values())
      .filter((f) => f.followingId === userId)
      .map((f) => f.followerId);
  }

  getFollowing(userId: string): string[] {
    return Array.from(this.follows.values())
      .filter((f) => f.followerId === userId)
      .map((f) => f.followingId);
  }

  getFollowerCount(userId: string): number {
    return Array.from(this.follows.values()).filter(
      (f) => f.followingId === userId
    ).length;
  }

  getFollowingCount(userId: string): number {
    return Array.from(this.follows.values()).filter(
      (f) => f.followerId === userId
    ).length;
  }

  // Get mutual follows
  getMutualFollows(userId1: string, userId2: string): string[] {
    const followers1 = new Set(this.getFollowers(userId1));
    const followers2 = new Set(this.getFollowers(userId2));

    return Array.from(followers1).filter((id) => followers2.has(id));
  }

  // Get suggested users to follow
  getSuggestedFollows(userId: string, limit: number = 5): string[] {
    const following = new Set(this.getFollowing(userId));
    const followers = new Set(this.getFollowers(userId));

    // Suggest users that your followers are following
    const suggestions = new Map<string, number>();

    Array.from(followers).forEach((followerId) => {
      const theirFollowing = this.getFollowing(followerId);
      theirFollowing.forEach((followedId) => {
        if (followedId !== userId && !following.has(followedId)) {
          suggestions.set(followedId, (suggestions.get(followedId) || 0) + 1);
        }
      });
    });

    // Sort by suggestion count and return top N
    return Array.from(suggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([userId]) => userId);
  }
}

export const followService = new FollowService();
