'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Input } from '@/components/ui/Input';
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Play,
  Pause,
  RotateCw,
  FileText,
  Search,
  Brain,
  Trash2,
  Bell,
  Tag,
  Shield,
  CheckSquare
} from 'lucide-react';

interface ReleaseStep {
  id: string;
  name: string;
  status: string;
  duration: number | null;
  error?: string;
}

interface Release {
  id: string;
  version: string;
  name: string;
  status: string;
  currentStep: string;
  progress: number;
  createdAt: string;
  createdBy: string;
  completedAt?: string;
  failedAt?: string;
  steps: ReleaseStep[];
  changes: {
    characters: number;
    weapons: number;
    artifacts: number;
    materials: number;
    builds: number;
  };
}

// Mock data - will be replaced with API calls
const releases: Release[] = [
  {
    id: 'release-1.5.0',
    version: '1.5.0',
    name: 'Season 2 Launch',
    status: 'in_progress',
    currentStep: 'review',
    progress: 45,
    createdAt: '2026-08-04T10:00:00Z',
    createdBy: 'admin@drhub.com',
    steps: [
      { id: 'validation', name: 'Validation', status: 'completed', duration: 12 },
      { id: 'tests', name: 'Tests', status: 'completed', duration: 45 },
      { id: 'review', name: 'Review', status: 'in_progress', duration: null },
      { id: 'publish', name: 'Publish', status: 'pending', duration: null },
      { id: 'search_index', name: 'Search Index', status: 'pending', duration: null },
      { id: 'ai_refresh', name: 'AI Refresh', status: 'pending', duration: null },
      { id: 'notification', name: 'Notification', status: 'pending', duration: null },
      { id: 'audit', name: 'Audit', status: 'pending', duration: null },
      { id: 'tag_release', name: 'Tag Release', status: 'pending', duration: null },
    ],
    changes: {
      characters: 3,
      weapons: 5,
      artifacts: 2,
      materials: 8,
      builds: 12,
    },
  },
  {
    id: 'release-1.4.1',
    version: '1.4.1',
    name: 'Balance Patch',
    status: 'completed',
    currentStep: 'completed',
    progress: 100,
    createdAt: '2026-08-01T09:00:00Z',
    createdBy: 'admin@drhub.com',
    completedAt: '2026-08-01T10:30:00Z',
    steps: [
      { id: 'validation', name: 'Validation', status: 'completed', duration: 8 },
      { id: 'tests', name: 'Tests', status: 'completed', duration: 35 },
      { id: 'review', name: 'Review', status: 'completed', duration: 25 },
      { id: 'publish', name: 'Publish', status: 'completed', duration: 5 },
      { id: 'search_index', name: 'Search Index', status: 'completed', duration: 12 },
      { id: 'ai_refresh', name: 'AI Refresh', status: 'completed', duration: 8 },
      { id: 'notification', name: 'Notification', status: 'completed', duration: 3 },
      { id: 'audit', name: 'Audit', status: 'completed', duration: 2 },
      { id: 'tag_release', name: 'Tag Release', status: 'completed', duration: 1 },
    ],
    changes: {
      characters: 2,
      weapons: 3,
      artifacts: 1,
      materials: 4,
      builds: 8,
    },
  },
  {
    id: 'release-1.4.0',
    version: '1.4.0',
    name: 'New Characters',
    status: 'failed',
    currentStep: 'tests',
    progress: 33,
    createdAt: '2026-07-15T08:00:00Z',
    createdBy: 'admin@drhub.com',
    failedAt: '2026-07-15T08:45:00Z',
    steps: [
      { id: 'validation', name: 'Validation', status: 'completed', duration: 15 },
      { id: 'tests', name: 'Tests', status: 'failed', duration: 45, error: '3 test failures' },
      { id: 'review', name: 'Review', status: 'pending', duration: null },
      { id: 'publish', name: 'Publish', status: 'pending', duration: null },
      { id: 'search_index', name: 'Search Index', status: 'pending', duration: null },
      { id: 'ai_refresh', name: 'AI Refresh', status: 'pending', duration: null },
      { id: 'notification', name: 'Notification', status: 'pending', duration: null },
      { id: 'audit', name: 'Audit', status: 'pending', duration: null },
      { id: 'tag_release', name: 'Tag Release', status: 'pending', duration: null },
    ],
    changes: {
      characters: 5,
      weapons: 8,
      artifacts: 3,
      materials: 12,
      builds: 15,
    },
  },
];

