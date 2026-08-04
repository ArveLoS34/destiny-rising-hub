'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  Server,
  Search,
  HardDrive,
  Cpu,
  Zap,
  Clock
} from 'lucide-react';

// Mock data - will be replaced with API calls
const systemMetrics = {
  postgresql: {
    status: 'healthy',
    connections: 45,
    maxConnections: 100,
    queriesPerSecond: 892,
    avgQueryTime: 12,
    cacheHitRatio: 94.5,
    replicationLag: 0.5,
    uptime: '45d 12h 34m',
    lastBackup: '2026-08-04T03:00:00Z',
  },
  redis: {
    status: 'healthy',
    memoryUsed: 512,
    memoryTotal: 2048,
    connectedClients: 128,
    commandsPerSecond: 12450,
    hitRate: 98.2,
    keyspaceHits: 1245000,
    keyspaceMisses: 22500,
    uptime: '45d 12h 34m',
  },
  search: {
    status: 'healthy',
    documentsIndexed: 45234,
    queriesPerSecond: 234,
    avgQueryTime: 45,
    indexSize: 2.4,
    cacheSize: 512,
    cacheHitRate: 87.3,
    uptime: '45d 12h 34m',
  },
  queue: {
    status: 'healthy',
    totalQueues: 8,
    waitingJobs: 11,
    activeJobs: 5,
    delayedJobs: 0,
    completedJobs: 8902,
    failedJobs: 31,
    processingRate: 1456,
    avgProcessingTime: 28,
    uptime: '45d 12h 34m',
  },
  storage: {
    status: 'healthy',
    totalSpace: 100,
    usedSpace: 24.5,
    freeSpace: 75.5,
    readRate: 234,
    writeRate: 123,
    iops: 357,
    uptime: '45d 12h 34m',
  },
  api: {
    status: 'healthy',
    requestsPerSecond: 1245,
    avgResponseTime: 145,
    errorRate: 0.5,
    activeConnections: 456,
    uptime: '45d 12h 34m',
    lastDeploy: '2026-08-03T14:30:00Z',
  },
  workers: {
    status: 'healthy',
    totalWorkers: 4,
    activeWorkers: 3,
    idleWorkers: 1,
    cpuUsage: 45,
    memoryUsage: 62,
    uptime: '45d 12h 34m',
  },
  cache: {
    status: 'healthy',
    hitRate: 94.2,
    missRate: 5.8,
    entries: 12456,
    memoryUsed: 256,
    evictionRate: 12,
    uptime: '45d 12h 34m',
  },
};

const alerts = [
  {
    id: 'alert-001',
    severity: 'warning',
    component: 'PostgreSQL',
    message: 'Connection count approaching limit (45/100)',
    timestamp: '2026-08-04T11:30:00Z',
  },
  {
    id: 'alert-002',
    severity: 'info',
    component: 'API',
    message: 'Response time increased by 15% in last hour',
    timestamp: '2026-08-04T11:15:00Z',
  },
  {
    id: 'alert-003',
    severity: 'success',
    component: 'Backup',
    message: 'Daily backup completed successfully',
    timestamp: '2026-08-04T03:00:00Z',
  },
];

