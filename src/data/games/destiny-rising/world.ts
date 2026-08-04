import type { World, Region, Zone, MapNode, MapLayer } from '@/types/domain';

/**
 * Destiny Rising World Database
 * CMS-ready data structure for the Interactive World System
 */

// ═══════════════════════════════════════════════════════════════════
// WORLD DEFINITION
// ═══════════════════════════════════════════════════════════════════

export const world: World = {
  id: 'destiny-rising-world',
  slug: 'destiny-rising',
  name: 'Destiny Rising World',
  description: 'The vast world of Destiny Rising, filled with mysteries, challenges, and powerful enemies.',
  backgroundArt: '/world/destiny-rising-bg.jpg',
  regions: [], // Will be populated below
};

// ═══════════════════════════════════════════════════════════════════
// REGIONS
// ═══════════════════════════════════════════════════════════════════

export const regions: Region[] = [
  {
    id: 'region-stellar-plains',
    slug: 'stellar-plains',
    worldId: world.id,
    name: 'Stellar Plains',
    description: 'Vast open plains under the starlit sky, home to various creatures and valuable resources.',
    level: 1,
    backgroundArt: '/regions/stellar-plains.jpg',
    mapBounds: { minX: 0, minY: 0, maxX: 1000, maxY: 1000 },
    zones: [],
  },
  {
    id: 'region-void-rift',
    slug: 'void-rift',
    worldId: world.id,
    name: 'Void Rift',
    description: 'A mysterious rift in space-time, filled with dark energy and powerful void creatures.',
    level: 30,
    backgroundArt: '/regions/void-rift.jpg',
    mapBounds: { minX: 1000, minY: 0, maxX: 2000, maxY: 1000 },
    zones: [],
  },
  {
    id: 'region-inferno-peaks',
    slug: 'inferno-peaks',
    worldId: world.id,
    name: 'Inferno Peaks',
    description: 'Volcanic mountains with rivers of lava, home to fire elementals and rare fire resources.',
    level: 50,
    backgroundArt: '/regions/inferno-peaks.jpg',
    mapBounds: { minX: 0, minY: 1000, maxX: 1000, maxY: 2000 },
    zones: [],
  },
  {
    id: 'region-glacier-depths',
    slug: 'glacier-depths',
    worldId: world.id,
    name: 'Glacier Depths',
    description: 'Frozen landscapes with ancient ice caves, hiding valuable ice crystals and frost creatures.',
    level: 40,
    backgroundArt: '/regions/glacier-depths.jpg',
    mapBounds: { minX: 1000, minY: 1000, maxX: 2000, maxY: 2000 },
    zones: [],
  },
];

// Update world with regions
world.regions = regions;

// ═══════════════════════════════════════════════════════════════════
// ZONES
// ═══════════════════════════════════════════════════════════════════

