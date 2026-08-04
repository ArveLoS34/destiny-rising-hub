'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { 
  Download, 
  Play, 
  RotateCw, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  AlertCircle,
  FileText,
  Calendar,
  Activity
} from 'lucide-react';

// Mock data - will be replaced with API calls
const importers = [
  {
    id: 'character-importer',
    name: 'Character Importer',
    description: 'Imports character data from official game API',
    status: 'idle',
    lastRun: '2026-08-04T10:30:00Z',
    nextRun: '2026-08-04T22:30:00Z',
    successRate: 98.5,
    totalRuns: 245,
    successfulRuns: 241,
    failedRuns: 4,
    processedRecords: 12450,
    errorCount: 12,
    averageDuration: 45,
  },
  {
    id: 'weapon-importer',
    name: 'Weapon Importer',
    description: 'Imports weapon data from official game API',
    status: 'running',
    lastRun: '2026-08-04T11:00:00Z',
    nextRun: '2026-08-04T23:00:00Z',
    successRate: 99.2,
    totalRuns: 245,
    successfulRuns: 243,
    failedRuns: 2,
    processedRecords: 8920,
    errorCount: 8,
    averageDuration: 32,
  },
  {
    id: 'material-importer',
    name: 'Material Importer',
    description: 'Imports material data from official game API',
    status: 'idle',
    lastRun: '2026-08-04T09:00:00Z',
    nextRun: '2026-08-04T21:00:00Z',
    successRate: 100,
    totalRuns: 245,
    successfulRuns: 245,
    failedRuns: 0,
    processedRecords: 15680,
    errorCount: 0,
    averageDuration: 28,
  },
  {
    id: 'artifact-importer',
    name: 'Artifact Importer',
    description: 'Imports artifact data from official game API',
    status: 'failed',
    lastRun: '2026-08-04T08:30:00Z',
    nextRun: '2026-08-04T20:30:00Z',
    successRate: 95.8,
    totalRuns: 245,
    successfulRuns: 235,
    failedRuns: 10,
    processedRecords: 6540,
    errorCount: 45,
    averageDuration: 38,
  },
  {
    id: 'build-importer',
    name: 'Build Importer',
    description: 'Imports community builds from external sources',
    status: 'idle',
    lastRun: '2026-08-04T07:00:00Z',
    nextRun: '2026-08-04T19:00:00Z',
    successRate: 97.3,
    totalRuns: 180,
    successfulRuns: 175,
    failedRuns: 5,
    processedRecords: 3420,
    errorCount: 18,
    averageDuration: 52,
  },
];

const recentLogs = [
  {
    id: 1,
    importer: 'character-importer',
    timestamp: '2026-08-04T10:30:15Z',
    level: 'info',
    message: 'Import completed successfully',
    details: 'Processed 45 characters, 0 errors',
  },
  {
    id: 2,
    importer: 'weapon-importer',
    timestamp: '2026-08-04T11:00:22Z',
    level: 'info',
    message: 'Import started',
    details: 'Fetching data from API...',
  },
  {
    id: 3,
    importer: 'artifact-importer',
    timestamp: '2026-08-04T08:30:45Z',
    level: 'error',
    message: 'Import failed',
    details: 'Connection timeout after 30s',
  },
  {
    id: 4,
    importer: 'material-importer',
    timestamp: '2026-08-04T09:00:10Z',
    level: 'info',
    message: 'Import completed successfully',
    details: 'Processed 128 materials, 0 errors',
  },
  {
    id: 5,
    importer: 'build-importer',
    timestamp: '2026-08-04T07:00:33Z',
    level: 'warning',
    message: 'Import completed with warnings',
    details: 'Processed 23 builds, 3 warnings',
  },
];

export default function ImportCenterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Center</h1>
        <p className="text-gray-600 mt-1">Manage data imports from external sources</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Importers</CardTitle>
            <Download className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{importers.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active importers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {(importers.reduce((sum, imp) => sum + imp.successRate, 0) / importers.length).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Average success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {importers.reduce((sum, imp) => sum + imp.processedRecords, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Records processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {importers.reduce((sum, imp) => sum + imp.errorCount, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Errors in last 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Importers List */}
      <Card>
        <CardHeader>
          <CardTitle>Importers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {importers.map((importer) => (
              <div key={importer.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{importer.name}</h3>
                      {importer.status === 'running' && (
                        <Badge variant="secondary" className="gap-1">
                          <Activity className="h-3 w-3 animate-pulse" />
                          Running
                        </Badge>
                      )}
                      {importer.status === 'idle' && (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Idle
                        </Badge>
                      )}
                      {importer.status === 'failed' && (
                        <Badge variant="error" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Failed
                        </Badge>
                      )}
                      {importer.status === 'completed' && (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{importer.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={importer.status === 'running'}>
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Dry Run
                    </Button>
                    {importer.status === 'failed' && (
                      <Button variant="outline" size="sm">
                        <RotateCw className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Run</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(importer.lastRun).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Next Run</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(importer.nextRun).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Success Rate</p>
                    <div className="flex items-center gap-2">
                      <Progress value={importer.successRate} className="flex-1" />
                      <span className="text-sm font-medium text-gray-900">{importer.successRate}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Records / Errors</p>
                    <p className="text-sm font-medium text-gray-900">
                      {importer.processedRecords.toLocaleString()} / {importer.errorCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Total Runs: {importer.totalRuns}</span>
                  <span>Successful: {importer.successfulRuns}</span>
                  <span>Failed: {importer.failedRuns}</span>
                  <span>Avg Duration: {importer.averageDuration}s</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                <div className="flex-shrink-0">
                  {log.level === 'info' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {log.level === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                  {log.level === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {importers.find(i => i.id === log.importer)?.name}
                    </span>
                    <Badge variant={
                      log.level === 'info' ? 'success' : 
                      log.level === 'warning' ? 'warning' : 'error'
                    }>
                      {log.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{log.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
