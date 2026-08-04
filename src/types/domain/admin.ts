/**
 * Admin & Operations Domain Types
 * Platform operations and administration
 */

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════

export interface DashboardStats {
  // User metrics
  dailyActiveUsers: number;
  onlineUsers: number;
  newRegistrations: number;
  
  // Content metrics
  newBuilds: number;
  newGuides: number;
  newComments: number;
  
  // Moderation
  reportedContent: number;
  pendingReports: number;
  
  // System
  aiUsageCount: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  
  // Timestamps
  lastUpdated: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

// ═══════════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

export type UserAction = 'ban' | 'suspend' | 'warn' | 'verify' | 'role_change' | 'permission_override';

export interface UserManagementAction {
  id: string;
  adminId: string;
  targetUserId: string;
  action: UserAction;
  reason: string;
  duration?: number; // in days
  metadata?: Record<string, any>;
  createdAt: string;
  expiresAt?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  lastActivity: string;
  isActive: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// CONTENT VERSIONING
// ═══════════════════════════════════════════════════════════════════

export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';

export interface ContentVersion {
  id: string;
  contentType: string;
  contentId: string;
  version: number;
  status: ContentStatus;
  data: Record<string, any>;
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  changelog?: string;
}

// ═══════════════════════════════════════════════════════════════════
// PATCH MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

export interface GamePatch {
  id: string;
  version: string;
  releaseDate: string;
  title: string;
  description: string;
  changes: PatchChange[];
  status: 'upcoming' | 'released' | 'deprecated';
}

export interface PatchChange {
  id: string;
  type: 'buff' | 'nerf' | 'rework' | 'new' | 'removed';
  entityType: 'character' | 'weapon' | 'artifact' | 'material';
  entityId: string;
  entityName: string;
  description: string;
  values?: {
    before?: number | string;
    after?: number | string;
  };
}

// ═══════════════════════════════════════════════════════════════════
// FEATURE FLAGS
// ═══════════════════════════════════════════════════════════════════

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number; // 0-100
  targetUserIds?: string[];
  targetUserRoles?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ═══════════════════════════════════════════════════════════════════
// AUDIT LOGS
// ═══════════════════════════════════════════════════════════════════

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  metadata?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// SCHEDULER
// ═══════════════════════════════════════════════════════════════════

export type ScheduledActionType = 'publish' | 'archive' | 'notify' | 'backup';

export interface ScheduledAction {
  id: string;
  type: ScheduledActionType;
  entityType: string;
  entityId: string;
  scheduledAt: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payload: Record<string, any>;
  createdBy: string;
  createdAt: string;
  executedAt?: string;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════
// MEDIA LIBRARY
// ═══════════════════════════════════════════════════════════════════

export type MediaType = 'image' | 'video' | 'icon' | 'document';

export interface MediaAsset {
  id: string;
  type: MediaType;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  tags: string[];
  uploadedBy: string;
  createdAt: string;
  usageCount: number;
}

// ═══════════════════════════════════════════════════════════════════
// SYSTEM SETTINGS
// ═══════════════════════════════════════════════════════════════════

export interface SystemSettings {
  // Site settings
  siteName: string;
  siteUrl: string;
  maintenanceMode: boolean;
  
  // Theme
  defaultTheme: 'light' | 'dark' | 'system';
  
  // Locale
  defaultLocale: string;
  supportedLocales: string[];
  
  // AI settings
  aiEnabled: boolean;
  aiModel: string;
  aiRateLimit: number;
  
  // Search settings
  searchEnabled: boolean;
  searchProvider: string;
  
  // Cache settings
  cacheEnabled: boolean;
  cacheTTL: number;
  
  // Rate limits
  rateLimitEnabled: boolean;
  rateLimitWindow: number;
  rateLimitMax: number;
  
  // Updated
  updatedAt: string;
  updatedBy: string;
}

// ═══════════════════════════════════════════════════════════════════
// HEALTH MONITORING
// ═══════════════════════════════════════════════════════════════════

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  components: {
    cpu: HealthMetric;
    memory: HealthMetric;
    database: HealthMetric;
    api: HealthMetric;
    search: HealthMetric;
    ai: HealthMetric;
    cache: HealthMetric;
  };
  lastChecked: string;
}

export interface HealthMetric {
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
  threshold: {
    warning: number;
    critical: number;
  };
  lastUpdated: string;
}

// ═══════════════════════════════════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════════════════════════════════

export interface ContentAnalytics {
  contentType: string;
  contentId: string;
  contentName: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  avgRating: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SearchAnalytics {
  query: string;
  count: number;
  avgResults: number;
  clickThroughRate: number;
  trend: 'up' | 'down' | 'stable';
}

// ═══════════════════════════════════════════════════════════════════
// BACKUP & RESTORE
// ═══════════════════════════════════════════════════════════════════

export interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'database' | 'media';
  size: number;
  status: 'creating' | 'completed' | 'failed';
  createdAt: string;
  createdBy: string;
  downloadUrl?: string;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════
// MODERATION
// ═══════════════════════════════════════════════════════════════════

export type ModerationAction = 'approve' | 'reject' | 'remove' | 'warn_user' | 'ban_user';

export interface ModerationQueue {
  id: string;
  contentType: string;
  contentId: string;
  reason: string;
  reportedBy: string;
  status: 'pending' | 'reviewed' | 'resolved';
  aiSuggestions?: {
    spam: number;
    toxic: number;
    duplicate: number;
    lowQuality: number;
  };
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  action?: ModerationAction;
  notes?: string;
}
