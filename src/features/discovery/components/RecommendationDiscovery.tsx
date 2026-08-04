'use client';

import { useEffect, useState } from 'react';
import { recommendationService } from '@/features/discovery/services/recommendation/recommendation-service';
import type { Recommendation, SearchableType } from '@/features/discovery/types';
import { Typography } from '@/components/ui/Typography';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface RecommendationDiscoveryProps {
  entityType: SearchableType;
  entityId: string;
  title?: string;
  limit?: number;
}

export function RecommendationDiscovery({
  entityType,
  entityId,
  title = 'You may also like',
  limit = 6,
}: RecommendationDiscoveryProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recs = recommendationService.getYouMayAlsoLike(entityType, entityId, limit);
    setRecommendations(recs);
    setLoading(false);
  }, [entityType, entityId, limit]);

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-[rgb(var(--color-primary))]" />
        <Typography variant="h3">{title}</Typography>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => (
          <Link key={rec.id} href={rec.item.url}>
            <Card variant="interactive" padding="sm" className="h-full transition-all hover:shadow-lg">
              <CardContent className="flex flex-col gap-3 p-0">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {rec.item.icon && (
                      <img
                        src={rec.item.icon}
                        alt={rec.item.title}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <Typography variant="bodySm" weight="semibold" className="truncate">
                        {rec.item.title}
                      </Typography>
                      <Typography variant="caption" textColor="tertiary" className="capitalize">
                        {rec.item.type}
                      </Typography>
                    </div>
                  </div>
                  <Badge variant={rec.type === 'similar' ? 'primary' : rec.type === 'trending' ? 'warning' : 'default'} className="text-[10px]">
                    {rec.type === 'similar' && 'Similar'}
                    {rec.type === 'trending' && 'Trending'}
                    {rec.type === 'popular' && 'Popular'}
                    {rec.type === 'complementary' && 'Related'}
                    {rec.type === 'alternative' && 'Alternative'}
                  </Badge>
                </div>

                {/* Description */}
                <Typography variant="caption" textColor="secondary" className="line-clamp-2">
                  {rec.item.description}
                </Typography>

                {/* Reason */}
                <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-tertiary))]">
                  <ArrowRight className="h-3 w-3" />
                  <span>{rec.reason}</span>
                </div>

                {/* Confidence */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-[rgb(var(--color-warning))]" />
                    <Typography variant="caption" textColor="tertiary">
                      {(rec.confidence * 100).toFixed(0)}% match
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
