import type { Recommendation, RecommendationRequest, RecommendationResponse, KnowledgeNode, RecommendationType } from '../../types';
import { knowledgeGraphService } from '../knowledge/knowledge-service';
import { searchService } from '../search/search-service';
import type { SearchIndex } from '../../types';

/**
 * Recommendation Discovery Service
 * Provides intelligent recommendations based on context and relationships
 */

class RecommendationService {
  getRecommendations(request: RecommendationRequest): RecommendationResponse {
    const startTime = performance.now();
    const { entityType, entityId, recommendationTypes, limit = 10, context } = request;

    const sourceNode = knowledgeGraphService.getNode(entityId);
    if (!sourceNode) {
      return {
        recommendations: [],
        sourceEntity: { id: entityId, type: entityType as any, name: 'Unknown', description: '', url: '', metadata: {} },
        executionTime: performance.now() - startTime,
      };
    }

    const recommendations: Recommendation[] = [];

    // Get related nodes from knowledge graph
    const relatedNodes = knowledgeGraphService.getRelatedNodes(entityId);

    // Generate recommendations based on type
    recommendationTypes.forEach((type) => {
      switch (type) {
        case 'similar':
          recommendations.push(...this.getSimilarRecommendations(sourceNode, relatedNodes, limit));
          break;
        case 'alternative':
          recommendations.push(...this.getAlternativeRecommendations(sourceNode, relatedNodes, limit));
          break;
        case 'complementary':
          recommendations.push(...this.getComplementaryRecommendations(sourceNode, relatedNodes, limit));
          break;
        case 'trending':
          recommendations.push(...this.getTrendingRecommendations(sourceNode, limit));
          break;
        case 'popular':
          recommendations.push(...this.getPopularRecommendations(sourceNode, limit));
          break;
        case 'personalized':
          recommendations.push(...this.getPersonalizedRecommendations(sourceNode, context, limit));
          break;
      }
    });

    // Sort by score and limit
    recommendations.sort((a, b) => b.score - a.score);
    const limitedRecommendations = recommendations.slice(0, limit);

    const executionTime = performance.now() - startTime;

    return {
      recommendations: limitedRecommendations,
      sourceEntity: sourceNode,
      executionTime,
    };
  }

  private getSimilarRecommendations(
    sourceNode: KnowledgeNode,
    relatedNodes: KnowledgeNode[],
    limit: number
  ): Recommendation[] {
    return relatedNodes
      .filter((node) => node.type === sourceNode.type && node.id !== sourceNode.id)
      .slice(0, limit)
      .map((node) => ({
        id: `${sourceNode.id}-similar-${node.id}`,
        type: 'similar' as RecommendationType,
        item: this.nodeToSearchIndex(node),
        score: 0.9,
        reason: `Similar ${sourceNode.type} to ${sourceNode.name}`,
        confidence: 0.85,
      }));
  }

  private getAlternativeRecommendations(
    sourceNode: KnowledgeNode,
    relatedNodes: KnowledgeNode[],
    limit: number
  ): Recommendation[] {
    // Find alternatives based on same category/type
    const alternatives = relatedNodes
      .filter((node) => node.type === sourceNode.type && node.id !== sourceNode.id)
      .slice(0, limit)
      .map((node) => ({
        id: `${sourceNode.id}-alt-${node.id}`,
        type: 'alternative' as RecommendationType,
        item: this.nodeToSearchIndex(node),
        score: 0.8,
        reason: `Alternative to ${sourceNode.name}`,
        confidence: 0.75,
      }));

    return alternatives;
  }

  private getComplementaryRecommendations(
    sourceNode: KnowledgeNode,
    relatedNodes: KnowledgeNode[],
    limit: number
  ): Recommendation[] {
    // Find complementary items (e.g., weapons for a character)
    const complementary = relatedNodes
      .filter((node) => node.type !== sourceNode.type)
      .slice(0, limit)
      .map((node) => ({
        id: `${sourceNode.id}-comp-${node.id}`,
        type: 'complementary' as RecommendationType,
        item: this.nodeToSearchIndex(node),
        score: 0.7,
        reason: `Complements ${sourceNode.name}`,
        confidence: 0.7,
      }));

    return complementary;
  }

