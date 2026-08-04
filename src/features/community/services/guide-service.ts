import type { Guide, GuideStatus, GuideCategory } from '@/types/domain';

/**
 * Guide Service
 * Manages user-generated guides
 */

class GuideService {
  private guides: Map<string, Guide> = new Map();

  constructor() {
    // Initialize with sample data
    this.initializeSampleGuides();
  }

  private initializeSampleGuides() {
    const sampleGuides: Guide[] = [
      {
        id: 'guide-001',
        slug: 'beginners-guide-to-destiny-rising',
        authorId: 'user-001',
        title: "Beginner's Guide to Destiny Rising",
        summary: 'Everything you need to know to get started in Destiny Rising',
        content: `# Welcome to Destiny Rising!

This comprehensive guide will help you get started with the game.

## Getting Started

### Character Selection
Your first choice will be your main character. Here are some tips:

- **Nova**: Great for AoE damage
- **Aurora**: Best support character
- **Phantom**: Highest burst damage

### Early Game Tips
1. Focus on main story quests
2. Level up your main character first
3. Join a guild for bonus rewards
4. Save your premium currency for limited banners

## Progression Guide

### Level 1-20
- Complete main story
- Unlock all basic features
- Start building your first team

### Level 20-40
- Start farming materials
- Upgrade your weapons
- Join team activities

### Level 40+
- Endgame content
- Optimize builds
- Competitive play

## Conclusion
Welcome to the community!`,
        tags: ['beginner', 'guide', 'tips'],
        category: 'beginner',
        gameVersion: '1.4.0',
        language: 'en',
        status: 'published',
        views: 15420,
        likes: 892,
        helpfulCount: 756,
        commentCount: 145,
        verification: {
          verified: true,
          verifiedAt: '2025-01-20T00:00:00Z',
          verifiedBy: 'admin',
        },
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-20T00:00:00Z',
        publishedAt: '2025-01-15T00:00:00Z',
      },
      {
        id: 'guide-002',
        slug: 'farming-guide-max-efficiency',
        authorId: 'user-002',
        title: 'Farming Guide: Maximum Efficiency',
        summary: 'Learn the most efficient ways to farm materials and resources',
        content: `# Farming Guide

This guide covers the most efficient farming routes and strategies.

## Daily Farming Route

### Morning Route (15 minutes)
1. Stellar Plains - Crystal Shards
2. Void Rift - Void Crystals
3. Inferno Peaks - Fire Cores

### Evening Route (20 minutes)
1. Boss resets
2. Weekly dungeons
3. Event materials

## Weekly Optimization

### Monday
- Weekly bosses
- Guild events

### Tuesday
- Team activities
- Resource exchanges

## Tips & Tricks
- Use teleport waypoints
- Group similar materials
- Track respawn timers

## Conclusion
Follow this guide for maximum efficiency!`,
        tags: ['farming', 'efficiency', 'materials'],
        category: 'farming',
        gameVersion: '1.4.0',
        language: 'en',
        status: 'published',
        views: 8930,
        likes: 567,
        helpfulCount: 489,
        commentCount: 89,
        verification: {
          verified: true,
          verifiedAt: '2025-02-01T00:00:00Z',
          verifiedBy: 'admin',
        },
        createdAt: '2025-01-25T00:00:00Z',
        updatedAt: '2025-02-01T00:00:00Z',
        publishedAt: '2025-01-25T00:00:00Z',
      },
    ];

    sampleGuides.forEach((guide) => {
      this.guides.set(guide.id, guide);
    });
  }

  // CRUD Operations
  create(guide: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>): Guide {
    const id = `guide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newGuide: Guide = {
      ...guide,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    this.guides.set(id, newGuide);
    return newGuide;
  }

  getById(id: string): Guide | undefined {
    return this.guides.get(id);
  }

  getBySlug(slug: string): Guide | undefined {
    return Array.from(this.guides.values()).find((g) => g.slug === slug);
  }

  getAll(filters?: {
    status?: GuideStatus;
    category?: GuideCategory;
    authorId?: string;
    limit?: number;
    offset?: number;
  }): Guide[] {
    let guides = Array.from(this.guides.values());

    if (filters?.status) {
      guides = guides.filter((g) => g.status === filters.status);
    }

    if (filters?.category) {
      guides = guides.filter((g) => g.category === filters.category);
    }

    if (filters?.authorId) {
      guides = guides.filter((g) => g.authorId === filters.authorId);
    }

    // Sort by published date
    guides.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    const offset = filters?.offset || 0;
    const limit = filters?.limit || guides.length;
    return guides.slice(offset, offset + limit);
  }

  update(id: string, updates: Partial<Guide>): Guide | undefined {
    const guide = this.guides.get(id);
    if (!guide) return undefined;

    const updated = {
      ...guide,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.guides.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.guides.delete(id);
  }

  // Metrics
  incrementViews(id: string): void {
    const guide = this.guides.get(id);
    if (guide) {
      guide.views++;
    }
  }

  addLike(id: string): void {
    const guide = this.guides.get(id);
    if (guide) {
      guide.likes++;
    }
  }

  removeLike(id: string): void {
    const guide = this.guides.get(id);
    if (guide && guide.likes > 0) {
      guide.likes--;
    }
  }

  addHelpful(id: string): void {
    const guide = this.guides.get(id);
    if (guide) {
      guide.helpfulCount++;
    }
  }

  // Search
  search(query: string): Guide[] {
    const queryLower = query.toLowerCase();
    return Array.from(this.guides.values()).filter(
      (guide) =>
        guide.title.toLowerCase().includes(queryLower) ||
        guide.summary.toLowerCase().includes(queryLower) ||
        guide.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    );
  }

  // Verification
  verify(id: string, verifiedBy: string): Guide | undefined {
    return this.update(id, {
      verification: {
        verified: true,
        verifiedAt: new Date().toISOString(),
        verifiedBy,
      },
    });
  }
}

export const guideService = new GuideService();
