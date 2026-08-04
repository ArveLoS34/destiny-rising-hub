import type { KnowledgeGraph, KnowledgeNode, KnowledgeEdge, KnowledgePath, RelationType } from '../../types';
import { charactersDetail } from '@/data/games/destiny-rising/characters-detail';
import { weapons } from '@/data/games/destiny-rising/weapons';
import { builds } from '@/data/games/destiny-rising/builds';
import { teams } from '@/data/games/destiny-rising/teams';
import { materials } from '@/data/games/destiny-rising/materials';

/**
 * Knowledge Graph Service
 * Maps relationships between all entities in the platform
 */

class KnowledgeGraphService {
  private nodes: Map<string, KnowledgeNode> = new Map();
  private edges: KnowledgeEdge[] = [];

  constructor() {
    this.buildGraph();
  }

  private buildGraph() {
    // Build nodes
    this.buildCharacterNodes();
    this.buildWeaponNodes();
    this.buildBuildNodes();
    this.buildTeamNodes();
    this.buildMaterialNodes();

    // Build edges (relationships)
    this.buildCharacterWeaponEdges();
    this.buildCharacterBuildEdges();
    this.buildBuildWeaponEdges();
    this.buildBuildMaterialEdges();
    this.buildTeamCharacterEdges();
    this.buildSimilarCharacterEdges();
    this.buildSimilarWeaponEdges();
  }

  private buildCharacterNodes() {
    charactersDetail.forEach((char) => {
      this.nodes.set(char.id, {
        id: char.id,
        type: 'character',
        name: char.name,
        description: `${char.title} - ${char.role} ${char.element} character`,
        url: `/destiny-rising/characters/${char.slug}`,
        icon: char.icon,
        metadata: {
          element: char.element,
          role: char.role,
          rarity: char.rarity,
          weaponType: char.weaponType,
          faction: char.faction,
          tierList: char.tierListPlacement,
          popularity: char.popularity,
          winRate: char.winRate,
        },
      });
    });
  }

  private buildWeaponNodes() {
    weapons.forEach((weapon) => {
      this.nodes.set(weapon.id, {
        id: weapon.id,
        type: 'weapon',
        name: weapon.name,
        description: `${weapon.rarity} ${weapon.weaponType}`,
        url: `/destiny-rising/weapons/${weapon.slug}`,
        icon: weapon.icon,
        metadata: {
          element: weapon.element,
          weaponType: weapon.weaponType,
          rarity: weapon.rarity,
          baseATK: weapon.stats.baseATK,
          tier: weapon.tier,
        },
      });
    });
  }

  private buildBuildNodes() {
    builds.forEach((build) => {
      this.nodes.set(build.id, {
        id: build.id,
        type: 'build',
        name: build.title,
        description: `${build.buildType} build for ${build.characterName}`,
        url: `/destiny-rising/build-lab/${build.slug}`,
        icon: build.characterIcon,
        metadata: {
          buildType: build.buildType,
          characterId: build.characterId,
          characterName: build.characterName,
          tier: build.tier,
          rating: build.rating,
        },
      });
    });
  }

  private buildTeamNodes() {
    teams.forEach((team) => {
      this.nodes.set(team.id, {
        id: team.id,
        type: 'team',
        name: team.title,
        description: `${team.template} team`,
        url: `/destiny-rising/teams/${team.slug}`,
        metadata: {
          template: team.template,
          members: team.members.map((m) => m.characterName),
          tier: team.tier,
        },
      });
    });
  }

  private buildMaterialNodes() {
    materials.forEach((material) => {
      this.nodes.set(material.id, {
        id: material.id,
        type: 'material',
        name: material.name,
        description: `${material.rarity} ${material.category}`,
        url: `/destiny-rising/materials/${material.slug}`,
        icon: material.icon,
        metadata: {
          rarity: material.rarity,
          category: material.category,
          sources: material.sources.map((s) => s.type),
        },
      });
    });
  }

  private buildCharacterWeaponEdges() {
    charactersDetail.forEach((char) => {
      char.recommendedWeapons.forEach((weaponId) => {
        this.addEdge(char.id, weaponId, 'recommends', 0.8);
        this.addEdge(weaponId, char.id, 'recommendedBy', 0.8);
      });
    });
  }

  private buildCharacterBuildEdges() {
    builds.forEach((build) => {
      this.addEdge(build.characterId, build.id, 'buildsWith', 0.9);
      this.addEdge(build.id, build.characterId, 'builtWith', 0.9);
    });
  }

  private buildBuildWeaponEdges() {
    builds.forEach((build) => {
      this.addEdge(build.id, build.weapon.id, 'uses', 1.0);
      this.addEdge(build.weapon.id, build.id, 'usedBy', 1.0);
    });
  }

