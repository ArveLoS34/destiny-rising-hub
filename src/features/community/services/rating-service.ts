import type { Rating, Reaction, ContentType } from '@/types/domain';

/**
 * Rating Service
 * Manages user ratings and reactions
 */

class RatingService {
  private ratings: Map<string, Rating> = new Map();
  private reactions: Map<string, Reaction> = new Map();

  // Rating Operations
  rate(
    userId: string,
    contentType: ContentType,
    contentId: string,
    rating: number
  ): Rating {
    const id = `rating-${userId}-${contentType}-${contentId}`;
    
    const newRating: Rating = {
      id,
      userId,
      contentType,
      contentId,
      rating: Math.max(1, Math.min(5, rating)), // Clamp between 1-5
      createdAt: new Date().toISOString(),
    };

    this.ratings.set(id, newRating);
    return newRating;
  }

  getRating(userId: string, contentType: ContentType, contentId: string): Rating | undefined {
    const id = `rating-${userId}-${contentType}-${contentId}`;
    return this.ratings.get(id);
  }

  getAverageRating(contentType: ContentType, contentId: string): number {
    const ratings = Array.from(this.ratings.values()).filter(
      (r) => r.contentType === contentType && r.contentId === contentId
    );

    if (ratings.length === 0) return 0;

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / ratings.length;
  }

  getRatingCount(contentType: ContentType, contentId: string): number {
    return Array.from(this.ratings.values()).filter(
      (r) => r.contentType === contentType && r.contentId === contentId
    ).length;
  }

  // Reaction Operations
  addReaction(
    userId: string,
    contentType: ContentType,
    contentId: string,
    type: 'like' | 'helpful' | 'favorite'
  ): Reaction {
    const id = `reaction-${userId}-${contentType}-${contentId}-${type}`;
    
    const newReaction: Reaction = {
      id,
      userId,
      contentType,
      contentId,
      type,
      createdAt: new Date().toISOString(),
    };

    this.reactions.set(id, newReaction);
    return newReaction;
  }

  removeReaction(
    userId: string,
    contentType: ContentType,
    contentId: string,
    type: 'like' | 'helpful' | 'favorite'
  ): boolean {
    const id = `reaction-${userId}-${contentType}-${contentId}-${type}`;
    return this.reactions.delete(id);
  }

  hasReaction(
    userId: string,
    contentType: ContentType,
    contentId: string,
    type: 'like' | 'helpful' | 'favorite'
  ): boolean {
    const id = `reaction-${userId}-${contentType}-${contentId}-${type}`;
    return this.reactions.has(id);
  }

  getReactionCount(
    contentType: ContentType,
    contentId: string,
    type: 'like' | 'helpful' | 'favorite'
  ): number {
    return Array.from(this.reactions.values()).filter(
      (r) => r.contentType === contentType && r.contentId === contentId && r.type === type
    ).length;
  }

  getUserReactions(userId: string): Reaction[] {
    return Array.from(this.reactions.values()).filter((r) => r.userId === userId);
  }
}

export const ratingService = new RatingService();
