'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Play,
  RotateCw,
  Eye,
  Search,
  Brain,
  Trash2,
  Bell,
  Undo,
  FileText,
  GitBranch,
  Calendar
} from 'lucide-react';

// Mock data - will be replaced with API calls
const patches = [
  {
    id: 'patch-1.5.0',
    version: '1.5.0',
    title: 'Season 2 Update',
    status: 'in_review',
    currentStep: 'review',
    progress: 45,
    createdAt: '2026-08-04T10:00:00Z',
    updatedAt: '2026-08-04T11:30:00Z',
    createdBy: 'admin@drhub.com',
    steps: {
      import: { status: 'completed', timestamp: '2026-08-04T10:00:00Z', duration: 45 },
      validation: { status: 'completed', timestamp: '2026-08-04T10:05:00Z', duration: 12 },
      review: { status: 'in_progress', timestamp: '2026-08-04T10:10:00Z', duration: null },
      preview: { status: 'pending', timestamp: null, duration: null },
      publish: { status: 'pending', timestamp: null, duration: null },
      reindex: { status: 'pending', timestamp: null, duration: null },
      ai_refresh: { status: 'pending', timestamp: null, duration: null },
      cache_purge: { status: 'pending', timestamp: null, duration: null },
      notifications: { status: 'pending', timestamp: null, duration: null },
    },
    changes: {
      characters: 3,
      weapons: 5,
      artifacts: 2,
      materials: 8,
    },
    logs: [
      { timestamp: '2026-08-04T10:00:00Z', level: 'info', message: 'Import started', details: 'Fetching data from API...' },
      { timestamp: '2026-08-04T10:00:45Z', level: 'success', message: 'Import completed', details: 'Imported 18 entities' },
      { timestamp: '2026-08-04T10:05:00Z', level: 'success', message: 'Validation passed', details: '0 errors, 2 warnings' },
      { timestamp: '2026-08-04T10:10:00Z', level: 'info', message: 'Review started', details: 'Waiting for approval...' },
    ],
  },
  {
    id: 'patch-1.4.1',
    version: '1.4.1',
    title: 'Balance Patch',
    status: 'published',
    currentStep: 'completed',
    progress: 100,
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-01T10:30:00Z',
    createdBy: 'admin@drhub.com',
    steps: {
      import: { status: 'completed', timestamp: '2026-08-01T09:00:00Z', duration: 38 },
      validation: { status: 'completed', timestamp: '2026-08-01T09:05:00Z', duration: 8 },
      review: { status: 'completed', timestamp: '2026-08-01T09:15:00Z', duration: 25 },
      preview: { status: 'completed', timestamp: '2026-08-01T09:45:00Z', duration: 15 },
      publish: { status: 'completed', timestamp: '2026-08-01T10:00:00Z', duration: 5 },
      reindex: { status: 'completed', timestamp: '2026-08-01T10:05:00Z', duration: 12 },
      ai_refresh: { status: 'completed', timestamp: '2026-08-01T10:10:00Z', duration: 8 },
      cache_purge: { status: 'completed', timestamp: '2026-08-01T10:15:00Z', duration: 3 },
      notifications: { status: 'completed', timestamp: '2026-08-01T10:20:00Z', duration: 2 },
    },
    changes: {
      characters: 2,
      weapons: 3,
      artifacts: 1,
      materials: 4,
    },
    logs: [
      { timestamp: '2026-08-01T09:00:00Z', level: 'info', message: 'Import started', details: 'Fetching data from API...' },
      { timestamp: '2026-08-01T09:00:38Z', level: 'success', message: 'Import completed', details: 'Imported 10 entities' },
      { timestamp: '2026-08-01T09:05:00Z', level: 'success', message: 'Validation passed', details: '0 errors, 0 warnings' },
      { timestamp: '2026-08-01T09:15:00Z', level: 'success', message: 'Review approved', details: 'Approved by admin@drhub.com' },
      { timestamp: '2026-08-01T09:45:00Z', level: 'success', message: 'Preview generated', details: 'Preview available' },
      { timestamp: '2026-08-01T10:00:00Z', level: 'success', message: 'Published', details: 'Patch 1.4.1 published' },
      { timestamp: '2026-08-01T10:05:00Z', level: 'success', message: 'Search reindexed', details: 'Index updated' },
      { timestamp: '2026-08-01T10:10:00Z', level: 'success', message: 'AI refreshed', details: 'AI models updated' },
      { timestamp: '2026-08-01T10:15:00Z', level: 'success', message: 'Cache purged', details: 'Cache cleared' },
      { timestamp: '2026-08-01T10:20:00Z', level: 'success', message: 'Notifications sent', details: 'Users notified' },
    ],
  },
  {
    id: 'patch-1.4.0',
    version: '1.4.0',
    title: 'New Characters',
    status: 'published',
    currentStep: 'completed',
    progress: 100,
    createdAt: '2026-07-15T08:00:00Z',
    updatedAt: '2026-07-15T09:45:00Z',
    createdBy: 'admin@drhub.com',
    steps: {
      import: { status: 'completed', timestamp: '2026-07-15T08:00:00Z', duration: 52 },
      validation: { status: 'completed', timestamp: '2026-07-15T08:05:00Z', duration: 15 },
      review: { status: 'completed', timestamp: '2026-07-15T08:20:00Z', duration: 30 },
      preview: { status: 'completed', timestamp: '2026-07-15T08:50:00Z', duration: 20 },
      publish: { status: 'completed', timestamp: '2026-07-15T09:10:00Z', duration: 8 },
      reindex: { status: 'completed', timestamp: '2026-07-15T09:20:00Z', duration: 15 },
      ai_refresh: { status: 'completed', timestamp: '2026-07-15T09:30:00Z', duration: 10 },
      cache_purge: { status: 'completed', timestamp: '2026-07-15T09:35:00Z', duration: 4 },
      notifications: { status: 'completed', timestamp: '2026-07-15T09:40:00Z', duration: 3 },
    },
    changes: {
      characters: 5,
      weapons: 8,
      artifacts: 3,
      materials: 12,
    },
    logs: [
      { timestamp: '2026-07-15T08:00:00Z', level: 'info', message: 'Import started', details: 'Fetching data from API...' },
      { timestamp: '2026-07-15T08:00:52Z', level: 'success', message: 'Import completed', details: 'Imported 28 entities' },
      { timestamp: '2026-07-15T08:05:00Z', level: 'success', message: 'Validation passed', details: '0 errors, 1 warning' },
      { timestamp: '2026-07-15T08:20:00Z', level: 'success', message: 'Review approved', details: 'Approved by admin@drhub.com' },
      { timestamp: '2026-07-15T08:50:00Z', level: 'success', message: 'Preview generated', details: 'Preview available' },
      { timestamp: '2026-07-15T09:10:00Z', level: 'success', message: 'Published', details: 'Patch 1.4.0 published' },
      { timestamp: '2026-07-15T09:20:00Z', level: 'success', message: 'Search reindexed', details: 'Index updated' },
      { timestamp: '2026-07-15T09:30:00Z', level: 'success', message: 'AI refreshed', details: 'AI models updated' },
      { timestamp: '2026-07-15T09:35:00Z', level: 'success', message: 'Cache purged', details: 'Cache cleared' },
      { timestamp: '2026-07-15T09:40:00Z', level: 'success', message: 'Notifications sent', details: 'Users notified' },
    ],
  },
];

