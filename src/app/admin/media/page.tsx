'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { 
  Upload, 
  Folder, 
  Image as ImageIcon, 
  Video, 
  File,
  Search,
  Grid,
  List,
  Download,
  Trash2,
  Edit,
  Eye,
  Tag,
  FolderPlus,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

// Mock data - will be replaced with API calls
const folders = [
  { id: 'folder-001', name: 'Characters', fileCount: 45, size: 234 },
  { id: 'folder-002', name: 'Weapons', fileCount: 32, size: 189 },
  { id: 'folder-003', name: 'Artifacts', fileCount: 28, size: 156 },
  { id: 'folder-004', name: 'Materials', fileCount: 18, size: 89 },
  { id: 'folder-005', name: 'UI Icons', fileCount: 120, size: 45 },
  { id: 'folder-006', name: 'Screenshots', fileCount: 89, size: 567 },
];

const mediaFiles = [
  {
    id: 'media-001',
    name: 'nova-portrait.png',
    type: 'image',
    format: 'PNG',
    size: 2.4,
    dimensions: '1200x1600',
    folder: 'Characters',
    tags: ['character', 'nova', 'portrait'],
    cdnStatus: 'synced',
    optimized: true,
    versions: 3,
    uploadedAt: '2026-08-01T10:00:00Z',
    lastAccessed: '2026-08-04T11:30:00Z',
    exifCleaned: true,
  },
  {
    id: 'media-002',
    name: 'stellar-inferno-icon.webp',
    type: 'image',
    format: 'WebP',
    size: 0.8,
    dimensions: '256x256',
    folder: 'Weapons',
    tags: ['weapon', 'stellar-inferno', 'icon'],
    cdnStatus: 'synced',
    optimized: true,
    versions: 2,
    uploadedAt: '2026-08-02T14:30:00Z',
    lastAccessed: '2026-08-04T10:45:00Z',
    exifCleaned: true,
  },
  {
    id: 'media-003',
    name: 'character-intro.mp4',
    type: 'video',
    format: 'MP4',
    size: 45.6,
    dimensions: '1920x1080',
    folder: 'Characters',
    tags: ['character', 'intro', 'video'],
    cdnStatus: 'syncing',
    optimized: false,
    versions: 1,
    uploadedAt: '2026-08-03T09:15:00Z',
    lastAccessed: '2026-08-04T09:00:00Z',
    exifCleaned: false,
  },
  {
    id: 'media-004',
    name: 'aurora-splash.avif',
    type: 'image',
    format: 'AVIF',
    size: 1.2,
    dimensions: '1920x1080',
    folder: 'Characters',
    tags: ['character', 'aurora', 'splash'],
    cdnStatus: 'synced',
    optimized: true,
    versions: 4,
    uploadedAt: '2026-07-28T16:45:00Z',
    lastAccessed: '2026-08-04T11:15:00Z',
    exifCleaned: true,
  },
  {
    id: 'media-005',
    name: 'build-guide.pdf',
    type: 'document',
    format: 'PDF',
    size: 3.8,
    dimensions: null,
    folder: 'Documents',
    tags: ['guide', 'build', 'pdf'],
    cdnStatus: 'synced',
    optimized: false,
    versions: 2,
    uploadedAt: '2026-08-01T11:30:00Z',
    lastAccessed: '2026-08-03T14:20:00Z',
    exifCleaned: false,
  },
  {
    id: 'media-006',
    name: 'old-character-art.png',
    type: 'image',
    format: 'PNG',
    size: 5.2,
    dimensions: '2000x2000',
    folder: 'Archive',
    tags: ['character', 'old', 'archive'],
    cdnStatus: 'synced',
    optimized: false,
    versions: 1,
    uploadedAt: '2026-06-15T10:00:00Z',
    lastAccessed: '2026-07-01T09:00:00Z',
    exifCleaned: false,
  },
];

const stats = {
  totalFiles: 332,
  totalSize: 1289,
  images: 245,
  videos: 45,
  documents: 42,
  optimizedFiles: 189,
  unoptimizedFiles: 143,
  cdnSyncedFiles: 312,
  cdnPendingFiles: 20,
  unusedFiles: 28,
  totalVersions: 567,
};

export default function MediaLibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-600 mt-1">Manage images, videos, documents and other media files</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Files</CardTitle>
            <File className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalFiles}</div>
            <p className="text-xs text-gray-500 mt-1">{(stats.totalSize / 1024).toFixed(2)} GB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.images}</div>
            <p className="text-xs text-gray-500 mt-1">{((stats.images / stats.totalFiles) * 100).toFixed(0)}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Optimized</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.optimizedFiles}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.unoptimizedFiles} unoptimized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CDN Synced</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.cdnSyncedFiles}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.cdnPendingFiles} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Unused Files</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.unusedFiles}</div>
            <p className="text-xs text-gray-500 mt-1">Can be deleted</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upload Media</h3>
              <p className="text-sm text-gray-600 mt-1">
                Upload images, videos, and documents. Auto-optimization and CDN sync enabled.
              </p>
            </div>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="files">
        <TabsList>
          <TabsTrigger value="files">
            <Grid className="h-4 w-4 mr-2" />
            Files ({stats.totalFiles})
          </TabsTrigger>
          <TabsTrigger value="folders">
            <Folder className="h-4 w-4 mr-2" />
            Folders ({folders.length})
          </TabsTrigger>
          <TabsTrigger value="optimization">
            <CheckCircle className="h-4 w-4 mr-2" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="cdn">
            <CheckCircle className="h-4 w-4 mr-2" />
            CDN Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaFiles.map((file) => (
              <Card key={file.id} className="hover:border-blue-300 transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                    {file.type === 'image' && <ImageIcon className="h-12 w-12 text-gray-400" />}
                    {file.type === 'video' && <Video className="h-12 w-12 text-gray-400" />}
                    {file.type === 'document' && <File className="h-12 w-12 text-gray-400" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{file.size} MB</span>
                      <Badge variant={
                        file.cdnStatus === 'synced' ? 'success' :
                        file.cdnStatus === 'syncing' ? 'warning' :
                        'secondary'
                      } className="text-[10px]">
                        {file.cdnStatus}
                      </Badge>
                    </div>
                    {file.optimized && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>Optimized</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="folders">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <Card key={folder.id} className="hover:border-blue-300 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Folder className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{folder.name}</p>
                      <p className="text-xs text-gray-500">{folder.fileCount} files • {folder.size} MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle>Media Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Auto-optimize on Upload</p>
                    <p className="text-sm text-gray-600">Automatically convert to WebP/AVIF and optimize</p>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">EXIF Data Cleaning</p>
                    <p className="text-sm text-gray-600">Remove EXIF metadata from images</p>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Unused Media Detection</p>
                    <p className="text-sm text-gray-600">Detect and flag unused media files</p>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Optimized Files</p>
                    <p className="text-2xl font-bold text-green-600">{stats.optimizedFiles}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Unoptimized Files</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.unoptimizedFiles}</p>
                  </div>
                </div>
                <Button className="w-full">
                  Optimize All Unoptimized Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cdn">
          <Card>
            <CardHeader>
              <CardTitle>CDN Synchronization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Synced Files</p>
                    <p className="text-2xl font-bold text-green-600">{stats.cdnSyncedFiles}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Pending Sync</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.cdnPendingFiles}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Sync on Upload</p>
                    <p className="text-sm text-gray-600">Automatically sync files to CDN</p>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
                <Button className="w-full">
                  Sync All Pending Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
