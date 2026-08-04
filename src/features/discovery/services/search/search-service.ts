import type {
  SearchIndex,
  SearchQuery,
  SearchResult,
  SearchResponse,
  SearchableType,
} from '../../types';
import { characters } from '@/data/games/destiny-rising/characters';
import { weapons } from '@/data/games/destiny-rising/weapons';
import { builds } from '@/data/games/destiny-rising/builds';
import { teams } from '@/data/games/destiny-rising/teams';
import { materials } from '@/data/games/destiny-rising/materials';
import { mapNodes } from '@/data/games/destiny-rising/world';

/**
 * Universal Search Service
 * Provides unified search across all platform content
 */

class SearchIndexManager {
  private index: Map<string, SearchIndex> = new Map();
  private typeIndex: Map<SearchableType, Set<string>> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();

  constructor() {
    this.buildIndex();
  }

  private buildIndex() {
    // Index characters
    characters.forEach((char) => {
      this.addToIndex({
        id: char.id,
        type: 'character',
        title: char.name,
        description: `${char.title} - ${char.role} ${char.element} character`,
        slug: char.slug,
        url: `/destiny-rising/characters/${char.slug}`,
        icon: char.icon,
        image: char.portrait,
        tags: [char.element, char.role, char.rarity, char.weaponType, char.faction],
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
        popularity: char.popularity,
        verification: {
          verified: char.verification.verified,
          verifiedAt: new Date().toISOString(),
        },
        createdAt: char.releaseVersion,
        updatedAt: char.verification.gameVersion,
      });
    });

    // Index weapons
    weapons.forEach((weapon) => {
      this.addToIndex({
        id: weapon.id,
        type: 'weapon',
        title: weapon.name,
        description: `${weapon.rarity} ${weapon.weaponType} - ${weapon.element} element`,
        slug: weapon.slug,
        url: `/destiny-rising/weapons/${weapon.slug}`,
        icon: weapon.icon,
        image: weapon.splashArt,
        tags: [weapon.element, weapon.weaponType, weapon.rarity, weapon.damageType],
        metadata: {
          element: weapon.element,
          weaponType: weapon.weaponType,
          rarity: weapon.rarity,
          damageType: weapon.damageType,
          baseATK: weapon.stats.baseATK,
          tier: weapon.tier,
          popularity: weapon.popularity,
        },
        popularity: weapon.popularity,
        verification: {
          verified: weapon.verification.verified,
          verifiedAt: new Date().toISOString(),
        },
        createdAt: weapon.releaseVersion,
        updatedAt: weapon.verification.gameVersion,
      });
    });

    // Index builds
    builds.forEach((build) => {
      this.addToIndex({
        id: build.id,
        type: 'build',
        title: build.title,
        description: `${build.buildType} build for ${build.characterName}`,
        slug: build.slug,
        url: `/destiny-rising/build-lab/${build.slug}`,
        icon: build.characterIcon,
        tags: [build.buildType, build.priority, build.difficulty, build.characterName],
        metadata: {
          buildType: build.buildType,
          priority: build.priority,
          difficulty: build.difficulty,
          characterId: build.characterId,
          characterName: build.characterName,
          tier: build.tier,
          rating: build.rating,
          popularity: build.popularity,
        },
        popularity: build.popularity,
        verification: {
          verified: build.verification.verified,
          verifiedAt: new Date().toISOString(),
        },
        createdAt: build.id,
        updatedAt: build.verification.gameVersion,
      });
    });

    // Index teams
    teams.forEach((team) => {
      this.addToIndex({
        id: team.id,
        type: 'team',
        title: team.title,
        description: `${team.template} team composition`,
        slug: team.slug,
        url: `/destiny-rising/teams/${team.slug}`,
        tags: [team.template, ...team.members.map((m) => m.characterName)],
        metadata: {
          template: team.template,
          members: team.members.map((m) => m.characterName),
          tier: team.tier,
          rating: team.rating,
          popularity: team.popularity,
        },
        popularity: team.popularity,
        verification: {
          verified: team.verification.verified,
          verifiedAt: new Date().toISOString(),
        },
        createdAt: team.id,
        updatedAt: team.verification.gameVersion,
      });
    });

    // Index materials
    materials.forEach((material) => {
      this.addToIndex({
        id: material.id,
        type: 'material',
        title: material.name,
        description: `${material.rarity} ${material.category} material`,
        slug: material.slug,
        url: `/destiny-rising/materials/${material.slug}`,
        icon: material.icon,
        tags: [material.rarity, material.category, ...material.sources.map((s) => s.type)],
        metadata: {
          rarity: material.rarity,
          category: material.category,
          sources: material.sources.map((s) => s.type),
          isWeekly: material.isWeekly,
          isDaily: material.isDaily,
        },
        popularity: 50, // Default popularity for materials
        verification: {
          verified: material.verification.verified,
          verifiedAt: new Date().toISOString(),
        },
        createdAt: material.id,
        updatedAt: material.verification.gameVersion,
      });
    });

    // Index map nodes
    mapNodes.forEach((node) => {
      this.addToIndex({
        id: node.id,
        type: node.type === 'boss' ? 'boss' : node.type === 'npc' ? 'npc' : 'node',
        title: node.name,
        description: `${node.type} node - ${node.difficulty} difficulty`,
        slug: node.slug,
        url: `/destiny-rising/world?node=${node.id}`,
        icon: node.icon,
        tags: [node.type, node.difficulty, node.status],
        metadata: {
          nodeType: node.type,
          difficulty: node.difficulty,
          status: node.status,
          regionId: node.regionId,
          zoneId: node.zoneId,
          respawnTime: node.respawnTime,
        },
        popularity: 50,
        verification: {
          verified: node.verification.verified,
          verifiedAt: new Date().toISOString(),
        },
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
      });
    });
  }

