'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Save, ArrowLeft, History, Shield, CheckCircle } from 'lucide-react';

// Mock data - will be replaced with API call
const mockArtifact = {
  id: 'art-inferno-flower',
  name: 'Ember Bloom',
  slug: 'inferno-flower',
  setName: 'Inferno\'s Resolve',
  setSlug: 'inferno-resolve',
  slot: 'Flower',
  rarity: '5-Star',
  mainStat: 'HP',
  mainStatValue: 4780,
  description: 'A flower forged in the heart of a dying star',
  icon: '/artifacts/ember-bloom/icon.png',
};

export default function ArtifactEditorPage() {
  const [artifact, setArtifact] = useState(mockArtifact);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving artifact:', artifact);
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Artifact</h1>
            <p className="text-gray-600 mt-1">{artifact.name} - {artifact.setName} ({artifact.slot})</p>
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
          <TabsTrigger value="set">Set Bonuses</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
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
                    value={artifact.name}
                    onChange={(e) => setArtifact({ ...artifact, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Slug</label>
                  <Input
                    value={artifact.slug}
                    onChange={(e) => setArtifact({ ...artifact, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Set Name</label>
                  <Input
                    value={artifact.setName}
                    onChange={(e) => setArtifact({ ...artifact, setName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Set Slug</label>
                  <Input
                    value={artifact.setSlug}
                    onChange={(e) => setArtifact({ ...artifact, setSlug: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Slot</label>
                  <select
                    value={artifact.slot}
                    onChange={(e) => setArtifact({ ...artifact, slot: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Flower">Flower</option>
                    <option value="Plume">Plume</option>
                    <option value="Sands">Sands</option>
                    <option value="Goblet">Goblet</option>
                    <option value="Circlet">Circlet</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Rarity</label>
                  <select
                    value={artifact.rarity}
                    onChange={(e) => setArtifact({ ...artifact, rarity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1-Star">1-Star</option>
                    <option value="2-Star">2-Star</option>
                    <option value="3-Star">3-Star</option>
                    <option value="4-Star">4-Star</option>
                    <option value="5-Star">5-Star</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <textarea
                  value={artifact.description}
                  onChange={(e) => setArtifact({ ...artifact, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Icon URL</label>
                <Input
                  value={artifact.icon}
                  onChange={(e) => setArtifact({ ...artifact, icon: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Set Bonuses Tab */}
        <TabsContent value="set">
          <Card>
            <CardHeader>
              <CardTitle>Set Bonuses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">2-Piece Bonus</label>
                <textarea
                  placeholder="E.g., Fire Damage Bonus +15%"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">4-Piece Bonus</label>
                <textarea
                  placeholder="E.g., Increases Burn damage by 40%..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Main Stat</label>
                  <select
                    value={artifact.mainStat}
                    onChange={(e) => setArtifact({ ...artifact, mainStat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="HP">HP</option>
                    <option value="ATK">ATK</option>
                    <option value="DEF">DEF</option>
                    <option value="HP%">HP%</option>
                    <option value="ATK%">ATK%</option>
                    <option value="DEF%">DEF%</option>
                    <option value="Crit Rate">Crit Rate</option>
                    <option value="Crit Damage">Crit Damage</option>
                    <option value="Elemental Mastery">Elemental Mastery</option>
                    <option value="Energy Recharge">Energy Recharge</option>
                    <option value="Fire Damage Bonus">Fire Damage Bonus</option>
                    <option value="Ice Damage Bonus">Ice Damage Bonus</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Main Stat Value (Level 20)</label>
                  <Input
                    type="number"
                    value={artifact.mainStatValue}
                    onChange={(e) => setArtifact({ ...artifact, mainStatValue: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Possible Sub-Stats</label>
                <p className="text-xs text-gray-500 mb-2">Select all possible sub-stats for this artifact slot</p>
                <div className="grid grid-cols-2 gap-2">
                  {['HP', 'HP%', 'ATK', 'ATK%', 'DEF', 'DEF%', 'Crit Rate', 'Crit Damage', 'Elemental Mastery', 'Energy Recharge'].map((stat) => (
                    <label key={stat} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{stat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Characters Tab */}
        <TabsContent value="characters">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Characters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Character recommendations editor will be implemented here</p>
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
                    <p className="text-sm text-gray-600 mt-1">Updated main stat value</p>
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
                    <p className="text-sm text-gray-600 mt-1">Initial artifact creation</p>
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
