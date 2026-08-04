/**
 * Discovery Platform Types
 * Universal search, knowledge graph, and recommendation system
 */

// ═══════════════════════════════════════════════════════════════════
// SEARCH TYPES
// ═══════════════════════════════════════════════════════════════════

export type SearchableType =
  | 'character'
  | 'weapon'
  | 'build'
  | 'team'
  | 'material'
  | 'artifact'
  | 'region'
  | 'node'
  | 'boss'
  | 'npc'
  | 'event'
  | 'quest'
  | 'guide'
  | 'user'
  | 'collection';

export interface SearchIndex {
  id: string;
  type: SearchableType;
  title: string;
  description: string;
  slug: string;
  url: string;
  icon?: string;
  image?: string;
  tags: string[];
  metadata: Record<string, any>;
  popularity: number;
  verification: {
    verified: boolean;
    verifiedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SearchQuery {
  query: string;
  types?: SearchableType[];
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
  sortBy?: SearchSortBy;
  includeFuzzy?: boolean;
}

export interface SearchFilters {
  categories?: string[];
  tiers?: string[];
  roles?: string[];
  elements?: string[];
  regions?: string[];
  difficulties?: string[];
  verified?: boolean;
  patch?: string;
}

export type SearchSortBy = 'relevance' | 'popularity' | 'recency' | 'verification';

export interface SearchResult {
  item: SearchIndex;
  score: number;
  highlights: SearchHighlight[];
  reason?: string;
}

export interface SearchHighlight {
  field: string;
  snippets: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  filters: SearchFilters;
  suggestions: string[];
  executionTime: number;
}

// ═══════════════════════════════════════════════════════════════════
// KNOWLEDGE GRAPH TYPES
// ═══════════════════════════════════════════════════════════════════

export type EntityType = SearchableType;

export interface KnowledgeNode {
  id: string;
  type: EntityType;
  name: string;
  description: string;
  url: string;
  icon?: string;
  metadata: Record<string, any>;
}

export type RelationType =
  | 'uses'
  | 'usedBy'
  | 'buildsWith'
  | 'builtWith'
  | 'requires'
  | 'requiredBy'
  | 'drops'
  | 'droppedBy'
  | 'locatedIn'
  | 'contains'
  | 'similarTo'
  | 'alternativeTo'
  | 'counters'
  | 'synergizesWith'
  | 'recommends'
  | 'recommendedBy';

export interface KnowledgeEdge {
  source: string;
  target: string;
  relation: RelationType;
  weight: number;
  metadata?: Record<string, any>;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface KnowledgePath {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  totalWeight: number;
}

// ═══════════════════════════════════════════════════════════════════
// RECOMMENDATION TYPES
// ═══════════════════════════════════════════════════════════════════

export type RecommendationType =
  | 'similar'
  | 'alternative'
  | 'complementary'
  | 'trending'
  | 'popular'
  | 'personalized';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  item: SearchIndex;
  score: number;
  reason: string;
  confidence: number;
}

export interface RecommendationRequest {
  entityType: EntityType;
  entityId: string;
  recommendationTypes: RecommendationType[];
  limit?: number;
  context?: Record<string, any>;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  sourceEntity: KnowledgeNode;
  executionTime: number;
}

// ═══════════════════════════════════════════════════════════════════
// COMMAND PALETTE TYPES
// ═══════════════════════════════════════════════════════════════════

export type CommandCategory =
  | 'navigation'
  | 'action'
  | 'search'
  | 'recent'
  | 'quick';

export interface Command {
  id: string;
  category: CommandCategory;
  title: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  action: () => void | Promise<void>;
  keywords?: string[];
  priority: number;
}

export interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  commands: Command[];
  filteredCommands: Command[];
}

// ═══════════════════════════════════════════════════════════════════
// SEARCH ANALYTICS TYPES
// ═══════════════════════════════════════════════════════════════════

export interface SearchAnalytics {
  totalSearches: number;
  uniqueQueries: number;
  averageResults: number;
  zeroResultQueries: string[];
  topQueries: { query: string; count: number }[];
  trendingQueries: { query: string; growth: number }[];
  popularTypes: { type: SearchableType; count: number }[];
}

export interface SearchEvent {
  id: string;
  query: string;
  timestamp: string;
  resultCount: number;
  selectedResultId?: string;
  executionTime: number;
  userId?: string;
}

// ═══════════════════════════════════════════════════════════════════
// SAVED SEARCH TYPES
// ═══════════════════════════════════════════════════════════════════

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: SearchQuery;
  createdAt: string;
  lastUsed: string;
  usageCount: number;
}

// ═══════════════════════════════════════════════════════════════════
// RECENT ACTIVITY TYPES
// ═══════════════════════════════════════════════════════════════════

export interface RecentActivity {
  id: string;
  userId: string;
  type: 'search' | 'view' | 'action';
  itemId?: string;
  itemType?: SearchableType;
  query?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
