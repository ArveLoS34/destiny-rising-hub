'use client';

import type { Guide } from '@/types/domain';
import { Card, CardContent } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Eye, Heart, MessageCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface GuideCardProps {
  guide: Guide;
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <Link href={`/community/guides/${guide.slug}`}>
      <Card variant="interactive" padding="md" className="h-full transition-all hover:shadow-lg">
        <CardContent className="flex flex-col gap-4 p-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs capitalize">
                  {guide.category}
                </Badge>
                {guide.verification.verified && (
                  <Badge variant="success" className="text-xs gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <Typography variant="h4" className="line-clamp-2">
                {guide.title}
              </Typography>
            </div>
          </div>

          {/* Summary */}
          <Typography variant="bodySm" textColor="secondary" className="line-clamp-3">
            {guide.summary}
          </Typography>

          {/* Tags */}
          {guide.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {guide.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {guide.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{guide.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[rgb(var(--color-border))]">
            <div className="flex items-center gap-4 text-xs text-[rgb(var(--color-text-secondary))]">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {guide.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {guide.likes.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {guide.commentCount}
              </span>
            </div>
            <Typography variant="caption" textColor="tertiary">
              v{guide.gameVersion}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