  private addToIndex(item: SearchIndex) {
    this.index.set(item.id, item);

    // Add to type index
    if (!this.typeIndex.has(item.type)) {
      this.typeIndex.set(item.type, new Set());
    }
    this.typeIndex.get(item.type)!.add(item.id);

    // Add to tag index
    item.tags.forEach((tag) => {
      const normalizedTag = tag.toLowerCase();
      if (!this.tagIndex.has(normalizedTag)) {
        this.tagIndex.set(normalizedTag, new Set());
      }
      this.tagIndex.get(normalizedTag)!.add(item.id);
    });
  }

  search(query: SearchQuery): SearchResponse {
    const startTime = performance.now();
    const queryLower = query.query.toLowerCase().trim();
    const queryTerms = queryLower.split(/\s+/);

    let results: SearchResult[] = [];

    // Get candidate items
    let candidateIds: Set<string>;

    if (query.types && query.types.length > 0) {
      candidateIds = new Set();
      query.types.forEach((type) => {
        const typeIds = this.typeIndex.get(type);
        if (typeIds) {
          typeIds.forEach((id) => candidateIds.add(id));
        }
      });
    } else {
      candidateIds = new Set(this.index.keys());
    }

    // Score each candidate
    candidateIds.forEach((id) => {
      const item = this.index.get(id);
      if (!item) return;

      const score = this.calculateScore(item, queryTerms, query);
      if (score > 0) {
        const highlights = this.generateHighlights(item, queryTerms);
        results.push({ item, score, highlights });
      }
    });

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    // Apply limit and offset
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    results = results.slice(offset, offset + limit);

    // Generate suggestions
    const suggestions = this.generateSuggestions(queryTerms);

    const executionTime = performance.now() - startTime;

    return {
      results,
      total: results.length,
      query: query.query,
      filters: query.filters || {},
      suggestions,
      executionTime,
    };
  }

