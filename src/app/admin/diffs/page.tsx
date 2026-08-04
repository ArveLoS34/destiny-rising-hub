'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { GitCompare, FileText, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

// Mock data - will be replaced with API calls
const mockDiffs = [
  {
    id: 'diff-001',
    entityType: 'character',
    entityId: 'dr-char-001',
    entityName: 'Nova',
    oldVersion: '1.3.0',
    newVersion: '1.4.0',
    submittedAt: '2026-08-04T10:30:00Z',
    submittedBy: 'system',
    changes: {
      additions: 3,
      modifications: 8,
      deletions: 2,
    },
  },
  {
    id: 'diff-002',
    entityType: 'weapon',
    entityId: 'dr-weap-001',
    entityName: 'Stellar Inferno',
    oldVersion: '1.3.0',
    newVersion: '1.4.0',
    submittedAt: '2026-08-04T09:15:00Z',
    submittedBy: 'system',
    changes: {
      additions: 2,
      modifications: 5,
      deletions: 1,
    },
  },
];

// Mock field-level diffs
const fieldDiffs = [
  {
    field: 'stats.baseATK',
    type: 'modified',
    oldValue: '342',
    newValue: '355',
    impact: 'high',
  },
  {
    field: 'stats.baseHP',
    type: 'modified',
    oldValue: '14200',
    newValue: '14500',
    impact: 'medium',
  },
  {
    field: 'skills[0].damage',
    type: 'modified',
    oldValue: '280%',
    newValue: '300%',
    impact: 'high',
  },
  {
    field: 'skills[1].cooldown',
    type: 'modified',
    oldValue: '12',
    newValue: '10',
    impact: 'medium',
  },
  {
    field: 'ultimate.energyCost',
    type: 'modified',
    oldValue: '100',
    newValue: '90',
    impact: 'medium',
  },
  {
    field: 'talents[2].effects[0]',
    type: 'modified',
    oldValue: '15% crit rate',
    newValue: '18% crit rate',
    impact: 'low',
  },
  {
    field: 'popularity',
    type: 'modified',
    oldValue: '88',
    newValue: '92',
    impact: 'low',
  },
  {
    field: 'winRate',
    type: 'modified',
    oldValue: '56.8',
    newValue: '58.3',
    impact: 'medium',
  },
  {
    field: 'tierListPlacement.overall',
    type: 'modified',
    oldValue: 'A+',
    newValue: 'S',
    impact: 'high',
  },
  {
    field: 'verifiedAt',
    type: 'modified',
    oldValue: '2026-07-15T00:00:00Z',
    newValue: '2026-08-01T00:00:00Z',
    impact: 'low',
  },
  {
    field: 'synergies[3]',
    type: 'added',
    oldValue: null,
    newValue: 'dr-char-012',
    impact: 'medium',
  },
  {
    field: 'counters[2]',
    type: 'added',
    oldValue: null,
    newValue: 'dr-char-015',
    impact: 'medium',
  },
  {
    field: 'popularBuilds[0].rating',
    type: 'added',
    oldValue: null,
    newValue: '4.8',
    impact: 'low',
  },
];

export default function DiffViewerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Diff Viewer</h1>
        <p className="text-gray-600 mt-1">View and compare content changes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Diffs</CardTitle>
            <GitCompare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{mockDiffs.length}</div>
            <p className="text-xs text-gray-500 mt-1">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Additions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {mockDiffs.reduce((sum, d) => sum + d.changes.additions, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Fields added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Modifications</CardTitle>
            <ArrowRight className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {mockDiffs.reduce((sum, d) => sum + d.changes.modifications, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Fields modified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Deletions</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {mockDiffs.reduce((sum, d) => sum + d.changes.deletions, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Fields deleted</p>
          </CardContent>
        </Card>
      </div>

      {/* Diff List */}
      <Card>
        <CardHeader>
          <CardTitle>Content Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDiffs.map((diff) => (
              <div key={diff.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {diff.entityType}
                      </Badge>
                      <Badge variant="secondary">
                        {diff.oldVersion} → {diff.newVersion}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {diff.entityName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {diff.entityId}
                      </span>
                      <span>
                        Submitted by {diff.submittedBy} on {new Date(diff.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <GitCompare className="h-4 w-4 mr-1" />
                      View Diff
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Additions</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">+{diff.changes.additions}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowRight className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-700">Modifications</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">~{diff.changes.modifications}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">Deletions</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">-{diff.changes.deletions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Field-Level Diff Viewer */}
      <Card>
        <CardHeader>
          <CardTitle>Field-Level Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unified">
            <TabsList>
              <TabsTrigger value="unified">Unified View</TabsTrigger>
              <TabsTrigger value="split">Split View</TabsTrigger>
            </TabsList>

            <TabsContent value="unified" className="space-y-2">
              {fieldDiffs.map((diff, index) => (
                <div key={index} className="font-mono text-sm">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-20">
                      {diff.type === 'added' && (
                        <Badge variant="success" className="text-xs">+ Added</Badge>
                      )}
                      {diff.type === 'modified' && (
                        <Badge variant="warning" className="text-xs">~ Modified</Badge>
                      )}
                      {diff.type === 'deleted' && (
                        <Badge variant="error" className="text-xs">- Deleted</Badge>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">{diff.field}</div>
                      {diff.oldValue !== null && (
                        <div className="flex items-start gap-2">
                          <span className="text-red-600 font-semibold">-</span>
                          <span className="text-red-600 line-through">{diff.oldValue}</span>
                        </div>
                      )}
                      {diff.newValue !== null && (
                        <div className="flex items-start gap-2">
                          <span className="text-green-600 font-semibold">+</span>
                          <span className="text-green-600">{diff.newValue}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <Badge 
                        variant={
                          diff.impact === 'high' ? 'error' : 
                          diff.impact === 'medium' ? 'warning' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {diff.impact} impact
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="split">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="p-3 bg-red-50 rounded-t-lg border-b border-red-200">
                    <h4 className="font-semibold text-red-900">Old Version (1.3.0)</h4>
                  </div>
                  <div className="space-y-2 p-3 bg-white rounded-b-lg border border-red-200">
                    {fieldDiffs
                      .filter(d => d.oldValue !== null)
                      .map((diff, index) => (
                        <div key={index} className="font-mono text-sm p-2 bg-red-50 rounded">
                          <div className="text-xs text-gray-500 mb-1">{diff.field}</div>
                          <div className="text-red-600 line-through">{diff.oldValue}</div>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <div className="p-3 bg-green-50 rounded-t-lg border-b border-green-200">
                    <h4 className="font-semibold text-green-900">New Version (1.4.0)</h4>
                  </div>
                  <div className="space-y-2 p-3 bg-white rounded-b-lg border border-green-200">
                    {fieldDiffs
                      .filter(d => d.newValue !== null)
                      .map((diff, index) => (
                        <div key={index} className="font-mono text-sm p-2 bg-green-50 rounded">
                          <div className="text-xs text-gray-500 mb-1">{diff.field}</div>
                          <div className="text-green-600">{diff.newValue}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