export const zones: Zone[] = [
  // Stellar Plains Zones
  {
    id: 'zone-crystal-meadows',
    slug: 'crystal-meadows',
    regionId: 'region-stellar-plains',
    name: 'Crystal Meadows',
    description: 'Peaceful meadows filled with crystal formations.',
    level: 1,
    mapBounds: { minX: 0, minY: 0, maxX: 500, maxY: 500 },
  },
  {
    id: 'zone-whispering-woods',
    slug: 'whispering-woods',
    regionId: 'region-stellar-plains',
    name: 'Whispering Woods',
    description: 'Ancient forest with mysterious whispers.',
    level: 5,
    mapBounds: { minX: 500, minY: 0, maxX: 1000, maxY: 500 },
  },
  {
    id: 'zone-starfall-lake',
    slug: 'starfall-lake',
    regionId: 'region-stellar-plains',
    name: 'Starfall Lake',
    description: 'A serene lake where stars seem to fall from the sky.',
    level: 10,
    mapBounds: { minX: 0, minY: 500, maxX: 500, maxY: 1000 },
  },
  
  // Void Rift Zones
  {
    id: 'zone-shadow-realm',
    slug: 'shadow-realm',
    regionId: 'region-void-rift',
    name: 'Shadow Realm',
    description: 'A dimension of pure darkness and shadow creatures.',
    level: 30,
    mapBounds: { minX: 1000, minY: 0, maxX: 1500, maxY: 500 },
  },
  {
    id: 'zone-void-nexus',
    slug: 'void-nexus',
    regionId: 'region-void-rift',
    name: 'Void Nexus',
    description: 'The heart of the void rift, pulsing with dark energy.',
    level: 40,
    mapBounds: { minX: 1500, minY: 0, maxX: 2000, maxY: 500 },
  },
  
  // Inferno Peaks Zones
  {
    id: 'zone-molten-caverns',
    slug: 'molten-caverns',
    regionId: 'region-inferno-peaks',
    name: 'Molten Caverns',
    description: 'Underground caverns filled with flowing lava.',
    level: 50,
    mapBounds: { minX: 0, minY: 1000, maxX: 500, maxY: 1500 },
  },
  {
    id: 'zone-ember-peaks',
    slug: 'ember-peaks',
    regionId: 'region-inferno-peaks',
    name: 'Ember Peaks',
    description: 'The highest peaks, constantly burning with eternal fire.',
    level: 60,
    mapBounds: { minX: 500, minY: 1000, maxX: 1000, maxY: 1500 },
  },
  
  // Glacier Depths Zones
  {
    id: 'zone-frost-caves',
    slug: 'frost-caves',
    regionId: 'region-glacier-depths',
    name: 'Frost Caves',
    description: 'Ice caves filled with ancient frost magic.',
    level: 40,
    mapBounds: { minX: 1000, minY: 1000, maxX: 1500, maxY: 1500 },
  },
  {
    id: 'zone-ice-abyss',
    slug: 'ice-abyss',
    regionId: 'region-glacier-depths',
    name: 'Ice Abyss',
    description: 'A bottomless abyss of ice and frost.',
    level: 50,
    mapBounds: { minX: 1500, minY: 1000, maxX: 2000, maxY: 1500 },
  },
];

// Update regions with zones
regions.forEach(region => {
  region.zones = zones.filter(z => z.regionId === region.id);
});

// ═══════════════════════════════════════════════════════════════════
// MAP NODES
// ═══════════════════════════════════════════════════════════════════

