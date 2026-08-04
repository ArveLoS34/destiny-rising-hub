'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  GitBranch,
  Package,
  Server,
  Workflow,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  HardDrive,
} from 'lucide-react';

// Mock data - will be replaced with real API calls
const dashboardData = {
  pendingReviews: 12,
  failedImports: 3,
  validationErrors: 7,
  scheduledPublications: 5,
  patchQueue: 2,
  backgroundJobs: {
    running: 8,
    queued: 23,
    failed: 2,
  },
  apiHealth: {
    status: 'healthy',
    latency: 145,
    requests: 1247,
  },
  databaseHealth: {
    status: 'healthy',
    connections: 45,
    queries: 8923,
  },
  storageUsage: {
    used: 2.4,
    total: 10,
    percentage: 24,
  },
  recentActivity: [
    { id: 1, action: 'Character updated', user: 'admin', time: '2 min ago', type: 'update' },
    { id: 2, action: 'Import completed', user: 'system', time: '5 min ago', type: 'success' },
    { id: 3, action: 'Review requested', user: 'moderator', time: '10 min ago', type: 'review' },
    { id: 4, action: 'Patch released', user: 'admin', time: '1 hour ago', type: 'release' },
    { id: 5, action: 'Import failed', user: 'system', time: '2 hours ago', type: 'error' },
  ],
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Content Operations Overview</p>
      </div>

      {/* Critical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.pendingReviews}</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed Imports</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.failedImports}</div>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Validation Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.validationErrors}</div>
            <p className="text-xs text-gray-500 mt-1">Need fixing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{dashboardData.scheduledPublications}</div>
            <p className="text-xs text-gray-500 mt-1">Publications queued</p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-green-500" />
              API Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge variant="success">{dashboardData.apiHealth.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Latency</span>
              <span className="text-sm font-medium">{dashboardData.apiHealth.latency}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Requests (1h)</span>
              <span className="text-sm font-medium">{dashboardData.apiHealth.requests.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              Database Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge variant="success">{dashboardData.databaseHealth.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Connections</span>
              <span className="text-sm font-medium">{dashboardData.databaseHealth.connections}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Queries (1h)</span>
              <span className="text-sm font-medium">{dashboardData.databaseHealth.queries.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-blue-500" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Used</span>
              <span className="text-sm font-medium">{dashboardData.storageUsage.used} GB / {dashboardData.storageUsage.total} GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${dashboardData.storageUsage.percentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{dashboardData.storageUsage.percentage}% used</span>
              <span className="text-xs text-gray-500">{dashboardData.storageUsage.total - dashboardData.storageUsage.used} GB free</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Background Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-purple-500" />
            Background Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">Running</span>
                <Activity className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">{dashboardData.backgroundJobs.running}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Queued</span>
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">{dashboardData.backgroundJobs.queued}</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-900">Failed</span>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-900">{dashboardData.backgroundJobs.failed}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center',
                    activity.type === 'success' && 'bg-green-100',
                    activity.type === 'error' && 'bg-red-100',
                    activity.type === 'update' && 'bg-blue-100',
                    activity.type === 'review' && 'bg-orange-100',
                    activity.type === 'release' && 'bg-purple-100',
                  )}>
                    {activity.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                    {activity.type === 'update' && <Package className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'review' && <CheckCircle className="h-4 w-4 text-orange-600" />}
                    {activity.type === 'release' && <GitBranch className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Run Import
            </Button>
            <Button variant="outline" className="justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Review Queue
            </Button>
            <Button variant="outline" className="justify-start">
              <GitBranch className="h-4 w-4 mr-2" />
              Release Patch
            </Button>
            <Button variant="outline" className="justify-start">
              <Package className="h-4 w-4 mr-2" />
              Add Character
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
