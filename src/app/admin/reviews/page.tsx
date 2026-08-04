'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Eye,
  FileText,
  GitCompare,
  Shield,
  User,
  Calendar
} from 'lucide-react';

// Mock data - will be replaced with API calls
const pendingReviews = [
  {
    id: 'review-001',
    entityType: 'character',
    entityId: 'dr-char-new-001',
    entityName: 'New Character Name',
    action: 'create',
    source: 'official-api',
    submittedBy: 'system',
    submittedAt: '2026-08-04T10:30:00Z',
    priority: 'high',
    validationStatus: 'passed',
    validationErrors: 0,
    validationWarnings: 2,
    diffPreview: {
      additions: 45,
      modifications: 0,
      deletions: 0,
    },
  },
  {
    id: 'review-002',
    entityType: 'weapon',
    entityId: 'dr-weap-001',
    entityName: 'Stellar Inferno',
    action: 'update',
    source: 'official-api',
    submittedBy: 'system',
    submittedAt: '2026-08-04T09:15:00Z',
    priority: 'medium',
    validationStatus: 'passed',
    validationErrors: 0,
    validationWarnings: 0,
    diffPreview: {
      additions: 2,
      modifications: 5,
      deletions: 1,
    },
  },
  {
    id: 'review-003',
    entityType: 'material',
    entityId: 'mat-new-001',
    entityName: 'New Material Name',
    action: 'create',
    source: 'community',
    submittedBy: 'contributor@drhub.com',
    submittedAt: '2026-08-04T08:45:00Z',
    priority: 'low',
    validationStatus: 'failed',
    validationErrors: 3,
    validationWarnings: 1,
    diffPreview: {
      additions: 12,
      modifications: 0,
      deletions: 0,
    },
  },
  {
    id: 'review-004',
    entityType: 'build',
    entityId: 'build-new-001',
    entityName: 'Nova Burst Build v2',
    action: 'create',
    source: 'community',
    submittedBy: 'user@example.com',
    submittedAt: '2026-08-04T07:30:00Z',
    priority: 'medium',
    validationStatus: 'passed',
    validationErrors: 0,
    validationWarnings: 4,
    diffPreview: {
      additions: 28,
      modifications: 0,
      deletions: 0,
    },
  },
  {
    id: 'review-005',
    entityType: 'character',
    entityId: 'dr-char-001',
    entityName: 'Nova',
    action: 'update',
    source: 'patch-1.5.0',
    submittedBy: 'system',
    submittedAt: '2026-08-04T06:00:00Z',
    priority: 'high',
    validationStatus: 'passed',
    validationErrors: 0,
    validationWarnings: 1,
    diffPreview: {
      additions: 3,
      modifications: 8,
      deletions: 2,
    },
  },
];

const validationResults = {
  passed: {
    color: 'success',
    icon: CheckCircle,
    label: 'Passed',
  },
  failed: {
    color: 'destructive',
    icon: XCircle,
    label: 'Failed',
  },
  warning: {
    color: 'warning',
    icon: AlertCircle,
    label: 'Warning',
  },
};

export default function ReviewQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
        <p className="text-gray-600 mt-1">Review and approve content changes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{pendingReviews.length}</div>
            <p className="text-xs text-gray-500 mt-1">Items awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {pendingReviews.filter(r => r.priority === 'high').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">High priority items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Validation Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {pendingReviews.filter(r => r.validationStatus === 'passed').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Ready to approve</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Validation Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {pendingReviews.filter(r => r.validationStatus === 'failed').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Review Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="high">
            High Priority ({pendingReviews.filter(r => r.priority === 'high').length})
          </TabsTrigger>
          <TabsTrigger value="validation-failed">
            Validation Failed ({pendingReviews.filter(r => r.validationStatus === 'failed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReviews.map((review) => {
            const validation = validationResults[review.validationStatus as keyof typeof validationResults];
            const ValidationIcon = validation.icon;

            return (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={review.action === 'create' ? 'default' : 'secondary'}>
                          {review.action === 'create' ? 'New' : 'Update'}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {review.entityType}
                        </Badge>
                        {review.priority === 'high' && (
                          <Badge variant="error">High Priority</Badge>
                        )}
                        {review.priority === 'medium' && (
                          <Badge variant="warning">Medium Priority</Badge>
                        )}
                        {review.priority === 'low' && (
                          <Badge variant="secondary">Low Priority</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {review.entityName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {review.entityId}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {review.submittedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(review.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <ValidationIcon className={`h-4 w-4 text-${validation.color}-500`} />
                        <span className="text-sm font-medium text-gray-700">Validation</span>
                      </div>
                      <p className={`text-sm font-semibold text-${validation.color}-600`}>
                        {validation.label}
                      </p>
                      {review.validationErrors > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {review.validationErrors} errors, {review.validationWarnings} warnings
                        </p>
                      )}
                      {review.validationErrors === 0 && review.validationWarnings > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {review.validationWarnings} warnings
                        </p>
                      )}
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <GitCompare className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Changes</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-green-600 font-semibold">
                          +{review.diffPreview.additions}
                        </span>
                        <span className="text-yellow-600 font-semibold">
                          ~{review.diffPreview.modifications}
                        </span>
                        <span className="text-red-600 font-semibold">
                          -{review.diffPreview.deletions}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700">Source</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {review.source.replace('-', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="primary" 
                      className="flex-1"
                      disabled={review.validationStatus === 'failed'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Diff
                    </Button>
                    {review.validationStatus === 'failed' && (
                      <Button variant="outline">
                        Request Changes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="high">
          <div className="space-y-4">
            {pendingReviews
              .filter(r => r.priority === 'high')
              .map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="error">High Priority</Badge>
                      <Badge variant="outline" className="capitalize">
                        {review.entityType}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {review.entityName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Submitted by {review.submittedBy} on {new Date(review.submittedAt).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="primary" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Diff
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="validation-failed">
          <div className="space-y-4">
            {pendingReviews
              .filter(r => r.validationStatus === 'failed')
              .map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="error">Validation Failed</Badge>
                      <Badge variant="outline" className="capitalize">
                        {review.entityType}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {review.entityName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {review.validationErrors} validation errors, {review.validationWarnings} warnings
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Request Changes
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Errors
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
