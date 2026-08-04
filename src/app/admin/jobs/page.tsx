'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Progress } from '@/components/ui/Progress';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  RotateCw,
  X,
  Play,
  TrendingUp,
  Timer,
  Server,
  Zap
} from 'lucide-react';

// Mock data - will be replaced with API calls
const queues = [
  {
    id: 'queue-import',
    name: 'import',
    description: 'Data import queue',
    status: 'active',
    waiting: 3,
    active: 1,
    delayed: 0,
    completed: 1245,
    failed: 12,
    avgDuration: 45,
    throughput: 28.5,
  },
  {
    id: 'queue-validation',
    name: 'validation',
    description: 'Data validation queue',
    status: 'active',
    waiting: 0,
    active: 1,
    delayed: 0,
    completed: 1245,
    failed: 3,
    avgDuration: 12,
    throughput: 103.75,
  },
  {
    id: 'queue-publish',
    name: 'publish',
    description: 'Content publish queue',
    status: 'active',
    waiting: 1,
    active: 0,
    delayed: 0,
    completed: 892,
    failed: 5,
    avgDuration: 8,
    throughput: 111.5,
  },
  {
    id: 'queue-reindex',
    name: 'reindex',
    description: 'Search reindex queue',
    status: 'active',
    waiting: 0,
    active: 0,
    delayed: 0,
    completed: 456,
    failed: 2,
    avgDuration: 120,
    throughput: 3.8,
  },
  {
    id: 'queue-ai-refresh',
    name: 'ai-refresh',
    description: 'AI model refresh queue',
    status: 'active',
    waiting: 0,
    active: 1,
    delayed: 0,
    completed: 234,
    failed: 1,
    avgDuration: 180,
    throughput: 1.3,
  },
  {
    id: 'queue-cache-purge',
    name: 'cache-purge',
    description: 'Cache purge queue',
    status: 'active',
    waiting: 2,
    active: 0,
    delayed: 0,
    completed: 1567,
    failed: 0,
    avgDuration: 3,
    throughput: 522.33,
  },
  {
    id: 'queue-notification',
    name: 'notification',
    description: 'Notification queue',
    status: 'active',
    waiting: 5,
    active: 2,
    delayed: 0,
    completed: 3421,
    failed: 8,
    avgDuration: 5,
    throughput: 684.2,
  },
  {
    id: 'queue-backup',
    name: 'backup',
    description: 'Backup queue',
    status: 'active',
    waiting: 0,
    active: 0,
    delayed: 0,
    completed: 52,
    failed: 0,
    avgDuration: 420,
    throughput: 0.12,
  },
];

const workers = [
  {
    id: 'worker-001',
    name: 'worker-1',
    status: 'active',
    queues: ['import', 'validation'],
    processedJobs: 2341,
    failedJobs: 5,
    avgProcessingTime: 28,
    uptime: '7d 14h 23m',
    lastJobAt: '2026-08-04T11:45:00Z',
  },
  {
    id: 'worker-002',
    name: 'worker-2',
    status: 'active',
    queues: ['publish', 'reindex'],
    processedJobs: 1892,
    failedJobs: 3,
    avgProcessingTime: 45,
    uptime: '7d 14h 23m',
    lastJobAt: '2026-08-04T11:44:30Z',
  },
  {
    id: 'worker-003',
    name: 'worker-3',
    status: 'active',
    queues: ['ai-refresh', 'cache-purge', 'notification'],
    processedJobs: 4521,
    failedJobs: 8,
    avgProcessingTime: 15,
    uptime: '7d 14h 23m',
    lastJobAt: '2026-08-04T11:45:15Z',
  },
  {
    id: 'worker-004',
    name: 'worker-4',
    status: 'idle',
    queues: ['backup'],
    processedJobs: 52,
    failedJobs: 0,
    avgProcessingTime: 420,
    uptime: '7d 14h 23m',
    lastJobAt: '2026-08-03T03:07:00Z',
  },
];

