/**
 * Community Platform Domain Types
 * UGC (User Generated Content) system
 */

// ═══════════════════════════════════════════════════════════════════
// GUIDE SYSTEM
// ═══════════════════════════════════════════════════════════════════

export type GuideStatus = 'draft' | 'published' | 'archived';
export type GuideCategory = 'beginner' | 'advanced' | 'tier-list' | 'farming' | 'build-guide' | 'team-composition' | 'mechanics' | 'other';

export interface Guide {
  id: string;
  slug: string;
  authorId: string;
  title: string;
  summary: string;
  content: string; // Markdown content
  coverImage?: string;
  tags: string[];
  category: GuideCategory;
  gameVersion: string;
  language: string;
  status: GuideStatus;
  
  // Metrics
  views: number;
  likes: number;
  helpfulCount: number;
  commentCount: number;
  
  // Verification
  verification: {
    verified: boolean;
    verifiedAt?: string;
    verifiedBy?: string;
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// ═══════════════════════════════════════════════════════════════════
// USER CONTENT (Builds & Teams)
// ═══════════════════════════════════════════════════════════════════

export interface UserBuild {
  id: string;
  slug: string;
  authorId: string;
  characterId: string;
  title: string;
  description: string;
  gameplayNotes?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  
  // Build Data
  weaponId: string;
  artifactSetId: string;
  mainStats: {
    sands: string;
    goblet: string;
    crown: string;
  };
  subStats: {
    critRate: number;
    critDamage: number;
    atkPercent: number;
    [key: string]: number;
  };
  
  // Media
  videoUrl?: string;
  screenshots: string[];
  
  // Metrics
  views: number;
  likes: number;
  helpfulCount: number;
  commentCount: number;
  usageCount: number;
  
  // Verification
  verification: {
    verified: boolean;
    verifiedAt?: string;
    verifiedBy?: string;
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface UserTeam {
  id: string;
  slug: string;
  authorId: string;
  title: string;
  description: string;
  purpose: string;
  
  // Team Data
  memberIds: string[];
  
  // Analysis
  strengths: string[];
  weaknesses: string[];
  recommendedUsage: string[];
  
  // Media
  videoUrl?: string;
  screenshots: string[];
  
  // Metrics
  views: number;
  likes: number;
  helpfulCount: number;
  commentCount: number;
  usageCount: number;
  
  // Verification
  verification: {
    verified: boolean;
    verifiedAt?: string;
    verifiedBy?: string;
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// ═══════════════════════════════════════════════════════════════════
// RATING & REACTIONS
// ═══════════════════════════════════════════════════════════════════

export type ContentType = 'guide' | 'build' | 'team' | 'comment';

export interface Rating {
  id: string;
  userId: string;
  contentType: ContentType;
  contentId: string;
  rating: number; // 1-5 stars
  createdAt: string;
}

export interface Reaction {
  id: string;
  userId: string;
  contentType: ContentType;
  contentId: string;
  type: 'like' | 'helpful' | 'favorite';
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// COMMENTS
// ═══════════════════════════════════════════════════════════════════

export interface Comment {
  id: string;
  authorId: string;
  contentType: ContentType;
  contentId: string;
  parentId?: string; // For replies
  content: string; // Markdown
  mentions: string[]; // User IDs mentioned
  
  // Metrics
  likes: number;
  replyCount: number;
  
  // Moderation
  isApproved: boolean;
  isEdited: boolean;
  editHistory: {
    content: string;
    editedAt: string;
  }[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// USER REPUTATION & ROLES
// ═══════════════════════════════════════════════════════════════════

export type CommunityRole = 'member' | 'contributor' | 'verified_creator' | 'moderator' | 'admin';

export interface UserReputation {
  userId: string;
  score: number;
  level: number;
  role: CommunityRole;
  
  // Contribution metrics
  guidesPublished: number;
  buildsShared: number;
  teamsShared: number;
  commentsMade: number;
  helpfulVotes: number;
  
  // Badges
  badges: string[];
  
  // Timestamps
  lastActivityAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// SOCIAL FEATURES
// ═══════════════════════════════════════════════════════════════════

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface FeedItem {
  id: string;
  type: 'new_guide' | 'new_build' | 'new_team' | 'patch_content' | 'followed_user';
  contentId: string;
  contentType: ContentType;
  authorId: string;
  createdAt: string;
  metadata: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════

export type NotificationType = 
  | 'new_follower'
  | 'comment'
  | 'reply'
  | 'like'
  | 'helpful'
  | 'guide_approved'
  | 'build_featured'
  | 'mention';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// MODERATION
// ═══════════════════════════════════════════════════════════════════

export type ReportReason = 'spam' | 'inappropriate' | 'misinformation' | 'duplicate' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporterId: string;
  contentType: ContentType;
  contentId: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reviewedBy?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}
