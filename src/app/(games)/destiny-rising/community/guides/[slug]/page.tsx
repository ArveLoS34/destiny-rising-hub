import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { guideService } from '@/features/community/services/guide-service';
import { Eye, Heart, MessageCircle, CheckCircle, Calendar, Tag } from 'lucide-react';

interface GuidePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = guideService.getBySlug(params.slug);
  if (!guide) return { title: 'Guide Not Found' };

  return {
    title: guide.title,
    description: guide.summary,
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = guideService.getBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Community', href: '/destiny-rising/community' },
          { label: guide.title },
        ]}
        className="mb-6"
      />

      <Container>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="capitalize">
              {guide.category}
            </Badge>
            {guide.verification.verified && (
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified Guide
              </Badge>
            )}
          </div>

          <Typography variant="h1" className="mb-4">
            {guide.title}
          </Typography>

          <Typography variant="bodyLg" textColor="secondary" className="mb-6">
            {guide.summary}
          </Typography>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[rgb(var(--color-text-secondary))]">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{guide.views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>{guide.likes.toLocaleString()} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{guide.commentCount} comments</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Updated {new Date(guide.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>v{guide.gameVersion}</span>
            </div>
          </div>

          {/* Tags */}
          {guide.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {guide.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <Button variant="primary">
            <Heart className="h-4 w-4 mr-2" />
            Like
          </Button>
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: guide.content }}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-[rgb(var(--color-border))]">
          <Typography variant="bodySm" textColor="secondary">
            Was this guide helpful? Let us know by leaving a like or comment!
          </Typography>
        </div>
      </Container>
    </>
  );
}
