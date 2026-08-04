'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Progress } from '@/components/ui/Progress';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Eye,
  RotateCw,
  TrendingUp,
  Timer,
  CalendarDays,
  List
} from 'lucide-react';

// Mock data - will be replaced with API calls
const scheduledWorkflows = [
  {
    id: 'workflow-001',
    name: 'Daily Import & Publish',
    description: 'Automated daily import and publish workflow',
    status: 'active',
    schedule: '0 2 * * *', // Daily at 2:00 AM
    scheduleType: 'cron',
    lastRun: '2026-08-04T02:00:00Z',
    nextRun: '2026-08-05T02:00:00Z',
    successRate: 98.5,
    avgDuration: 180,
    totalRuns: 120,
    failedRuns: 2,
    tasks: [
      { id: 'task-1', name: 'Import', type: 'import', delay: 0, status: 'completed' },
      { id: 'task-2', name: 'Validation', type: 'validation', delay: 5, status: 'completed' },
      { id: 'task-3', name: 'Review', type: 'review', delay: 10, status: 'completed' },
      { id: 'task-4', name: 'Publish', type: 'publish', delay: 420, status: 'completed' },
      { id: 'task-5', name: 'Reindex', type: 'reindex', delay: 1, status: 'completed' },
      { id: 'task-6', name: 'AI Refresh', type: 'ai_refresh', delay: 1, status: 'completed' },
      { id: 'task-7', name: 'Cache Purge', type: 'cache_purge', delay: 1, status: 'completed' },
    ],
    retryPolicy: {
      maxRetries: 3,
      retryDelay: 300,
      exponentialBackoff: true,
    },
    failureHandling: 'retry',
    createdBy: 'admin@drhub.com',
    createdAt: '2026-07-01T10:00:00Z',
  },
  {
    id: 'workflow-002',
    name: 'Weekly Backup',
    description: 'Weekly database and media backup',
    status: 'active',
    schedule: '0 3 * * 0', // Weekly on Sunday at 3:00 AM
    scheduleType: 'cron',
    lastRun: '2026-08-03T03:00:00Z',
    nextRun: '2026-08-10T03:00:00Z',
    successRate: 100,
    avgDuration: 420,
    totalRuns: 52,
    failedRuns: 0,
    tasks: [
      { id: 'task-1', name: 'Database Backup', type: 'backup', delay: 0, status: 'completed' },
      { id: 'task-2', name: 'Media Backup', type: 'backup', delay: 5, status: 'completed' },
      { id: 'task-3', name: 'Verification', type: 'validation', delay: 10, status: 'completed' },
    ],
    retryPolicy: {
      maxRetries: 2,
      retryDelay: 600,
      exponentialBackoff: false,
    },
    failureHandling: 'notify',
    createdBy: 'admin@drhub.com',
    createdAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'workflow-003',
    name: 'Monthly Cleanup',
    description: 'Monthly cleanup of old logs and temporary files',
    status: 'paused',
    schedule: '0 4 1 * *', // Monthly on 1st at 4:00 AM
    scheduleType: 'cron',
    lastRun: '2026-08-01T04:00:00Z',
    nextRun: '2026-09-01T04:00:00Z',
    successRate: 95.0,
    avgDuration: 300,
    totalRuns: 20,
    failedRuns: 1,
    tasks: [
      { id: 'task-1', name: 'Log Cleanup', type: 'cleanup', delay: 0, status: 'completed' },
      { id: 'task-2', name: 'Temp Files Cleanup', type: 'cleanup', delay: 5, status: 'completed' },
      { id: 'task-3', name: 'Cache Cleanup', type: 'cache_purge', delay: 10, status: 'completed' },
    ],
    retryPolicy: {
      maxRetries: 1,
      retryDelay: 300,
      exponentialBackoff: false,
    },
    failureHandling: 'skip',
    createdBy: 'admin@drhub.com',
    createdAt: '2026-05-01T10:00:00Z',
  },
];

