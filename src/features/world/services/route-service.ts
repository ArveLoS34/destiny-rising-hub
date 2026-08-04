import type { Route, RouteNode, AIRouteRequest, AIRouteResponse, MapNode } from '@/types/domain';
import { WorldService } from './world-service';
import { mapNodes } from '@/data/games/destiny-rising/world';

/**
 * Route Service
 * Manages routes and route planning
 */

export class RouteService {
  private static routes: Route[] = [];

  // ═══════════════════════════════════════════════════════════════════
  // ROUTE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════

  static getAllRoutes(): Route[] {
    return this.routes;
  }

  static getRouteById(id: string): Route | undefined {
    return this.routes.find(r => r.id === id);
  }

  static getRouteBySlug(slug: string): Route | undefined {
    return this.routes.find(r => r.slug === slug);
  }

  static getRoutesByType(type: string): Route[] {
    return this.routes.filter(r => r.type === type);
  }

  static getPublicRoutes(): Route[] {
    return this.routes.filter(r => r.isPublic);
  }

  static getUserRoutes(userId: string): Route[] {
    return this.routes.filter(r => r.createdBy === userId);
  }

  static createRoute(route: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Route {
    const newRoute: Route = {
      ...route,
      id: `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.routes.push(newRoute);
    return newRoute;
  }

  static updateRoute(id: string, updates: Partial<Route>): Route | undefined {
    const index = this.routes.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    this.routes[index] = {
      ...this.routes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.routes[index];
  }

  static deleteRoute(id: string): boolean {
    const index = this.routes.findIndex(r => r.id === id);
    if (index === -1) return false;
    this.routes.splice(index, 1);
    return true;
  }

  // ═══════════════════════════════════════════════════════════════════
  // ROUTE CALCULATION
  // ═══════════════════════════════════════════════════════════════════

  static calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static calculateRouteDistance(nodes: RouteNode[]): number {
    let totalDistance = 0;
    for (let i = 0; i < nodes.length - 1; i++) {
      const node1 = WorldService.getNodeById(nodes[i].nodeId);
      const node2 = WorldService.getNodeById(nodes[i + 1].nodeId);
      if (node1 && node2) {
        totalDistance += this.calculateDistance(node1.position, node2.position);
      }
    }
    return totalDistance;
  }

  static estimateRouteTime(distance: number, averageSpeed: number = 50): number {
    return Math.ceil(distance / averageSpeed);
  }

  // ═══════════════════════════════════════════════════════════════════
  // ROUTE OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════

  static optimizeRoute(nodes: RouteNode[], optimization: 'shortest' | 'fastest' | 'safest' = 'shortest'): RouteNode[] {
    if (nodes.length <= 2) return nodes;

    // Simple nearest-neighbor algorithm for shortest path
    if (optimization === 'shortest') {
      const optimized: RouteNode[] = [nodes[0]];
      const remaining = nodes.slice(1);

      while (remaining.length > 0) {
        const current = optimized[optimized.length - 1];
        const currentNode = WorldService.getNodeById(current.nodeId);
        if (!currentNode) break;

        let nearestIndex = 0;
        let nearestDistance = Infinity;

        remaining.forEach((node, index) => {
          const targetNode = WorldService.getNodeById(node.nodeId);
          if (targetNode) {
            const distance = this.calculateDistance(currentNode.position, targetNode.position);
            if (distance < nearestDistance) {
              nearestDistance = distance;
              nearestIndex = index;
            }
          }
        });

        optimized.push(remaining[nearestIndex]);
        remaining.splice(nearestIndex, 1);
      }

      return optimized.map((node, index) => ({ ...node, order: index }));
    }

    return nodes;
  }

  // ═══════════════════════════════════════════════════════════════════
  // AI ROUTE PLANNING
  // ═══════════════════════════════════════════════════════════════════

  static planAIRoute(request: AIRouteRequest): AIRouteResponse {
    const { characterId, targetMaterials, optimizationGoal } = request;

    // Find nodes that drop the target materials
    const candidateNodes: MapNode[] = [];
    
    targetMaterials.forEach(target => {
      const nodes = mapNodes.filter(node => 
        node.drops?.some(drop => drop.itemId === target.materialId)
      );
      candidateNodes.push(...nodes);
    });

    // Remove duplicates
    const uniqueNodes = Array.from(new Set(candidateNodes.map(n => n.id)))
      .map(id => candidateNodes.find(n => n.id === id)!);

    // Create route nodes
    const routeNodes: RouteNode[] = uniqueNodes.map((node, index) => ({
      nodeId: node.id,
      order: index,
      estimatedTimeAtNode: 5, // 5 minutes per node
    }));

    // Optimize route
    const optimizedNodes = this.optimizeRoute(routeNodes, optimizationGoal);

    // Calculate route metrics
    const totalDistance = this.calculateRouteDistance(optimizedNodes);
    const estimatedTime = this.estimateRouteTime(totalDistance) + 
      optimizedNodes.reduce((sum, node) => sum + node.estimatedTimeAtNode, 0);

    // Create route
    const route: Route = {
      id: `route-ai-${Date.now()}`,
      slug: `ai-route-${Date.now()}`,
      name: `AI Optimized Route for ${targetMaterials.length} materials`,
      description: `AI-generated route optimized for ${optimizationGoal}`,
      type: 'material',
      nodes: optimizedNodes,
      totalDistance,
      estimatedTime,
      difficulty: 'medium',
      createdBy: 'ai',
      isPublic: false,
      isAIGenerated: true,
      rating: 0,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Generate reasoning
    const reasoning = [
      `Found ${uniqueNodes.length} nodes matching your material requirements`,
      `Optimized route for ${optimizationGoal} distance`,
      `Estimated total time: ${estimatedTime} minutes`,
      `Total distance: ${Math.round(totalDistance)} units`,
    ];

    // Generate alternative routes
    const alternatives: Route[] = [];
    if (optimizationGoal !== 'safest') {
      const safeRoute = { ...route, id: `${route.id}-safe`, name: `${route.name} (Safe)` };
      alternatives.push(safeRoute);
    }

    return {
      route,
      reasoning,
      alternatives,
      confidence: 0.85,
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // ROUTE STATISTICS
  // ═══════════════════════════════════════════════════════════════════

  static getMostUsedRoutes(limit: number = 10): Route[] {
    return [...this.routes]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  static getTopRatedRoutes(limit: number = 10): Route[] {
    return [...this.routes]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  static incrementRouteUsage(routeId: string): void {
    const route = this.getRouteById(routeId);
    if (route) {
      this.updateRoute(routeId, { usageCount: route.usageCount + 1 });
    }
  }

  static rateRoute(routeId: string, rating: number): void {
    const route = this.getRouteById(routeId);
    if (route) {
      const newRating = (route.rating * route.usageCount + rating) / (route.usageCount + 1);
      this.updateRoute(routeId, { rating: newRating });
    }
  }
}
