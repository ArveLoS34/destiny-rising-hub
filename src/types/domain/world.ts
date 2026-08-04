/**
 * Interactive World System Domain Types
 * Central hub for all world-related data
 */

// ═══════════════════════════════════════════════════════════════════
// WORLD HIERARCHY
// ═══════════════════════════════════════════════════════════════════

export interface World {
  id: string;
  slug: string;
  name: string;
  description: string;
  backgroundArt?: string;
  regions: Region[];
}

export interface Region {
  id: string;
  slug: string;
  worldId: string;
  name: string;
  description: string;
  level: number;
  backgroundArt?: string;
  mapBounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  zones: Zone[];
}

export interface Zone {
  id: string;
  slug: string;
  regionId: string;
  name: string;
  description: string;
  level: number;
  mapBounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  subZones?: SubZone[];
}

export interface SubZone {
  id: string;
  slug: string;
  zoneId: string;
  name: string;
  description: string;
  mapBounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

// ═══════════════════════════════════════════════════════════════════
// NODE SYSTEM
// ═══════════════════════════════════════════════════════════════════

export type NodeType =
  | 'material'
  | 'boss'
  | 'elite'
  | 'dungeon'
  | 'npc'
  | 'quest'
  | 'event'
  | 'chest'
  | 'secret'
  | 'teleport'
  | 'puzzle';

export type NodeStatus = 'available' | 'respawning' | 'locked';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'legendary';

export interface Position {
  x: number;
  y: number;
  z?: number;
}

export interface MapNode {
  id: string;
  slug: string;
  type: NodeType;
  name: string;
  description: string;
  position: Position;
  regionId: string;
  zoneId?: string;
  subZoneId?: string;
  
  // Metadata
  icon: string;
  screenshot?: string;
  
  // Status & Timing
  status: NodeStatus;
  respawnTime?: number; // in minutes
  lastRespawnedAt?: string; // ISO timestamp
  
  // Difficulty & Requirements
  difficulty: Difficulty;
  requiredLevel?: number;
  requiredQuests?: string[]; // quest IDs
  requiredItems?: string[]; // item IDs
  
  // Rewards
  rewards?: NodeReward[];
  drops?: NodeDrop[];
  
  // Verification
  verification: {
    verified: boolean;
    verifiedAt: string;
    verifiedBy: string;
    gameVersion: string;
  };
  
  // CMS Fields
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface NodeReward {
  type: 'material' | 'currency' | 'experience' | 'item';
  itemId: string;
  itemName: string;
  quantity: number;
  chance: number; // 0-1
}

export interface NodeDrop {
  itemId: string;
  itemName: string;
  dropRate: number; // 0-1
  minQuantity: number;
  maxQuantity: number;
}

// ═══════════════════════════════════════════════════════════════════
// LAYER SYSTEM
// ═══════════════════════════════════════════════════════════════════

export type LayerType =
  | 'materials'
  | 'bosses'
  | 'elites'
  | 'dungeons'
  | 'npcs'
  | 'quests'
  | 'events'
  | 'chests'
  | 'secrets'
  | 'teleports'
  | 'puzzles';

export interface MapLayer {
  id: LayerType;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  zIndex: number;
}

// ═══════════════════════════════════════════════════════════════════
// ROUTE SYSTEM
// ═══════════════════════════════════════════════════════════════════

export type RouteType = 'material' | 'boss' | 'quest' | 'custom';

export interface Route {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: RouteType;
  nodes: RouteNode[];
  totalDistance: number;
  estimatedTime: number; // in minutes
  difficulty: Difficulty;
  
  // Metadata
  createdBy: string;
  isPublic: boolean;
  isAIGenerated: boolean;
  
  // Stats
  rating: number; // 0-5
  usageCount: number;
  
  // CMS Fields
  createdAt: string;
  updatedAt: string;
}

export interface RouteNode {
  nodeId: string;
  order: number;
  notes?: string;
  estimatedTimeAtNode: number; // in minutes
}

// ═══════════════════════════════════════════════════════════════════
// HEATMAP SYSTEM
// ═══════════════════════════════════════════════════════════════════

export type HeatmapMode = 'official' | 'community';

export interface HeatmapData {
  mode: HeatmapMode;
  points: HeatmapPoint[];
  lastUpdated: string;
}

export interface HeatmapPoint {
  position: Position;
  intensity: number; // 0-1
  nodeCount: number;
}

// ═══════════════════════════════════════════════════════════════════
// FILTER SYSTEM
// ═══════════════════════════════════════════════════════════════════

export interface MapFilters {
  regions: string[];
  zones: string[];
  nodeTypes: NodeType[];
  difficulties: Difficulty[];
  elements: string[];
  materials: string[];
  bosses: string[];
  status: NodeStatus[];
  
  // Time-based filters
  daily?: boolean;
  weekly?: boolean;
  monthly?: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// AI ROUTE PLANNER
// ═══════════════════════════════════════════════════════════════════

export interface AIRouteRequest {
  characterId: string;
  targetMaterials: {
    materialId: string;
    quantity: number;
  }[];
  optimizationGoal: 'shortest' | 'fastest' | 'safest';
  avoidHighLevel?: boolean;
}

export interface AIRouteResponse {
  route: Route;
  reasoning: string[];
  alternatives: Route[];
  confidence: number; // 0-1
}

// ═══════════════════════════════════════════════════════════════════
// USER PREFERENCES
// ═══════════════════════════════════════════════════════════════════

export interface UserMapPreferences {
  enabledLayers: LayerType[];
  defaultRegion?: string;
  defaultZoom: number;
  showTooltips: boolean;
  showLabels: boolean;
  heatmapMode: HeatmapMode;
  routeOptimization: 'shortest' | 'fastest' | 'safest';
}
