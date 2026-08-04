'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Save, ArrowLeft, History, Shield, CheckCircle } from 'lucide-react';

// Mock data - will be replaced with API call
const mockMaterial = {
  id: 'mat-fire-core',
  name: 'Fire Core',
  slug: 'fire-core',
  rarity: 'Rare',
  type: 'Ascension',
  source: 'Boss Drop',
  respawnTime: 24,
  description: 'A core infused with fire essence, used for ascending fire characters',
  icon: '/materials/fire-core/icon.png',
};

export default function MaterialEditorPage() {
  const [material, setMaterial] = useState(mockMaterial);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving material:', material);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Material</h1>
            <p className="text-gray-600 mt-1">{material.name} - {material.rarity} {material.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <History className="h-3 w-3" />
            Version 1.4.0
          </Badge>
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="source">Source & Respawn</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                  <Input
                    value={material.name}
                    onChange={(e) => setMaterial({ ...material, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Slug</label>
                  <Input
                    value={material.slug}
                    onChange={(e) => setMaterial({ ...material, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Rarity</label>
                  <select
                    value={material.rarity}
                    onChange={(e) => setMaterial({ ...material, rarity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                  <select
                    value={material.type}
                    onChange={(e) => setMaterial({ ...material, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ascension">Ascension</option>
                    <option value="Talent">Talent</option>
                    <option value="Weapon">Weapon</option>
                    <option value="Currency">Currency</option>
                    <option value="Consumable">Consumable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <textarea
                  value={material.description}
                  onChange={(e) => setMaterial({ ...material, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Icon URL</label>
                <Input
                  value={material.icon}
                  onChange={(e) => setMaterial({ ...material, icon: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Source & Respawn Tab */}
        <TabsContent value="source">
          <Card>
            <CardHeader>
              <CardTitle>Source & Respawn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Source</label>
                <select
                  value={material.source}
                  onChange={(e) => setMaterial({ ...material, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Boss Drop">Boss Drop</option>
                  <option value="Domain">Domain</option>
                  <option value="Enemy Drop">Enemy Drop</option>
                  <option value="Quest">Quest</option>
                  <option value="Crafting">Crafting</option>
                  <option value="Shop">Shop</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Respawn Time (hours)</label>
                <Input
                  type="number"
                  value={material.respawnTime}
                  onChange={(e) => setMaterial({ ...material, respawnTime: parseInt(e.target.value) })}
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 for non-respawning materials</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Source Details</label>
                <textarea
                  placeholder="E.g., Boss name, domain name, location, etc."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Characters and items that use this material</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      N
                    </div>
                    <div>
                      <p className="font-medium">Nova</p>
                      <p className="text-sm text-gray-500">Character • Ascension</p>
                    </div>
                  </div>
                  <Badge variant="outline">46 required</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium">
                      B
                    </div>
                    <div>
                      <p className="font-medium">Blaze</p>
                      <p className="text-sm text-gray-500">Character • Ascension</p>
                    </div>
                  </div>
                  <Badge variant="outline">46 required</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Metadata editor will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Verified</p>
                      <p className="text-sm text-green-700">This content has been verified</p>
                    </div>
                  </div>
                  <Badge variant="success">Verified</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Verified At</p>
                    <p className="font-medium">2026-08-01 12:00:00</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Verified By</p>
                    <p className="font-medium">admin@drhub.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Game Version</p>
                    <p className="font-medium">1.4.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Source</p>
                    <p className="font-medium">Official Game Data</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Version History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <History className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Version 1.4.0</p>
                      <span className="text-sm text-gray-500">2026-08-01 12:00:00</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Updated respawn time</p>
                    <p className="text-xs text-gray-500 mt-1">by admin@drhub.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <History className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Version 1.0.0</p>
                      <span className="text-sm text-gray-500">2026-01-15 09:00:00</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Initial material creation</p>
                    <p className="text-xs text-gray-500 mt-1">by admin@drhub.com</p>
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