const runHistory = [
  {
    id: 'run-001',
    workflowId: 'workflow-001',
    workflowName: 'Daily Import & Publish',
    startedAt: '2026-08-04T02:00:00Z',
    completedAt: '2026-08-04T02:03:00Z',
    duration: 180,
    status: 'success',
    tasksCompleted: 7,
    tasksFailed: 0,
  },
  {
    id: 'run-002',
    workflowId: 'workflow-002',
    workflowName: 'Weekly Backup',
    startedAt: '2026-08-03T03:00:00Z',
    completedAt: '2026-08-03T03:07:00Z',
    duration: 420,
    status: 'success',
    tasksCompleted: 3,
    tasksFailed: 0,
  },
  {
    id: 'run-003',
    workflowId: 'workflow-001',
    workflowName: 'Daily Import & Publish',
    startedAt: '2026-08-03T02:00:00Z',
    completedAt: '2026-08-03T02:02:30Z',
    duration: 150,
    status: 'success',
    tasksCompleted: 7,
    tasksFailed: 0,
  },
  {
    id: 'run-004',
    workflowId: 'workflow-003',
    workflowName: 'Monthly Cleanup',
    startedAt: '2026-08-01T04:00:00Z',
    completedAt: '2026-08-01T04:05:00Z',
    duration: 300,
    status: 'failed',
    tasksCompleted: 2,
    tasksFailed: 1,
  },
];

export default function SchedulerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Scheduler</h1>
        <p className="text-gray-600 mt-1">Manage automated workflows and scheduled tasks</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Workflows</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {scheduledWorkflows.filter(w => w.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Running workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {(scheduledWorkflows.reduce((sum, w) => sum + w.successRate, 0) / scheduledWorkflows.length).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Average success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Runs</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {scheduledWorkflows.reduce((sum, w) => sum + w.totalRuns, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total executions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed Runs</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {scheduledWorkflows.reduce((sum, w) => sum + w.failedRuns, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Failed executions</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Workflow Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Create New Workflow</h3>
              <p className="text-sm text-gray-600 mt-1">Define automated workflows with cron schedules</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="workflows">
        <TabsList>
          <TabsTrigger value="workflows">
            <List className="h-4 w-4 mr-2" />
            Workflows ({scheduledWorkflows.length})
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {scheduledWorkflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                      <Badge variant={
                        workflow.status === 'active' ? 'success' :
                        workflow.status === 'paused' ? 'warning' :
                        'secondary'
                      }>
                        {workflow.status === 'active' ? 'Active' :
                         workflow.status === 'paused' ? 'Paused' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        Schedule: {workflow.schedule}
                      </span>
                      <span>
                        Last run: {new Date(workflow.lastRun).toLocaleString()}
                      </span>
                      <span>
                        Next run: {new Date(workflow.nextRun).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Run Now
                    </Button>
                    {workflow.status === 'active' ? (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">{workflow.successRate}%</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Avg Duration</p>
                    <p className="text-2xl font-bold text-blue-600">{workflow.avgDuration}s</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Runs</p>
                    <p className="text-2xl font-bold text-purple-600">{workflow.totalRuns}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Failed Runs</p>
                    <p className="text-2xl font-bold text-red-600">{workflow.failedRuns}</p>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Workflow Tasks</h4>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {workflow.tasks.map((task, index) => (
                      <div key={task.id} className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg border-2 ${
                          task.status === 'completed' ? 'border-green-500 bg-green-50' :
                          task.status === 'running' ? 'border-yellow-500 bg-yellow-50' :
                          task.status === 'failed' ? 'border-red-500 bg-red-50' :
                          'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex flex-col items-center text-center">
                            <div className="text-xs font-medium text-gray-700">{task.name}</div>
                            <div className="text-xs text-gray-500">+{task.delay}min</div>
                          </div>
                        </div>
                        {index < workflow.tasks.length - 1 && (
                          <div className="text-gray-400">→</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar View</h3>
                <p className="text-sm text-gray-600">
                  Visual calendar showing scheduled workflows, imports, publishes, backups, and maintenance windows
                </p>
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Calendar features:</p>
                  <ul className="text-sm text-gray-600 text-left list-disc list-inside">
                    <li>Weekly and monthly view modes</li>
                    <li>Color-coded events by type</li>
                    <li>Click to view workflow details</li>
                    <li>Drag to reschedule (future feature)</li>
                    <li>Export to iCal (future feature)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Run History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {runHistory.map((run) => (
                  <div key={run.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{run.workflowName}</h4>
                          <Badge variant={
                            run.status === 'success' ? 'success' :
                            run.status === 'failed' ? 'error' :
                            'warning'
                          }>
                            {run.status === 'success' ? 'Success' :
                             run.status === 'failed' ? 'Failed' : 'Running'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Started: {new Date(run.startedAt).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            Duration: {run.duration}s
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Logs
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Tasks completed: {run.tasksCompleted}</span>
                      <span>Tasks failed: {run.tasksFailed}</span>
                    </div>
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