export default function SystemMonitorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Monitor</h1>
        <p className="text-gray-600 mt-1">Real-time system health and performance metrics</p>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Overall System Status
            <Badge variant="success">Healthy</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">8/8</div>
              <p className="text-xs text-gray-600 mt-1">Components Healthy</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">99.9%</div>
              <p className="text-xs text-gray-600 mt-1">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">145ms</div>
              <p className="text-xs text-gray-600 mt-1">Avg Response</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">0.5%</div>
              <p className="text-xs text-gray-600 mt-1">Error Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PostgreSQL */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              PostgreSQL
              <Badge variant="success">{systemMetrics.postgresql.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Connections</span>
                  <span className="text-sm font-medium">{systemMetrics.postgresql.connections} / {systemMetrics.postgresql.maxConnections}</span>
                </div>
                <Progress value={(systemMetrics.postgresql.connections / systemMetrics.postgresql.maxConnections) * 100} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Queries/sec</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.postgresql.queriesPerSecond}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Avg Query Time</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.postgresql.avgQueryTime}ms</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Cache Hit Ratio</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.postgresql.cacheHitRatio}%</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Replication Lag</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.postgresql.replicationLag}s</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Uptime: {systemMetrics.postgresql.uptime}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redis */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              Redis
              <Badge variant="success">{systemMetrics.redis.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Memory Usage</span>
                  <span className="text-sm font-medium">{systemMetrics.redis.memoryUsed} MB / {systemMetrics.redis.memoryTotal} MB</span>
                </div>
                <Progress value={(systemMetrics.redis.memoryUsed / systemMetrics.redis.memoryTotal) * 100} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Commands/sec</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.redis.commandsPerSecond}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Hit Rate</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.redis.hitRate}%</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Connected Clients</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.redis.connectedClients}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Keyspace Hits</p>
                  <p className="text-lg font-bold text-gray-900">{(systemMetrics.redis.keyspaceHits / 1000).toFixed(0)}K</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Uptime: {systemMetrics.redis.uptime}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-500" />
              Search Engine
              <Badge variant="success">{systemMetrics.search.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Documents Indexed</p>
                  <p className="text-lg font-bold text-gray-900">{(systemMetrics.search.documentsIndexed / 1000).toFixed(1)}K</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Queries/sec</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.search.queriesPerSecond}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Avg Query Time</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.search.avgQueryTime}ms</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Cache Hit Rate</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.search.cacheHitRate}%</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Index Size: {systemMetrics.search.indexSize} GB | Cache: {systemMetrics.search.cacheSize} MB
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-yellow-500" />
              Job Queue
              <Badge variant="success">{systemMetrics.queue.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Total Queues</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.queue.totalQueues}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Processing Rate</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.queue.processingRate}/min</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Active Jobs</p>
                  <p className="text-lg font-bold text-blue-600">{systemMetrics.queue.activeJobs}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Failed Jobs</p>
                  <p className="text-lg font-bold text-red-600">{systemMetrics.queue.failedJobs}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Completed: {systemMetrics.queue.completedJobs} | Avg Processing: {systemMetrics.queue.avgProcessingTime}s
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-green-500" />
              Storage
              <Badge variant="success">{systemMetrics.storage.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Disk Usage</span>
                  <span className="text-sm font-medium">{systemMetrics.storage.usedSpace} GB / {systemMetrics.storage.totalSpace} GB</span>
                </div>
                <Progress value={(systemMetrics.storage.usedSpace / systemMetrics.storage.totalSpace) * 100} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Read Rate</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.storage.readRate} MB/s</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Write Rate</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.storage.writeRate} MB/s</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">IOPS</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.storage.iops}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              API
              <Badge variant="success">{systemMetrics.api.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Requests/sec</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.api.requestsPerSecond}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Avg Response</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.api.avgResponseTime}ms</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Error Rate</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.api.errorRate}%</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Active Connections</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.api.activeConnections}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Last Deploy: {new Date(systemMetrics.api.lastDeploy).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-500" />
              Workers
              <Badge variant="success">{systemMetrics.workers.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <span className="text-sm font-medium">{systemMetrics.workers.cpuUsage}%</span>
                </div>
                <Progress value={systemMetrics.workers.cpuUsage} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Memory Usage</span>
                  <span className="text-sm font-medium">{systemMetrics.workers.memoryUsage}%</span>
                </div>
                <Progress value={systemMetrics.workers.memoryUsage} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Total Workers</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.workers.totalWorkers}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Active / Idle</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.workers.activeWorkers} / {systemMetrics.workers.idleWorkers}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cache */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Cache
              <Badge variant="success">{systemMetrics.cache.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Hit Rate</p>
                  <p className="text-lg font-bold text-green-600">{systemMetrics.cache.hitRate}%</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Miss Rate</p>
                  <p className="text-lg font-bold text-red-600">{systemMetrics.cache.missRate}%</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Entries</p>
                  <p className="text-lg font-bold text-gray-900">{(systemMetrics.cache.entries / 1000).toFixed(1)}K</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Memory Used</p>
                  <p className="text-lg font-bold text-gray-900">{systemMetrics.cache.memoryUsed} MB</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Eviction Rate: {systemMetrics.cache.evictionRate}/min
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  {alert.severity === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                  {alert.severity === 'info' && <Clock className="h-5 w-5 text-blue-500" />}
                  {alert.severity === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={
                      alert.severity === 'warning' ? 'warning' :
                      alert.severity === 'info' ? 'default' :
                      'success'
                    }>
                      {alert.component}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