export const mapNodes: MapNode[] = [
  // Material Nodes - Stellar Plains
  {
    id: 'node-crystal-shard-001',
    slug: 'crystal-shard-001',
    type: 'material',
    name: 'Crystal Shard Deposit',
    description: 'A deposit of valuable crystal shards.',
    position: { x: 250, y: 250 },
    regionId: 'region-stellar-plains',
    zoneId: 'zone-crystal-meadows',
    icon: '/nodes/material-crystal.png',
    screenshot: '/screenshots/crystal-shard.jpg',
    status: 'available',
    respawnTime: 30,
    difficulty: 'easy',
    requiredLevel: 1,
    rewards: [
      { type: 'material', itemId: 'mat-crystal-shard', itemName: 'Crystal Shard', quantity: 3, chance: 1.0 },
    ],
    drops: [
      { itemId: 'mat-crystal-shard', itemName: 'Crystal Shard', dropRate: 1.0, minQuantity: 2, maxQuantity: 4 },
    ],
    verification: {
      verified: true,
      verifiedAt: '2025-01-15T00:00:00Z',
      verifiedBy: 'system',
      gameVersion: '1.4.0',
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
  {
    id: 'node-stellar-ore-001',
    slug: 'stellar-ore-001',
    type: 'material',
    name: 'Stellar Ore Vein',
    description: 'A rich vein of stellar ore.',
    position: { x: 750, y: 300 },
    regionId: 'region-stellar-plains',
    zoneId: 'zone-whispering-woods',
    icon: '/nodes/material-ore.png',
    status: 'available',
    respawnTime: 60,
    difficulty: 'easy',
    requiredLevel: 5,
    rewards: [
      { type: 'material', itemId: 'mat-stellar-ore', itemName: 'Stellar Ore', quantity: 5, chance: 1.0 },
    ],
    drops: [
      { itemId: 'mat-stellar-ore', itemName: 'Stellar Ore', dropRate: 1.0, minQuantity: 3, maxQuantity: 7 },
    ],
    verification: {
      verified: true,
      verifiedAt: '2025-01-15T00:00:00Z',
      verifiedBy: 'system',
      gameVersion: '1.4.0',
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
  
  // Boss Nodes
  {
    id: 'node-forest-guardian-001',
    slug: 'forest-guardian',
    type: 'boss',
    name: 'Forest Guardian',
    description: 'An ancient protector of the Whispering Woods.',
    position: { x: 800, y: 200 },
    regionId: 'region-stellar-plains',
    zoneId: 'zone-whispering-woods',
    icon: '/nodes/boss-guardian.png',
    screenshot: '/screenshots/forest-guardian.jpg',
    status: 'available',
    respawnTime: 1440, // 24 hours
    difficulty: 'hard',
    requiredLevel: 10,
    rewards: [
      { type: 'material', itemId: 'mat-guardian-core', itemName: 'Guardian Core', quantity: 1, chance: 0.5 },
      { type: 'item', itemId: 'item-guardian-weapon', itemName: 'Guardian\'s Weapon', quantity: 1, chance: 0.1 },
    ],
    drops: [
      { itemId: 'mat-guardian-core', itemName: 'Guardian Core', dropRate: 0.5, minQuantity: 1, maxQuantity: 1 },
      { itemId: 'mat-stellar-ore', itemName: 'Stellar Ore', dropRate: 1.0, minQuantity: 10, maxQuantity: 20 },
    ],
    verification: {
      verified: true,
      verifiedAt: '2025-01-15T00:00:00Z',
      verifiedBy: 'system',
      gameVersion: '1.4.0',
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
  
  // Void Rift Nodes
  {
    id: 'node-void-crystal-001',
    slug: 'void-crystal-001',
    type: 'material',
    name: 'Void Crystal Formation',
    description: 'Crystals infused with void energy.',
    position: { x: 1250, y: 250 },
    regionId: 'region-void-rift',
    zoneId: 'zone-shadow-realm',
    icon: '/nodes/material-void.png',
    status: 'available',
    respawnTime: 120,
    difficulty: 'medium',
    requiredLevel: 30,
    rewards: [
      { type: 'material', itemId: 'mat-void-crystal', itemName: 'Void Crystal', quantity: 2, chance: 1.0 },
    ],
    drops: [
      { itemId: 'mat-void-crystal', itemName: 'Void Crystal', dropRate: 1.0, minQuantity: 1, maxQuantity: 3 },
    ],
    verification: {
      verified: true,
      verifiedAt: '2025-01-15T00:00:00Z',
      verifiedBy: 'system',
      gameVersion: '1.4.0',
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
  {
    id: 'node-shadow-lord-001',
    slug: 'shadow-lord',
    type: 'boss',
    name: 'Shadow Lord',
    description: 'The master of shadows, ruling over the Shadow Realm.',
    position: { x: 1400, y: 300 },
    regionId: 'region-void-rift',
    zoneId: 'zone-shadow-realm',
    icon: '/nodes/boss-shadow.png',
    screenshot: '/screenshots/shadow-lord.jpg',
    status: 'available',
    respawnTime: 2880, // 48 hours
    difficulty: 'expert',
    requiredLevel: 35,
    rewards: [
      { type: 'material', itemId: 'mat-shadow-essence', itemName: 'Shadow Essence', quantity: 1, chance: 0.7 },
      { type: 'item', itemId: 'item-shadow-armor', itemName: 'Shadow Armor', quantity: 1, chance: 0.05 },
    ],
    drops: [
      { itemId: 'mat-shadow-essence', itemName: 'Shadow Essence', dropRate: 0.7, minQuantity: 1, maxQuantity: 2 },
      { itemId: 'mat-void-crystal', itemName: 'Void Crystal', dropRate: 1.0, minQuantity: 5, maxQuantity: 10 },
    ],
    verification: {
      verified: true,
      verifiedAt: '2025-01-15T00:00:00Z',
      verifiedBy: 'system',
      gameVersion: '1.4.0',
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
  
  // Teleport Nodes
  {
    id: 'node-teleport-stellar-001',
    slug: 'teleport-stellar-plains',
    type: 'teleport',
    name: 'Stellar Plains Teleport',
    description: 'Teleport to the heart of Stellar Plains.',
    position: { x: 500, y: 500 },
    regionId: 'region-stellar-plains',
    zoneId: 'zone-crystal-meadows',
    icon: '/nodes/teleport.png',
    status: 'available',
    difficulty: 'easy',
    requiredLevel: 1,
    verification: {
      verified: true,
      verifiedAt: '2025-01-15T00:00:00Z',
      verifiedBy: 'system',
      gameVersion: '1.4.0',
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
  {
    id: 'node-teleport-void-001',
    slug: 'teleport-void-rift',
    type: 'teleport',
    name: 'Void Rift Teleport',
    description: 'Teleport to the edge of the Void Rift.',
    position: { x: 1500, y: 500 },
    regionId: 'region-void-rift',
    zoneId: 'zone-shadow-realm',
    icon: '/nodes/teleport.png',
    status: 'available',
    difficulty: 'easy',
    requiredLevel: 30,
    verification: {
      verified: true,
      verifiedAt: '2025-01-15T00:00:00Z',
      verifiedBy: 'system',
      gameVersion: '1.4.0',
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    createdBy: 'system',
    updatedBy: 'system',
  },
];

// ═══════════════════════════════════════════════════════════════════
// LAYERS
// ═══════════════════════════════════════════════════════════════════

export const mapLayers: MapLayer[] = [
  { id: 'materials', name: 'Materials', icon: 'Package', color: '#10B981', enabled: true, zIndex: 10 },
  { id: 'bosses', name: 'Bosses', icon: 'Skull', color: '#EF4444', enabled: true, zIndex: 20 },
  { id: 'elites', name: 'Elites', icon: 'Shield', color: '#F59E0B', enabled: true, zIndex: 15 },
  { id: 'dungeons', name: 'Dungeons', icon: 'DoorClosed', color: '#8B5CF6', enabled: true, zIndex: 25 },
  { id: 'npcs', name: 'NPCs', icon: 'User', color: '#3B82F6', enabled: true, zIndex: 5 },
  { id: 'quests', name: 'Quests', icon: 'ScrollText', color: '#FBBF24', enabled: true, zIndex: 30 },
  { id: 'events', name: 'Events', icon: 'Calendar', color: '#EC4899', enabled: true, zIndex: 35 },
  { id: 'chests', name: 'Chests', icon: 'Box', color: '#D97706', enabled: true, zIndex: 8 },
  { id: 'secrets', name: 'Secrets', icon: 'Eye', color: '#6366F1', enabled: true, zIndex: 40 },
  { id: 'teleports', name: 'Teleports', icon: 'Zap', color: '#14B8A6', enabled: true, zIndex: 3 },
  { id: 'puzzles', name: 'Puzzles', icon: 'Puzzle', color: '#A855F7', enabled: true, zIndex: 12 },
];

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export function getRegionById(id: string): Region | undefined {
  return regions.find(r => r.id === id);
}

export function getRegionBySlug(slug: string): Region | undefined {
  return regions.find(r => r.slug === slug);
}

export function getZoneById(id: string): Zone | undefined {
  return zones.find(z => z.id === id);
}

export function getZoneBySlug(slug: string): Zone | undefined {
  return zones.find(z => z.slug === slug);
}

export function getNodeById(id: string): MapNode | undefined {
  return mapNodes.find(n => n.id === id);
}

export function getNodeBySlug(slug: string): MapNode | undefined {
  return mapNodes.find(n => n.slug === slug);
}

export function getNodesByRegion(regionId: string): MapNode[] {
  return mapNodes.filter(n => n.regionId === regionId);
}

export function getNodesByZone(zoneId: string): MapNode[] {
  return mapNodes.filter(n => n.zoneId === zoneId);
}

export function getNodesByType(type: string): MapNode[] {
  return mapNodes.filter(n => n.type === type);
}

export function getLayerById(id: string): MapLayer | undefined {
  return mapLayers.find(l => l.id === id);
}
