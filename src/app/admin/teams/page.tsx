'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Save, ArrowLeft, History, Shield, CheckCircle, Star, Users } from 'lucide-react';

// Mock data - will be replaced with API call
const mockTeam = {
  id: 'team-void-burst',
  title: 'Void Burst Boss Killer',
  slug: 'void-burst-boss',
  purpose: 'Boss',
  rating: 4.9,
  description: 'Optimized team composition for maximum boss damage with Void synergy',
  strengths: [
    'High burst damage output',
    'Excellent Void element synergy',
    'Strong single-target focus',
  ],
  weaknesses: [
    'Weak against multiple enemies',
    'Requires precise timing',
    'Energy management critical',
  ],
  recommendedUsage: [
    'Weekly Boss fights',
    'Spiral Abyss floors 9-12',
    'Single-target boss events',
  ],
};

export default function TeamEditorPage() {
  const [team, setTeam] = useState(mockTeam);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving team:', team);
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Team</h1>
            <p className="text-gray-600 mt-1">{team.title} - {team.purpose}</p>
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
            <span className="font-medium">{team.rating}</span>
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
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="synergy">Synergy</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
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
                  value={team.title}
                  onChange={(e) => setTeam({ ...team, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Slug</label>
                <Input
                  value={team.slug}
                  onChange={(e) => setTeam({ ...team, slug: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Purpose</label>
                <select
                  value={team.purpose}
                  onChange={(e) => setTeam({ ...team, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Boss">Boss</option>
                  <option value="Raid">Raid</option>
                  <option value="PvE">PvE</option>
                  <option value="PvP">PvP</option>
                  <option value="Farming">Farming</option>
                  <option value="Spiral Abyss">Spiral Abyss</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <textarea
                  value={team.description}
                  onChange={(e) => setTeam({ ...team, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Add and arrange team members</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">P</div>
                  <div className="flex-1">
                    <Input placeholder="Main DPS character" defaultValue="Phantom" />
                    <p className="text-xs text-gray-500 mt-1">Role: Main DPS • Element: Dark</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">E</div>
                  <div className="flex-1">
                    <Input placeholder="Sub-DPS character" defaultValue="Eclipse" />
                    <p className="text-xs text-gray-500 mt-1">Role: Sub-DPS • Element: Dark</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-medium">A</div>
                  <div className="flex-1">
                    <Input placeholder="Support character" defaultValue="Aurora" />
                    <p className="text-xs text-gray-500 mt-1">Role: Support • Element: Ice</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">S</div>
                  <div className="flex-1">
                    <Input placeholder="Healer character" defaultValue="Sage" />
                    <p className="text-xs text-gray-500 mt-1">Role: Healer • Element: Wind</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  Add Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Synergy Tab */}
        <TabsContent value="synergy">
          <Card>
            <CardHeader>
              <CardTitle>Team Synergy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Element Synergy</label>
                <textarea
                  placeholder="E.g., Double Dark synergy amplifies Phantom's Void Mark damage by 30%"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Role Synergy</label>
                <textarea
                  placeholder="E.g., Aurora's Freeze enables Phantom's burst window"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Faction Synergy</label>
                <textarea
                  placeholder="E.g., Void faction bonus: +15% Dark Damage"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Team Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Strengths</label>
                <div className="space-y-2">
                  {team.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={strength} className="flex-1" />
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add Strength
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Weaknesses</label>
                <div className="space-y-2">
                  {team.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={weakness} className="flex-1" />
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add Weakness
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Recommended Usage</label>
                <div className="space-y-2">
                  {team.recommendedUsage.map((usage, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={usage} className="flex-1" />
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add Usage
                  </Button>
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
                      <p className="text-sm text-green-700">This team composition has been tested</p>
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
                      <span className="font-medium">{team.rating} / 5.0</span>
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
                    <p className="text-sm text-gray-600 mt-1">Updated team member: Sage instead of Luna</p>
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
                    <p className="text-sm text-gray-600 mt-1">Initial team creation</p>
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
