import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { GuideCard } from '@/features/community/components/GuideCard';
import { guideService } from '@/features/community/services/guide-service';
import { BookOpen, Users, TrendingUp, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Join the Destiny Rising community. Read guides, share builds, and connect with other players.',
};

export default function CommunityPage() {
  const guides = guideService.getAll({ status: 'published', limit: 12 });
  const trendingGuides = guides.slice(0, 6);

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Destiny Rising', href: '/' },
          { label: 'Community' },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1">Community</Typography>
          <Badge variant="accent">Beta</Badge>
        </div>
        <Typography variant="body" textColor="secondary" className="max-w-2xl">
          Join the Destiny Rising community. Read guides, share builds, and connect with other players.
        </Typography>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-2">
            <BookOpen className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">{guides.length}</Typography>
            <Typography variant="caption" textColor="tertiary">Guides</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-accent)/0.1)] p-2">
            <Users className="h-5 w-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">1.2K</Typography>
            <Typography variant="caption" textColor="tertiary">Members</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-secondary)/0.1)] p-2">
            <TrendingUp className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">856</Typography>
            <Typography variant="caption" textColor="tertiary">Builds</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-success)/0.1)] p-2">
            <Star className="h-5 w-5 text-[rgb(var(--color-success))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">4.8</Typography>
            <Typography variant="caption" textColor="tertiary">Avg Rating</Typography>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="guides">
        <TabsList className="mb-6">
          <TabsTrigger value="guides">
            <BookOpen className="h-4 w-4 mr-2" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="builds">
            <Star className="h-4 w-4 mr-2" />
            Builds
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Users className="h-4 w-4 mr-2" />
            Teams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builds">
          <div className="text-center py-12">
            <Typography variant="body" textColor="secondary">
              Build sharing coming soon!
            </Typography>
          </div>
        </TabsContent>

        <TabsContent value="teams">
          <div className="text-center py-12">
            <Typography variant="body" textColor="secondary">
              Team sharing coming soon!
            </Typography>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