  private getTrendingRecommendations(
    sourceNode: KnowledgeNode,
    limit: number
  ): Recommendation[] {
    // Get trending items of the same type
    const searchResults = searchService.search({
      query: '',
      types: [sourceNode.type as any],
      sortBy: 'popularity',
      limit,
    });

    return searchResults.results
      .filter((result) => result.item.id !== sourceNode.id)
      .map((result) => ({
        id: `${sourceNode.id}-trending-${result.item.id}`,
        type: 'trending' as RecommendationType,
        item: result.item,
        score: result.score * 0.6,
        reason: 'Trending now',
        confidence: 0.6,
      }));
  }

  private getPopularRecommendations(
    sourceNode: KnowledgeNode,
    limit: number
  ): Recommendation[] {
    // Get popular items of the same type
    const searchResults = searchService.search({
      query: '',
      types: [sourceNode.type as any],
      sortBy: 'popularity',
      limit,
    });

    return searchResults.results
      .filter((result) => result.item.id !== sourceNode.id)
      .map((result) => ({
        id: `${sourceNode.id}-popular-${result.item.id}`,
        type: 'popular' as RecommendationType,
        item: result.item,
        score: result.score * 0.5,
        reason: 'Popular choice',
        confidence: 0.65,
      }));
  }

  private getPersonalizedRecommendations(
    sourceNode: KnowledgeNode,
    context: Record<string, any> | undefined,
    limit: number
  ): Recommendation[] {
    // For now, return related nodes with high weight
    // In the future, this can be enhanced with user behavior data
    const relatedNodes = knowledgeGraphService.getRelatedNodes(sourceNode.id);
    
    return relatedNodes
      .slice(0, limit)
      .map((node) => ({
        id: `${sourceNode.id}-personal-${node.id}`,
        type: 'personalized' as RecommendationType,
        item: this.nodeToSearchIndex(node),
        score: 0.75,
        reason: 'Recommended for you',
        confidence: 0.7,
      }));
  }

  private nodeToSearchIndex(node: KnowledgeNode): SearchIndex {
    return {
      id: node.id,
      type: node.type as any,
      title: node.name,
      description: node.description,
      slug: node.id,
      url: node.url,
      icon: node.icon,
      tags: [],
      metadata: node.metadata,
      popularity: (node.metadata.popularity as number) || 50,
      verification: {
        verified: true,
        verifiedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Get "You may also like" recommendations for a page
  getYouMayAlsoLike(entityType: string, entityId: string, limit: number = 6): Recommendation[] {
    const response = this.getRecommendations({
      entityType: entityType as any,
      entityId,
      recommendationTypes: ['similar', 'complementary'],
      limit,
    });

    return response.recommendations;
  }

  // Get suggested builds for a character
  getSuggestedBuilds(characterId: string, limit: number = 5): Recommendation[] {
    const response = this.getRecommendations({
      entityType: 'character',
      entityId: characterId,
      recommendationTypes: ['complementary'],
      limit,
    });

    return response.recommendations.filter((rec) => rec.item.type === 'build');
  }

  // Get similar characters
  getSimilarCharacters(characterId: string, limit: number = 4): Recommendation[] {
    const response = this.getRecommendations({
      entityType: 'character',
      entityId: characterId,
      recommendationTypes: ['similar'],
      limit,
    });

    return response.recommendations;
  }

  // Get alternative weapons
  getAlternativeWeapons(weaponId: string, limit: number = 4): Recommendation[] {
    const response = this.getRecommendations({
      entityType: 'weapon',
      entityId: weaponId,
      recommendationTypes: ['alternative'],
      limit,
    });

    return response.recommendations;
  }
}

export const recommendationService = new RecommendationService();
