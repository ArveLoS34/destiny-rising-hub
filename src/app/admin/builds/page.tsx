'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Save, ArrowLeft, History, Shield, CheckCircle, Star } from 'lucide-react';

// Mock data - will be replaced with API call
const mockBuild = {
  id: 'build-nova-burst',
  title: 'Nova Burst DPS Build',
  slug: 'nova-burst-dps',
  characterId: 'dr-char-001',
  characterName: 'Nova',
  difficulty: 'Medium',
  rating: 4.8,
  description: 'Maximum burst damage build for Nova, optimized for AoE content',
  gameplayNotes: 'Use skill to apply Burning, then use ultimate for maximum damage',
  videoUrl: 'https://youtube.com/watch?v=example',
};

export default function BuildEditorPage() {
  const [build, setBuild] = useState(mockBuild);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving build:', build);
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Build</h1>
            <p className="text-gray-600 mt-1">{build.title} - {build.characterName}</p>
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
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-medium">{build.rating}</span>
          </div>
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
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="rotation">Rotation</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
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
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
                <Input
                  value={build.title}
                  onChange={(e) => setBuild({ ...build, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Slug</label>
                <Input
                  value={build.slug}
                  onChange={(e) => setBuild({ ...build, slug: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Character</label>
                  <Input
                    value={build.characterName}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
                  <select
                    value={build.difficulty}
                    onChange={(e) => setBuild({ ...build, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <textarea
                  value={build.description}
                  onChange={(e) => setBuild({ ...build, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Gameplay Notes</label>
                <textarea
                  value={build.gameplayNotes}
                  onChange={(e) => setBuild({ ...build, gameplayNotes: e.target.value })}
                  rows={3}
                  placeholder="Tips and tricks for playing this build"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Video URL (Optional)</label>
                <Input
                  value={build.videoUrl}
                  onChange={(e) => setBuild({ ...build, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Weapon</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Stellar Inferno (SSR)</option>
                  <option>Ember Blade (R)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Artifact Set</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Inferno's Resolve (4-piece)</option>
                  <option>Berserker's Fury (4-piece)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Main Stats</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Sands</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>ATK%</option>
                      <option>HP%</option>
                      <option>DEF%</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Goblet</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Fire Damage Bonus</option>
                      <option>ATK%</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Circlet</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Crit Rate</option>
                      <option>Crit Damage</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sub-Stats Priority</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-20">1st:</span>
                    <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Crit Rate</option>
                      <option>Crit Damage</option>
                      <option>ATK%</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-20">2nd:</span>
                    <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Crit Damage</option>
                      <option>Crit Rate</option>
                      <option>ATK%</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-20">3rd:</span>
                    <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>ATK%</option>
                      <option>Elemental Mastery</option>
                      <option>Energy Recharge</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rotation Tab */}
        <TabsContent value="rotation">
          <Card>
            <CardHeader>
              <CardTitle>Combat Rotation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Define the optimal combat rotation for this build</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">1</div>
                  <Input placeholder="E.g., Use Skill to apply Burning" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">2</div>
                  <Input placeholder="E.g., Use Ultimate for maximum damage" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">3</div>
                  <Input placeholder="E.g., Use Basic Attacks to regenerate energy" />
                </div>
                <Button variant="outline" className="w-full">
                  Add Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Add team members that synergize with this build</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">S</div>
                  <div className="flex-1">
                    <Input placeholder="Support character name" />
                    <p className="text-xs text-gray-500 mt-1">Role: Support</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">H</div>
                  <div className="flex-1">
                    <Input placeholder="Healer character name" />
                    <p className="text-xs text-gray-500 mt-1">Role: Healer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">S</div>
                  <div className="flex-1">
                    <Input placeholder="Sub-DPS character name" />
                    <p className="text-xs text-gray-500 mt-1">Role: Sub-DPS</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Add Team Member
                </Button>
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
                      <p className="text-sm text-green-700">This build has been tested and verified</p>
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
                    <p className="text-sm text-gray-600">Rating</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">{build.rating} / 5.0</span>
                    </div>
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
                    <p className="text-sm text-gray-600 mt-1">Updated weapon recommendation</p>
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
                    <p className="text-sm text-gray-600 mt-1">Initial build creation</p>
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
