'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Save, ArrowLeft, History, Shield, CheckCircle } from 'lucide-react';

// Mock data - will be replaced with API call
const mockWeapon = {
  id: 'dr-weap-001',
  name: 'Stellar Inferno',
  slug: 'stellar-inferno',
  rarity: 'SSR',
  type: 'Greatsword',
  element: 'Fire',
  baseATK: 674,
  subStat: 'Crit Rate',
  subStatValue: 22.1,
  description: 'A powerful greatsword infused with stellar fire',
  icon: '/weapons/stellar-inferno/icon.png',
  splashArt: '/weapons/stellar-inferno/splash.png',
};

export default function WeaponEditorPage() {
  const [weapon, setWeapon] = useState(mockWeapon);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving weapon:', weapon);
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Weapon</h1>
            <p className="text-gray-600 mt-1">{weapon.name} - {weapon.rarity} {weapon.type}</p>
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
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="passive">Passive</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
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
                    value={weapon.name}
                    onChange={(e) => setWeapon({ ...weapon, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Slug</label>
                  <Input
                    value={weapon.slug}
                    onChange={(e) => setWeapon({ ...weapon, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Rarity</label>
                  <select
                    value={weapon.rarity}
                    onChange={(e) => setWeapon({ ...weapon, rarity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SSR">SSR</option>
                    <option value="SR">SR</option>
                    <option value="R">R</option>
                    <option value="N">N</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                  <select
                    value={weapon.type}
                    onChange={(e) => setWeapon({ ...weapon, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Sword">Sword</option>
                    <option value="Greatsword">Greatsword</option>
                    <option value="Spear">Spear</option>
                    <option value="Bow">Bow</option>
                    <option value="Staff">Staff</option>
                    <option value="Catalyst">Catalyst</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Element</label>
                  <select
                    value={weapon.element}
                    onChange={(e) => setWeapon({ ...weapon, element: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Fire">Fire</option>
                    <option value="Water">Water</option>
                    <option value="Wind">Wind</option>
                    <option value="Earth">Earth</option>
                    <option value="Lightning">Lightning</option>
                    <option value="Ice">Ice</option>
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <textarea
                  value={weapon.description}
                  onChange={(e) => setWeapon({ ...weapon, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Icon URL</label>
                  <Input
                    value={weapon.icon}
                    onChange={(e) => setWeapon({ ...weapon, icon: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Splash Art URL</label>
                  <Input
                    value={weapon.splashArt}
                    onChange={(e) => setWeapon({ ...weapon, splashArt: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Weapon Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Base ATK</label>
                  <Input
                    type="number"
                    value={weapon.baseATK}
                    onChange={(e) => setWeapon({ ...weapon, baseATK: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Sub Stat</label>
                  <select
                    value={weapon.subStat}
                    onChange={(e) => setWeapon({ ...weapon, subStat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Crit Rate">Crit Rate</option>
                    <option value="Crit Damage">Crit Damage</option>
                    <option value="ATK%">ATK%</option>
                    <option value="HP%">HP%</option>
                    <option value="DEF%">DEF%</option>
                    <option value="Energy Recharge">Energy Recharge</option>
                    <option value="Elemental Mastery">Elemental Mastery</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sub Stat Value (Level 90)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={weapon.subStatValue}
                  onChange={(e) => setWeapon({ ...weapon, subStatValue: parseFloat(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Passive Tab */}
        <TabsContent value="passive">
          <Card>
            <CardHeader>
              <CardTitle>Passive Ability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Passive ability editor will be implemented here</p>
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

        {/* Materials Tab */}
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Ascension Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Materials editor will be implemented here</p>
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
                    <p className="text-sm text-gray-600 mt-1">Updated base ATK for balance changes</p>
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
                    <p className="text-sm text-gray-600 mt-1">Initial weapon creation</p>
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
