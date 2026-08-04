import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { dashboardService } from '@/features/admin/services/dashboard-service';
import { Users, FileText, MessageCircle, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = dashboardService.getStats();
  const topCharacters = dashboardService.getTopContent('characters', 5);
  const systemHealth = dashboardService.getSystemHealth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Typography variant="h1">Dashboard</Typography>
        <Typography variant="body" textColor="secondary">
          Platform overview and key metrics
        </Typography>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="caption" textColor="tertiary">
                  Daily Active Users
                </Typography>
                <Typography variant="h2" className="mt-1">
                  {stats.dailyActiveUsers.toLocaleString()}
                </Typography>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(var(--color-primary)/0.1)]">
                <Users className="h-6 w-6 text-[rgb(var(--color-primary))]" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[rgb(var(--color-success))]" />
              <Typography variant="caption" className="text-[rgb(var(--color-success))]">
                +12% from yesterday
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="caption" textColor="tertiary">
                  New Builds
                </Typography>
                <Typography variant="h2" className="mt-1">
                  {stats.newBuilds}
                </Typography>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(var(--color-accent)/0.1)]">
                <FileText className="h-6 w-6 text-[rgb(var(--color-accent))]" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[rgb(var(--color-success))]" />
              <Typography variant="caption" className="text-[rgb(var(--color-success))]">
                +8 today
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="caption" textColor="tertiary">
                  New Comments
                </Typography>
                <Typography variant="h2" className="mt-1">
                  {stats.newComments}
                </Typography>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(var(--color-secondary)/0.1)]">
                <MessageCircle className="h-6 w-6 text-[rgb(var(--color-secondary))]" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[rgb(var(--color-success))]" />
              <Typography variant="caption" className="text-[rgb(var(--color-success))]">
                +24 today
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="caption" textColor="tertiary">
                  Pending Reports
                </Typography>
                <Typography variant="h2" className="mt-1">
                  {stats.pendingReports}
                </Typography>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgb(var(--color-warning)/0.1)]">
                <AlertTriangle className="h-6 w-6 text-[rgb(var(--color-warning))]" />
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="warning">Needs Attention</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Top Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Health */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <Typography variant="h3">System Health</Typography>
              <Badge variant={systemHealth.status === 'healthy' ? 'success' : 'warning'}>
                {systemHealth.status}
              </Badge>
            </div>
            <div className="space-y-3">
              {Object.entries(systemHealth.components).map(([key, component]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
                    <Typography variant="bodySm" className="capitalize">
                      {key}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant="bodySm" textColor="secondary">
                      {component.value}
                    </Typography>
                    <Badge
                      variant={component.status === 'healthy' ? 'success' : 'warning'}
                      className="text-xs"
                    >
                      {component.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Characters */}
        <Card>
          <CardContent className="p-6">
            <Typography variant="h3" className="mb-4">
              Top Characters
            </Typography>
            <div className="space-y-3">
              {topCharacters.map((character, index) => (
                <div key={character.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--color-surface-elevated))] text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <Typography variant="bodySm" weight="medium">
                        {character.name}
                      </Typography>
                      <Typography variant="caption" textColor="tertiary">
                        {character.views.toLocaleString()} views
                      </Typography>
                    </div>
                  </div>
                  <div className="text-right">
                    <Typography variant="bodySm" weight="medium">
                      {character.likes.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" textColor="tertiary">
                      likes
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h3" className="mb-4">
            Recent Activity
          </Typography>
          <div className="space-y-3">
            {dashboardService.getRecentActivity(5).map((activity, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg bg-[rgb(var(--color-surface-elevated))] p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--color-primary)/0.1)]">
                  <Activity className="h-4 w-4 text-[rgb(var(--color-primary))]" />
                </div>
                <div className="flex-1">
                  <Typography variant="bodySm">
                    <span className="font-medium">{activity.userName}</span>{' '}
                    {activity.type === 'user_registered' && 'registered'}
                    {activity.type === 'build_created' && `created build "${activity.contentTitle}"`}
                    {activity.type === 'guide_published' && `published guide "${activity.contentTitle}"`}
                    {activity.type === 'comment_added' && `commented on "${activity.contentTitle}"`}
                  </Typography>
                  <Typography variant="caption" textColor="tertiary">
                    {new Date(activity.timestamp).toLocaleString()}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