  private buildBuildMaterialEdges() {
    // BuildSummary doesn't have materials property, so we skip this for now
    // This can be added later when we have full build data
  }

  private buildTeamCharacterEdges() {
    teams.forEach((team) => {
      team.members.forEach((member) => {
        this.addEdge(team.id, member.characterId, 'contains', 1.0);
        this.addEdge(member.characterId, team.id, 'usedBy', 1.0);
      });
    });
  }

  private buildSimilarCharacterEdges() {
    charactersDetail.forEach((char1) => {
      charactersDetail.forEach((char2) => {
        if (char1.id !== char2.id) {
          // Similar if same element or role
          if (char1.element === char2.element || char1.role === char2.role) {
            const weight = char1.element === char2.element && char1.role === char2.role ? 0.9 : 0.6;
            this.addEdge(char1.id, char2.id, 'similarTo', weight);
          }
        }
      });
    });
  }

  private buildSimilarWeaponEdges() {
    weapons.forEach((w1) => {
      weapons.forEach((w2) => {
        if (w1.id !== w2.id) {
          // Similar if same weapon type or element
          if (w1.weaponType === w2.weaponType || w1.element === w2.element) {
            const weight = w1.weaponType === w2.weaponType && w1.element === w2.element ? 0.9 : 0.6;
            this.addEdge(w1.id, w2.id, 'similarTo', weight);
          }
        }
      });
    });
  }

  private addEdge(source: string, target: string, relation: RelationType, weight: number) {
    this.edges.push({ source, target, relation, weight });
  }

  getNode(id: string): KnowledgeNode | undefined {
    return this.nodes.get(id);
  }

  getNodesByType(type: string): KnowledgeNode[] {
    return Array.from(this.nodes.values()).filter((node) => node.type === type);
  }

  getRelatedNodes(nodeId: string, relation?: RelationType): KnowledgeNode[] {
    const relatedEdges = this.edges.filter(
      (edge) =>
        (edge.source === nodeId || edge.target === nodeId) &&
        (!relation || edge.relation === relation)
    );

    const relatedIds = relatedEdges.map((edge) =>
      edge.source === nodeId ? edge.target : edge.source
    );

    return relatedIds
      .map((id) => this.nodes.get(id))
      .filter((node): node is KnowledgeNode => node !== undefined);
  }

  findPath(startId: string, endId: string, maxDepth: number = 5): KnowledgePath | null {
    // BFS to find shortest path
    const visited = new Set<string>();
    const queue: { nodeId: string; path: KnowledgePath }[] = [
      {
        nodeId: startId,
        path: {
          nodes: [this.nodes.get(startId)!],
          edges: [],
          totalWeight: 0,
        },
      },
    ];

    visited.add(startId);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.nodeId === endId) {
        return current.path;
      }

      if (current.path.nodes.length >= maxDepth) {
        continue;
      }

      const relatedEdges = this.edges.filter(
        (edge) => edge.source === current.nodeId || edge.target === current.nodeId
      );

      for (const edge of relatedEdges) {
        const nextNodeId = edge.source === current.nodeId ? edge.target : edge.source;

        if (!visited.has(nextNodeId)) {
          visited.add(nextNodeId);
          const nextNode = this.nodes.get(nextNodeId);

          if (nextNode) {
            queue.push({
              nodeId: nextNodeId,
              path: {
                nodes: [...current.path.nodes, nextNode],
                edges: [...current.path.edges, edge],
                totalWeight: current.path.totalWeight + edge.weight,
              },
            });
          }
        }
      }
    }

    return null;
  }

  getGraph(): KnowledgeGraph {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
    };
  }

  getSubgraph(centerId: string, radius: number = 2): KnowledgeGraph {
    const nodes = new Set<string>();
    const edges: KnowledgeEdge[] = [];

    // BFS to collect nodes within radius
    const queue: { nodeId: string; depth: number }[] = [{ nodeId: centerId, depth: 0 }];
    nodes.add(centerId);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.depth >= radius) {
        continue;
      }

      const relatedEdges = this.edges.filter(
        (edge) => edge.source === current.nodeId || edge.target === current.nodeId
      );

      for (const edge of relatedEdges) {
        edges.push(edge);
        const nextNodeId = edge.source === current.nodeId ? edge.target : edge.source;

        if (!nodes.has(nextNodeId)) {
          nodes.add(nextNodeId);
          queue.push({ nodeId: nextNodeId, depth: current.depth + 1 });
        }
      }
    }

    return {
      nodes: Array.from(nodes)
        .map((id) => this.nodes.get(id))
        .filter((node): node is KnowledgeNode => node !== undefined),
      edges,
    };
  }
}

export const knowledgeGraphService = new KnowledgeGraphService();