export default function ReleaseManagerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Release Manager</h1>
        <p className="text-gray-600 mt-1">Orchestrate complete release workflows</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Releases</CardTitle>
            <Rocket className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{releases.length}</div>
            <p className="text-xs text-gray-500 mt-1">All releases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {releases.filter(r => r.status === 'completed').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Successful releases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {releases.filter(r => r.status === 'in_progress').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active releases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {releases.filter(r => r.status === 'failed').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Failed releases</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Release Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Create New Release</h3>
              <p className="text-sm text-gray-600 mt-1">
                Start a new release with automated 9-step workflow
              </p>
            </div>
            <Button>
              <Rocket className="h-4 w-4 mr-2" />
              Create Release
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Releases List */}
      <Card>
        <CardHeader>
          <CardTitle>Releases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {releases.map((release) => (
              <div key={release.id} className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Release {release.version}
                      </h3>
                      <Badge variant={
                        release.status === 'completed' ? 'success' :
                        release.status === 'in_progress' ? 'warning' :
                        release.status === 'failed' ? 'error' :
                        'secondary'
                      }>
                        {release.status === 'completed' ? 'Completed' :
                         release.status === 'in_progress' ? 'In Progress' :
                         release.status === 'failed' ? 'Failed' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{release.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Created: {new Date(release.createdAt).toLocaleString()}</span>
                      <span>By: {release.createdBy}</span>
                      {release.completedAt && (
                        <span>Completed: {new Date(release.completedAt).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {release.status === 'failed' && (
                      <Button variant="outline" size="sm">
                        <RotateCw className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{release.progress}%</span>
                  </div>
                  <Progress value={release.progress} />
                </div>

                {/* Changes Summary */}
                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Characters</p>
                    <p className="text-2xl font-bold text-blue-600">{release.changes.characters}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Weapons</p>
                    <p className="text-2xl font-bold text-purple-600">{release.changes.weapons}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Artifacts</p>
                    <p className="text-2xl font-bold text-green-600">{release.changes.artifacts}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Materials</p>
                    <p className="text-2xl font-bold text-yellow-600">{release.changes.materials}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Builds</p>
                    <p className="text-2xl font-bold text-orange-600">{release.changes.builds}</p>
                  </div>
                </div>

                {/* Workflow Steps */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Release Workflow</h4>
                  <div className="grid grid-cols-9 gap-2">
                    {release.steps.map((step, index) => {
                      const isCurrentStep = release.currentStep === step.id;
                      const StepIcon = 
                        step.id === 'validation' ? Shield :
                        step.id === 'tests' ? CheckSquare :
                        step.id === 'review' ? FileText :
                        step.id === 'publish' ? Rocket :
                        step.id === 'search_index' ? Search :
                        step.id === 'ai_refresh' ? Brain :
                        step.id === 'notification' ? Bell :
                        step.id === 'audit' ? FileText :
                        Tag;

                      return (
                        <div
                          key={step.id}
                          className={`p-2 rounded-lg border-2 ${
                            step.status === 'completed' ? 'border-green-500 bg-green-50' :
                            step.status === 'in_progress' ? 'border-yellow-500 bg-yellow-50' :
                            step.status === 'failed' ? 'border-red-500 bg-red-50' :
                            'border-gray-200 bg-gray-50'
                          } ${isCurrentStep ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <StepIcon className={`h-5 w-5 mb-1 ${
                              step.status === 'completed' ? 'text-green-600' :
                              step.status === 'in_progress' ? 'text-yellow-600' :
                              step.status === 'failed' ? 'text-red-600' :
                              'text-gray-400'
                            }`} />
                            <p className="text-xs font-medium text-gray-700">{step.name}</p>
                            {step.duration && (
                              <p className="text-xs text-gray-500 mt-1">{step.duration}s</p>
                            )}
                            {step.error && (
                              <p className="text-xs text-red-600 mt-1">{step.error}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