  private calculateScore(
    item: SearchIndex,
    queryTerms: string[],
    query: SearchQuery
  ): number {
    let score = 0;

    // Title match (highest weight)
    const titleLower = item.title.toLowerCase();
    queryTerms.forEach((term) => {
      if (titleLower.includes(term)) {
        score += 100;
        if (titleLower === term) score += 50; // Exact match bonus
      }
    });

    // Description match
    const descLower = item.description.toLowerCase();
    queryTerms.forEach((term) => {
      if (descLower.includes(term)) {
        score += 30;
      }
    });

    // Tag match
    item.tags.forEach((tag) => {
      const tagLower = tag.toLowerCase();
      queryTerms.forEach((term) => {
        if (tagLower.includes(term)) {
          score += 20;
        }
      });
    });

    // Fuzzy matching
    if (query.includeFuzzy !== false) {
      queryTerms.forEach((term) => {
        if (this.fuzzyMatch(titleLower, term)) {
          score += 15;
        }
      });
    }

    // Popularity bonus
    score += item.popularity * 0.1;

    // Verification bonus
    if (item.verification.verified) {
      score += 10;
    }

    // Apply sort preferences
    if (query.sortBy === 'popularity') {
      score += item.popularity * 0.5;
    } else if (query.sortBy === 'recency') {
      const recency = new Date(item.updatedAt).getTime();
      score += recency * 0.000001;
    } else if (query.sortBy === 'verification' && item.verification.verified) {
      score += 50;
    }

    return score;
  }

  private fuzzyMatch(text: string, term: string): boolean {
    if (text === term) return true;
    if (text.length < term.length) return false;

    // Simple Levenshtein distance check
    let distance = 0;
    const maxDistance = Math.floor(term.length * 0.3); // Allow 30% difference

    for (let i = 0; i < term.length; i++) {
      if (!text.includes(term[i])) {
        distance++;
        if (distance > maxDistance) return false;
      }
    }

    return true;
  }

  private generateHighlights(
    item: SearchIndex,
    queryTerms: string[]
  ): { field: string; snippets: string[] }[] {
    const highlights: { field: string; snippets: string[] }[] = [];

    // Title highlights
    const titleSnippets: string[] = [];
    queryTerms.forEach((term) => {
      if (item.title.toLowerCase().includes(term)) {
        titleSnippets.push(this.highlightText(item.title, term));
      }
    });
    if (titleSnippets.length > 0) {
      highlights.push({ field: 'title', snippets: titleSnippets });
    }

    // Description highlights
    const descSnippets: string[] = [];
    queryTerms.forEach((term) => {
      if (item.description.toLowerCase().includes(term)) {
        descSnippets.push(this.highlightText(item.description, term));
      }
    });
    if (descSnippets.length > 0) {
      highlights.push({ field: 'description', snippets: descSnippets });
    }

    return highlights;
  }

  private highlightText(text: string, term: string): string {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  private generateSuggestions(queryTerms: string[]): string[] {
    const suggestions: string[] = [];
    const allTags = Array.from(this.tagIndex.keys());

    queryTerms.forEach((term) => {
      allTags.forEach((tag) => {
        if (tag.includes(term) && tag !== term) {
          suggestions.push(tag);
        }
      });
    });

    return [...new Set(suggestions)].slice(0, 5);
  }

  getByType(type: SearchableType): SearchIndex[] {
    const ids = this.typeIndex.get(type);
    if (!ids) return [];
    return Array.from(ids)
      .map((id) => this.index.get(id))
      .filter((item): item is SearchIndex => item !== undefined);
  }

  getById(id: string): SearchIndex | undefined {
    return this.index.get(id);
  }

  getByTag(tag: string): SearchIndex[] {
    const ids = this.tagIndex.get(tag.toLowerCase());
    if (!ids) return [];
    return Array.from(ids)
      .map((id) => this.index.get(id))
      .filter((item): item is SearchIndex => item !== undefined);
  }
}

export const searchService = new SearchIndexManager();
