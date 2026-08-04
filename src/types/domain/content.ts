/**
 * Content Platform Domain Types
 * CMS, Import Pipeline, and Content Lifecycle Management
 */

// ═══════════════════════════════════════════════════════════════════
// CONTENT LIFECYCLE
// ═══════════════════════════════════════════════════════════════════

export type ContentLifecycleStatus =
  | 'draft'
  | 'imported'
  | 'validated'
  | 'in_review'
  | 'approved'
  | 'published'
  | 'archived';

export interface ContentVersionRecord {
  version: number;
  data: Record<string, any>;
  createdAt: string;
  createdBy: string;
  changelog: string;
}

export interface ContentMetadata {
  source: string;
  sourceVersion: string;
  sourceHash: string;
  importedAt: string;
  validatedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  publishedAt?: string;
  archivedAt?: string;
}

// ═══════════════════════════════════════════════════════════════════
// IMPORT SYSTEM
// ═══════════════════════════════════════════════════════════════════

export type ImportSourceType =
  | 'official_patch_notes'
  | 'official_website'
  | 'json_feed'
  | 'csv'
  | 'manual'
  | 'api';

export interface ImportSource {
  id: string;
  name: string;
  type: ImportSourceType;
  url?: string;
  config: Record<string, any>;
  isActive: boolean;
  lastImportedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImportJob {
  id: string;
  sourceId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  recordsProcessed: number;
  recordsFailed: number;
  errors: ImportError[];
  metadata: Record<string, any>;
}

export interface ImportError {
  recordId: string;
  message: string;
  details?: Record<string, any>;
}

export interface ImportResult {
  success: boolean;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  errors: ImportError[];
}

// ═══════════════════════════════════════════════════════════════════
// VALIDATION SYSTEM
// ═══════════════════════════════════════════════════════════════════

export type ValidationRuleType =
  | 'required'
  | 'type'
  | 'range'
  | 'format'
  | 'enum'
  | 'custom';

export interface ValidationRule {
  id: string;
  entityType: string;
  field: string;
  type: ValidationRuleType;
  config: Record<string, any>;
  errorMessage: string;
  isActive: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  rule: string;
  message: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// ═══════════════════════════════════════════════════════════════════
// REVIEW WORKFLOW
// ═══════════════════════════════════════════════════════════════════

export interface ReviewRequest {
  id: string;
  entityType: string;
  entityId: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ReviewComment {
  id: string;
  requestId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// DIFF ENGINE
// ═══════════════════════════════════════════════════════════════════

export type DiffOperationType = 'add' | 'remove' | 'modify';

export interface DiffRecord {
  field: string;
  operation: DiffOperationType;
  oldValue?: any;
  newValue?: any;
  impact: 'low' | 'medium' | 'high';
}

export interface DiffResult {
  entityId: string;
  entityType: string;
  oldVersion: number;
  newVersion: number;
  changes: DiffRecord[];
  summary: {
    totalChanges: number;
    additions: number;
    removals: number;
    modifications: number;
    highImpactChanges: number;
  };
}

// ═══════════════════════════════════════════════════════════════════
// PATCH MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

export interface ContentPatch {
  id: string;
  version: string;
  releaseDate: string;
  title: string;
  description: string;
  status: 'upcoming' | 'released' | 'deprecated';
  changes: ContentPatchChange[];
  diffResults: DiffResult[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentPatchChange {
  id: string;
  patchId: string;
  entityType: string;
  entityId: string;
  entityName: string;
  changeType: 'buff' | 'nerf' | 'rework' | 'new' | 'removed';
  description: string;
  diffResult: DiffResult;
}

// ═══════════════════════════════════════════════════════════════════
// CONTENT SCHEDULING
// ═══════════════════════════════════════════════════════════════════

export type ContentScheduledActionType = 'publish' | 'archive' | 'notify';

export interface ContentScheduledAction {
  id: string;
  entityType: string;
  entityId: string;
  action: ContentScheduledActionType;
  scheduledAt: string;
  status: 'pending' | 'executed' | 'failed' | 'cancelled';
  executedAt?: string;
  createdBy: string;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// MEDIA LIBRARY
// ═══════════════════════════════════════════════════════════════════

export type ContentMediaType = 'image' | 'video' | 'icon' | 'audio' | 'document';

export interface ContentMediaAsset {
  id: string;
  type: ContentMediaType;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for video/audio
  tags: string[];
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

// ═══════════════════════════════════════════════════════════════════
// WEBHOOKS
// ═══════════════════════════════════════════════════════════════════

export type WebhookEventType =
  | 'content.published'
  | 'content.updated'
  | 'content.archived'
  | 'patch.released'
  | 'import.completed'
  | 'review.requested'
  | 'review.completed';

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: WebhookEventType[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEventType;
  payload: Record<string, any>;
  status: 'pending' | 'delivered' | 'failed';
  responseCode?: number;
  responseBody?: string;
  deliveredAt?: string;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// API LAYERS
// ═══════════════════════════════════════════════════════════════════

export type ApiLayer = 'public' | 'admin' | 'internal';

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  layer: ApiLayer;
  description: string;
  rateLimit?: number;
  requiresAuth: boolean;
  requiredRoles?: string[];
}

// ═══════════════════════════════════════════════════════════════════
// AUDIT LOG
// ═══════════════════════════════════════════════════════════════════

export type AuditAction =
  | 'content.created'
  | 'content.updated'
  | 'content.deleted'
  | 'content.published'
  | 'content.archived'
  | 'import.started'
  | 'import.completed'
  | 'import.failed'
  | 'validation.passed'
  | 'validation.failed'
  | 'review.requested'
  | 'review.approved'
  | 'review.rejected'
  | 'patch.created'
  | 'patch.released'
  | 'media.uploaded'
  | 'media.deleted';

export interface ContentAuditLog {
  id: string;
  userId: string;
  action: AuditAction;
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
// CMS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

export interface ContentTypeConfig {
  id: string;
  name: string;
  slug: string;
  fields: ContentFieldConfig[];
  validationRules: ValidationRule[];
  workflow: ContentWorkflowConfig;
  createdAt: string;
  updatedAt: string;
}

export interface ContentFieldConfig {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'relation' | 'json' | 'media';
  required: boolean;
  unique?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  config?: Record<string, any>;
}

export interface ContentWorkflowConfig {
  initialStatus: ContentLifecycleStatus;
  transitions: ContentStatusTransition[];
}

export interface ContentStatusTransition {
  from: ContentLifecycleStatus;
  to: ContentLifecycleStatus;
  requiredRoles?: string[];
  automatic?: boolean;
  conditions?: Record<string, any>;
}
