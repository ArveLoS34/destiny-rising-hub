import type { FeedItem, ContentType } from '@/types/domain';
import { followService } from './follow-service';
import { guideService } from './guide-service';

/**
 * Feed Service
 * Generates personalized content feeds for users
 */

class FeedService {
  private feedItems: Map<string, FeedItem> = new Map();

  // Add new feed item
  addFeedItem(
    type: FeedItem['type'],
    contentId: string,
    contentType: ContentType,
    authorId: string,
    metadata: Record<string, any> = {}
  ): FeedItem {
    const id = `feed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newItem: FeedItem = {
      id,
      type,
      contentId,
      contentType,
      authorId,
      createdAt: new Date().toISOString(),
      metadata,
    };

    this.feedItems.set(id, newItem);
    return newItem;
  }

  // Get personalized feed for a user
  getUserFeed(userId: string, limit: number = 20, offset: number = 0): FeedItem[] {
    const following = followService.getFollowing(userId);

    // Get items from followed users
    const followedItems = Array.from(this.feedItems.values())
      .filter((item) => following.includes(item.authorId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Get recent popular items (not from followed users)
    const popularItems = Array.from(this.feedItems.values())
      .filter((item) => !following.includes(item.authorId))
      .sort((a, b) => {
        const scoreA = (a.metadata.likes || 0) + (a.metadata.views || 0) * 0.1;
        const scoreB = (b.metadata.likes || 0) + (b.metadata.views || 0) * 0.1;
        return scoreB - scoreA;
      })
      .slice(0, 10);

    // Combine and sort by date
    const combined = [...followedItems, ...popularItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return combined.slice(offset, offset + limit);
  }

  // Get global feed (all content)
  getGlobalFeed(limit: number = 20, offset: number = 0): FeedItem[] {
    return Array.from(this.feedItems.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  // Get trending content
  getTrending(limit: number = 10): FeedItem[] {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return Array.from(this.feedItems.values())
      .filter((item) => new Date(item.createdAt) > weekAgo)
      .sort((a, b) => {
        const scoreA = (a.metadata.likes || 0) * 2 + (a.metadata.views || 0) * 0.5;
        const scoreB = (b.metadata.likes || 0) * 2 + (b.metadata.views || 0) * 0.5;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  // Notify when new guide is published
  notifyNewGuide(guideId: string, authorId: string, title: string): void {
    this.addFeedItem('new_guide', guideId, 'guide', authorId, {
      title,
      likes: 0,
      views: 0,
    });
  }

  // Notify when new build is shared
  notifyNewBuild(buildId: string, authorId: string, title: string): void {
    this.addFeedItem('new_build', buildId, 'build', authorId, {
      title,
      likes: 0,
      views: 0,
    });
  }

  // Notify when new team is shared
  notifyNewTeam(teamId: string, authorId: string, title: string): void {
    this.addFeedItem('new_team', teamId, 'team', authorId, {
      title,
      likes: 0,
      views: 0,
    });
  }

  // Notify about patch-related content
  notifyPatchContent(contentId: string, contentType: ContentType, patchVersion: string): void {
    this.addFeedItem('patch_content', contentId, contentType, 'system', {
      patchVersion,
    });
  }

  // Delete feed item
  deleteFeedItem(id: string): boolean {
    return this.feedItems.delete(id);
  }

  // Get feed item by ID
  getFeedItem(id: string): FeedItem | undefined {
    return this.feedItems.get(id);
  }

  // Get feed items by author
  getByAuthor(authorId: string, limit: number = 10): FeedItem[] {
    return Array.from(this.feedItems.values())
      .filter((item) => item.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const feedService = new FeedService();
