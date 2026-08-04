'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Play,
  Pause,
  Archive,
  Trash2,
  CheckSquare,
  FileText,
  Users,
  Sword,
  Package,
  TrendingUp
} from 'lucide-react';

// Mock data - will be replaced with API calls
const bulkOperations = [
  {
    id: 'bulk-001',
    name: 'Publish 15 Characters',
    type: 'publish',
    status: 'completed',
    entityType: 'character',
    entityCount: 15,
    startedAt: '2026-08-04T10:00:00Z',
    completedAt: '2026-08-04T10:05:00Z',
    duration: 300,
    successCount: 15,
    failedCount: 0,
  },
  {
    id: 'bulk-002',
    name: 'Archive Old Builds',
    type: 'archive',
    status: 'completed',
    entityType: 'build',
    entityCount: 45,
    startedAt: '2026-08-03T14:00:00Z',
    completedAt: '2026-08-03T14:02:00Z',
    duration: 120,
    successCount: 45,
    failedCount: 0,
  },
  {
    id: 'bulk-003',
    name: 'Verify All Weapons',
    type: 'verify',
    status: 'in_progress',
    entityType: 'weapon',
    entityCount: 32,
    startedAt: '2026-08-04T11:30:00Z',
    completedAt: null,
    duration: null,
    successCount: 18,
    failedCount: 2,
    progress: 62,
  },
  {
    id: 'bulk-004',
    name: 'Delete Unused Materials',
    type: 'delete',
    status: 'failed',
    entityType: 'material',
    entityCount: 12,
    startedAt: '2026-08-02T09:00:00Z',
    completedAt: '2026-08-02T09:01:00Z',
    duration: 60,
    successCount: 8,
    failedCount: 4,
    error: '4 materials are in use and cannot be deleted',
  },
];

const availableOperations = [
  {
    id: 'op-publish',
    name: 'Publish',
    description: 'Publish selected items to production',
    icon: CheckCircle,
    entityType: 'all',
    color: 'green',
  },
  {
    id: 'op-archive',
    name: 'Archive',
    description: 'Archive selected items',
    icon: Archive,
    entityType: 'all',
    color: 'blue',
  },
  {
    id: 'op-delete',
    name: 'Delete',
    description: 'Permanently delete selected items',
    icon: Trash2,
    entityType: 'all',
    color: 'red',
  },
  {
    id: 'op-verify',
    name: 'Verify',
    description: 'Mark selected items as verified',
    icon: CheckSquare,
    entityType: 'all',
    color: 'purple',
  },
  {
    id: 'op-export',
    name: 'Export',
    description: 'Export selected items to JSON',
    icon: FileText,
    entityType: 'all',
    color: 'orange',
  },
  {
    id: 'op-import',
    name: 'Import',
    description: 'Import items from JSON file',
    icon: FileText,
    entityType: 'all',
    color: 'cyan',
  },
];

const entityTypes = [
  { id: 'character', name: 'Characters', icon: Users, count: 45 },
  { id: 'weapon', name: 'Weapons', icon: Sword, count: 32 },
  { id: 'material', name: 'Materials', icon: Package, count: 28 },
];

export default function BulkOperationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bulk Operations</h1>
        <p className="text-gray-600 mt-1">Perform bulk operations on multiple entities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Operations</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{bulkOperations.length}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {bulkOperations.filter(op => op.status === 'completed').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Successful operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {bulkOperations.filter(op => op.status === 'in_progress').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {bulkOperations.filter(op => op.status === 'failed').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Failed operations</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            Operation History
          </TabsTrigger>
          <TabsTrigger value="new">
            <Play className="h-4 w-4 mr-2" />
            New Operation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {bulkOperations.map((operation) => (
            <Card key={operation.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{operation.name}</h3>
                      <Badge variant={
                        operation.status === 'completed' ? 'success' :
                        operation.status === 'in_progress' ? 'warning' :
                        operation.status === 'failed' ? 'error' :
                        'secondary'
                      }>
                        {operation.status === 'completed' ? 'Completed' :
                         operation.status === 'in_progress' ? 'In Progress' :
                         operation.status === 'failed' ? 'Failed' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Entity Type: {operation.entityType}</span>
                      <span>Entities: {operation.entityCount}</span>
                      <span>Started: {new Date(operation.startedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {operation.status === 'in_progress' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{operation.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${operation.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Successful</p>
                    <p className="text-2xl font-bold text-green-600">{operation.successCount}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{operation.failedCount}</p>
                  </div>
                </div>

                {operation.completedAt && (
                  <div className="text-xs text-gray-500 mb-2">
                    Completed: {new Date(operation.completedAt).toLocaleString()} | Duration: {operation.duration}s
                  </div>
                )}

                {operation.error && (
                  <div className="p-3 bg-red-50 rounded-lg text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    {operation.error}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {operation.status === 'failed' && (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Retry Failed
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Create New Bulk Operation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Entity Type</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {entityTypes.map((entity) => {
                      const Icon = entity.icon;
                      return (
                        <Card key={entity.id} className="hover:border-blue-300 transition-colors cursor-pointer">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                              <Icon className="h-8 w-8 text-blue-500" />
                              <div>
                                <p className="font-medium text-gray-900">{entity.name}</p>
                                <p className="text-xs text-gray-500">{entity.count} available</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Operation</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {availableOperations.map((operation) => {
                      const Icon = operation.icon;
                      return (
                        <Card key={operation.id} className="hover:border-blue-300 transition-colors cursor-pointer">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                              <Icon className={`h-8 w-8 text-${operation.color}-500`} />
                              <div>
                                <p className="font-medium text-gray-900">{operation.name}</p>
                                <p className="text-xs text-gray-500">{operation.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configure Operation</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Operation Name</label>
                      <Input placeholder="Enter operation name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Filter Criteria</label>
                      <Input placeholder="e.g., status=draft, createdBefore=2026-01-01" />
                    </div>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Execute Operation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