const recentJobs = [
  {
    id: 'job-001',
    queue: 'import',
    name: 'Import Characters',
    status: 'completed',
    startedAt: '2026-08-04T11:40:00Z',
    completedAt: '2026-08-04T11:40:45Z',
    duration: 45,
    attempts: 1,
  },
  {
    id: 'job-002',
    queue: 'validation',
    name: 'Validate Imported Data',
    status: 'completed',
    startedAt: '2026-08-04T11:40:45Z',
    completedAt: '2026-08-04T11:40:57Z',
    duration: 12,
    attempts: 1,
  },
  {
    id: 'job-003',
    queue: 'notification',
    name: 'Send Notification',
    status: 'active',
    startedAt: '2026-08-04T11:45:00Z',
    completedAt: null,
    duration: null,
    attempts: 1,
  },
  {
    id: 'job-004',
    queue: 'import',
    name: 'Import Weapons',
    status: 'failed',
    startedAt: '2026-08-04T11:30:00Z',
    completedAt: '2026-08-04T11:30:15Z',
    duration: 15,
    attempts: 3,
    error: 'Connection timeout',
  },
  {
    id: 'job-005',
    queue: 'ai-refresh',
    name: 'Refresh AI Models',
    status: 'active',
    startedAt: '2026-08-04T11:44:00Z',
    completedAt: null,
    duration: null,
    attempts: 1,
  },
];

export default function BackgroundJobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Background Jobs</h1>
        <p className="text-gray-600 mt-1">Monitor and manage BullMQ job queues</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Queues</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{queues.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active queues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Workers</CardTitle>
            <Server className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {workers.filter(w => w.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Processing jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Jobs in Queue</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {queues.reduce((sum, q) => sum + q.waiting + q.active + q.delayed, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Waiting, active, delayed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed Jobs</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {queues.reduce((sum, q) => sum + q.failed, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total failures</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="queues">
        <TabsList>
          <TabsTrigger value="queues">
            <Activity className="h-4 w-4 mr-2" />
            Queues ({queues.length})
          </TabsTrigger>
          <TabsTrigger value="workers">
            <Server className="h-4 w-4 mr-2" />
            Workers ({workers.length})
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <Zap className="h-4 w-4 mr-2" />
            Recent Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queues" className="space-y-4">
          {queues.map((queue) => (
            <Card key={queue.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{queue.name}</h3>
                      <Badge variant="success">{queue.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{queue.description}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Waiting</p>
                    <p className="text-2xl font-bold text-yellow-600">{queue.waiting}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Active</p>
                    <p className="text-2xl font-bold text-blue-600">{queue.active}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Delayed</p>
                    <p className="text-2xl font-bold text-purple-600">{queue.delayed}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{queue.completed}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{queue.failed}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Avg Duration</p>
                    <p className="text-2xl font-bold text-gray-600">{queue.avgDuration}s</p>
                  </div>
                </div>

                {/* Throughput */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Throughput</span>
                    <span className="text-sm text-gray-500">{queue.throughput} jobs/min</span>
                  </div>
                  <Progress value={Math.min(100, queue.throughput / 10)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="workers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((worker) => (
              <Card key={worker.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
                        <Badge variant={worker.status === 'active' ? 'success' : 'secondary'}>
                          {worker.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Uptime: {worker.uptime}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Queues</p>
                      <div className="flex flex-wrap gap-1">
                        {worker.queues.map((queue) => (
                          <Badge key={queue} variant="outline" className="text-xs">
                            {queue}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">Processed</p>
                        <p className="text-lg font-bold text-gray-900">{worker.processedJobs}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">Failed</p>
                        <p className="text-lg font-bold text-red-600">{worker.failedJobs}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">Avg Processing</p>
                        <p className="text-sm font-semibold text-gray-900">{worker.avgProcessingTime}s</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">Last Job</p>
                        <p className="text-xs text-gray-900">
                          {new Date(worker.lastJobAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{job.queue}</Badge>
                          <h4 className="font-semibold text-gray-900">{job.name}</h4>
                          <Badge variant={
                            job.status === 'completed' ? 'success' :
                            job.status === 'active' ? 'warning' :
                            job.status === 'failed' ? 'error' :
                            'secondary'
                          }>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Started: {new Date(job.startedAt).toLocaleString()}
                          </span>
                          {job.duration && (
                            <span className="flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              Duration: {job.duration}s
                            </span>
                          )}
                          <span>Attempts: {job.attempts}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {job.status === 'failed' && (
                          <>
                            <Button variant="outline" size="sm">
                              <RotateCw className="h-4 w-4 mr-1" />
                              Retry
                            </Button>
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-1" />
                              Requeue
                            </Button>
                          </>
                        )}
                        {job.status === 'active' && (
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                    {job.error && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-600">
                        Error: {job.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
