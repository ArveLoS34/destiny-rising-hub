import { world, regions, zones, mapNodes, mapLayers, getRegionById, getRegionBySlug, getZoneById, getZoneBySlug, getNodeById, getNodeBySlug, getNodesByRegion, getNodesByZone, getNodesByType, getLayerById } from '@/data/games/destiny-rising/world';
import type { World, Region, Zone, MapNode, MapLayer, MapFilters, NodeType } from '@/types/domain';

/**
 * World Service
 * CMS-ready service for managing world data
 */

export class WorldService {
  // ═══════════════════════════════════════════════════════════════════
  // WORLD
  // ═══════════════════════════════════════════════════════════════════

  static getWorld(): World {
    return world;
  }

  // ═══════════════════════════════════════════════════════════════════
  // REGIONS
  // ═══════════════════════════════════════════════════════════════════

  static getAllRegions(): Region[] {
    return regions;
  }

  static getRegionById(id: string): Region | undefined {
    return getRegionById(id);
  }

  static getRegionBySlug(slug: string): Region | undefined {
    return getRegionBySlug(slug);
  }

  static getRegionsByLevel(level: number): Region[] {
    return regions.filter(r => r.level === level);
  }

  // ═══════════════════════════════════════════════════════════════════
  // ZONES
  // ═══════════════════════════════════════════════════════════════════

  static getAllZones(): Zone[] {
    return zones;
  }

  static getZoneById(id: string): Zone | undefined {
    return getZoneById(id);
  }

  static getZoneBySlug(slug: string): Zone | undefined {
    return getZoneBySlug(slug);
  }

  static getZonesByRegion(regionId: string): Zone[] {
    return zones.filter(z => z.regionId === regionId);
  }

  // ═══════════════════════════════════════════════════════════════════
  // NODES
  // ═══════════════════════════════════════════════════════════════════

  static getAllNodes(): MapNode[] {
    return mapNodes;
  }

  static getNodeById(id: string): MapNode | undefined {
    return getNodeById(id);
  }

  static getNodeBySlug(slug: string): MapNode | undefined {
    return getNodeBySlug(slug);
  }

  static getNodesByRegion(regionId: string): MapNode[] {
    return getNodesByRegion(regionId);
  }

  static getNodesByZone(zoneId: string): MapNode[] {
    return getNodesByZone(zoneId);
  }

  static getNodesByType(type: NodeType): MapNode[] {
    return getNodesByType(type);
  }

  static getNodesByDifficulty(difficulty: string): MapNode[] {
    return mapNodes.filter(n => n.difficulty === difficulty);
  }

  static getNodesByStatus(status: string): MapNode[] {
    return mapNodes.filter(n => n.status === status);
  }

  static searchNodes(query: string): MapNode[] {
    const lowerQuery = query.toLowerCase();
    return mapNodes.filter(n => 
      n.name.toLowerCase().includes(lowerQuery) ||
      n.description.toLowerCase().includes(lowerQuery)
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // FILTERS
  // ═══════════════════════════════════════════════════════════════════

  static filterNodes(filters: MapFilters): MapNode[] {
    let filtered = [...mapNodes];

    // Region filter
    if (filters.regions.length > 0) {
      filtered = filtered.filter(n => filters.regions.includes(n.regionId));
    }

    // Zone filter
    if (filters.zones.length > 0) {
      filtered = filtered.filter(n => n.zoneId && filters.zones.includes(n.zoneId));
    }

    // Node type filter
    if (filters.nodeTypes.length > 0) {
      filtered = filtered.filter(n => filters.nodeTypes.includes(n.type));
    }

    // Difficulty filter
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(n => filters.difficulties.includes(n.difficulty));
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(n => filters.status.includes(n.status));
    }

    // Material filter
    if (filters.materials.length > 0) {
      filtered = filtered.filter(n => 
        n.drops?.some(d => filters.materials.includes(d.itemId))
      );
    }

    return filtered;
  }

  // ═══════════════════════════════════════════════════════════════════
  // LAYERS
  // ═══════════════════════════════════════════════════════════════════

  static getAllLayers(): MapLayer[] {
    return mapLayers;
  }

  static getLayerById(id: string): MapLayer | undefined {
    return getLayerById(id);
  }

  static getEnabledLayers(): MapLayer[] {
    return mapLayers.filter(l => l.enabled);
  }

  static getLayersByZIndex(): MapLayer[] {
    return [...mapLayers].sort((a, b) => a.zIndex - b.zIndex);
  }

  // ═══════════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════════

  static getNodeCountByType(): Record<NodeType, number> {
    const counts = {} as Record<NodeType, number>;
    mapNodes.forEach(node => {
      counts[node.type] = (counts[node.type] || 0) + 1;
    });
    return counts;
  }

  static getNodeCountByRegion(): Record<string, number> {
    const counts: Record<string, number> = {};
    mapNodes.forEach(node => {
      counts[node.regionId] = (counts[node.regionId] || 0) + 1;
    });
    return counts;
  }

  static getNodeCountByDifficulty(): Record<string, number> {
    const counts: Record<string, number> = {};
    mapNodes.forEach(node => {
      counts[node.difficulty] = (counts[node.difficulty] || 0) + 1;
    });
    return counts;
  }
}