const workflowSteps = [
  { id: 'import', name: 'Import', icon: Download, description: 'Import data from source' },
  { id: 'validation', name: 'Validation', icon: CheckCircle, description: 'Validate imported data' },
  { id: 'review', name: 'Review', icon: Eye, description: 'Review changes' },
  { id: 'preview', name: 'Preview', icon: Eye, description: 'Preview changes' },
  { id: 'publish', name: 'Publish', icon: Play, description: 'Publish patch' },
  { id: 'reindex', name: 'Reindex', icon: Search, description: 'Reindex search' },
  { id: 'ai_refresh', name: 'AI Refresh', icon: Brain, description: 'Refresh AI models' },
  { id: 'cache_purge', name: 'Cache Purge', icon: Trash2, description: 'Purge cache' },
  { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Send notifications' },
];

export default function PatchManagerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patch Manager</h1>
        <p className="text-gray-600 mt-1">Manage game patches and updates</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Patches</CardTitle>
            <GitBranch className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{patches.length}</div>
            <p className="text-xs text-gray-500 mt-1">All patches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {patches.filter(p => p.status === 'in_review' || p.status === 'in_progress').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active patches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {patches.filter(p => p.status === 'published').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Successfully published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {patches.filter(p => p.status === 'failed').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Failed patches</p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Patch Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Create New Patch</h3>
              <p className="text-sm text-gray-600 mt-1">Start a new patch release workflow</p>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Create Patch
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patches List */}
      <Card>
        <CardHeader>
          <CardTitle>Patches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {patches.map((patch) => (
              <div key={patch.id} className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Patch {patch.version}
                      </h3>
                      <Badge variant={
                        patch.status === 'published' ? 'success' :
                        patch.status === 'in_review' || patch.status === 'in_progress' ? 'warning' :
                        patch.status === 'failed' ? 'error' : 'secondary'
                      }>
                        {patch.status === 'published' ? 'Published' :
                         patch.status === 'in_review' ? 'In Review' :
                         patch.status === 'in_progress' ? 'In Progress' :
                         patch.status === 'failed' ? 'Failed' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{patch.title}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created: {new Date(patch.createdAt).toLocaleString()}
                      </span>
                      <span>
                        Created by: {patch.createdBy}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {patch.status === 'published' && (
                      <Button variant="outline" size="sm">
                        <Undo className="h-4 w-4 mr-1" />
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{patch.progress}%</span>
                  </div>
                  <Progress value={patch.progress} />
                </div>

                {/* Changes Summary */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Characters</p>
                    <p className="text-2xl font-bold text-blue-600">{patch.changes.characters}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Weapons</p>
                    <p className="text-2xl font-bold text-purple-600">{patch.changes.weapons}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Artifacts</p>
                    <p className="text-2xl font-bold text-green-600">{patch.changes.artifacts}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Materials</p>
                    <p className="text-2xl font-bold text-yellow-600">{patch.changes.materials}</p>
                  </div>
                </div>

                {/* Workflow Steps */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Workflow Steps</h4>
                  <div className="grid grid-cols-9 gap-2">
                    {workflowSteps.map((step, index) => {
                      const stepStatus = patch.steps[step.id as keyof typeof patch.steps];
                      const Icon = step.icon;
                      const isCurrentStep = patch.currentStep === step.id;
                      
                      return (
                        <div
                          key={step.id}
                          className={`p-3 rounded-lg border-2 ${
                            stepStatus.status === 'completed' ? 'border-green-500 bg-green-50' :
                            stepStatus.status === 'in_progress' ? 'border-yellow-500 bg-yellow-50' :
                            stepStatus.status === 'failed' ? 'border-red-500 bg-red-50' :
                            'border-gray-200 bg-gray-50'
                          } ${isCurrentStep ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <Icon className={`h-5 w-5 mb-1 ${
                              stepStatus.status === 'completed' ? 'text-green-600' :
                              stepStatus.status === 'in_progress' ? 'text-yellow-600' :
                              stepStatus.status === 'failed' ? 'text-red-600' :
                              'text-gray-400'
                            }`} />
                            <p className="text-xs font-medium text-gray-700">{step.name}</p>
                            {stepStatus.duration && (
                              <p className="text-xs text-gray-500 mt-1">{stepStatus.duration}s</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Logs */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Logs</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {patch.logs.slice(-5).reverse().map((log, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded text-xs">
                        <div className="flex-shrink-0">
                          {log.level === 'info' && <Clock className="h-4 w-4 text-blue-500" />}
                          {log.level === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {log.level === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                          {log.level === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{log.message}</p>
                          <p className="text-gray-500">{log.details}</p>
                          <p className="text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
