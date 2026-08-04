'use client';

import { useState, useEffect, useMemo } from 'react';
import { WorldService } from '@/features/world/services/world-service';
import { RouteService } from '@/features/world/services/route-service';
import type { MapNode, MapLayer, MapFilters, Region, Zone, NodeType } from '@/types/domain';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  Map, Layers, Search, Filter, Navigation, Skull, Package, 
  User, DoorClosed, ScrollText, Calendar, Box, Eye, Zap, 
  Puzzle, Skull as SkullIcon, Shield
} from 'lucide-react';

interface InteractiveMapProps {
  initialRegion?: string;
  initialZone?: string;
}

export function InteractiveMap({ initialRegion, initialZone }: InteractiveMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(initialRegion);
  const [selectedZone, setSelectedZone] = useState<string | undefined>(initialZone);
  const [enabledLayers, setEnabledLayers] = useState<Set<string>>(new Set(['materials', 'bosses']));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [filters, setFilters] = useState<MapFilters>({
    regions: [],
    zones: [],
    nodeTypes: [],
    difficulties: [],
    status: [],
    elements: [],
    materials: [],
    bosses: [],
  });

  const world = WorldService.getWorld();
  const regions = WorldService.getAllRegions();
  const zones = selectedRegion ? WorldService.getZonesByRegion(selectedRegion) : [];
  
  const filteredNodes = useMemo(() => {
    let nodes = WorldService.getAllNodes();

    // Apply region filter
    if (selectedRegion) {
      nodes = nodes.filter(n => n.regionId === selectedRegion);
    }

    // Apply zone filter
    if (selectedZone) {
      nodes = nodes.filter(n => n.zoneId === selectedZone);
    }

    // Apply layer filters
    if (enabledLayers.size > 0) {
      const layerTypeMap: Record<string, NodeType> = {
        materials: 'material',
        bosses: 'boss',
        elites: 'elite',
        dungeons: 'dungeon',
        npcs: 'npc',
        quests: 'quest',
        events: 'event',
        chests: 'chest',
        secrets: 'secret',
        teleports: 'teleport',
        puzzles: 'puzzle',
      };

      const enabledNodeTypes = Array.from(enabledLayers)
        .map(layer => layerTypeMap[layer])
        .filter(Boolean);

      if (enabledNodeTypes.length > 0) {
        nodes = nodes.filter(n => enabledNodeTypes.includes(n.type));
      }
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      nodes = nodes.filter(n => 
        n.name.toLowerCase().includes(query) ||
        n.description.toLowerCase().includes(query)
      );
    }

    return nodes;
  }, [selectedRegion, selectedZone, enabledLayers, searchQuery]);

  const toggleLayer = (layerId: string) => {
    const newLayers = new Set(enabledLayers);
    if (newLayers.has(layerId)) {
      newLayers.delete(layerId);
    } else {
      newLayers.add(layerId);
    }
    setEnabledLayers(newLayers);
  };

  const getNodeIcon = (type: NodeType) => {
    const icons: Record<NodeType, React.ComponentType<{ className?: string }>> = {
      material: Package,
      boss: Skull,
      elite: Shield,
      dungeon: DoorClosed,
      npc: User,
      quest: ScrollText,
      event: Calendar,
      chest: Box,
      secret: Eye,
      teleport: Zap,
      puzzle: Puzzle,
    };
    return icons[type] || Package;
  };

  const getLayerIcon = (layerId: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      materials: Package,
      bosses: Skull,
      elites: Shield,
      dungeons: DoorClosed,
      npcs: User,
      quests: ScrollText,
      events: Calendar,
      chests: Box,
      secrets: Eye,
      teleports: Zap,
      puzzles: Puzzle,
    };
    return icons[layerId] || Package;
  };

  const nodeStats = useMemo(() => {
    const stats = {
      total: filteredNodes.length,
      materials: filteredNodes.filter(n => n.type === 'material').length,
      bosses: filteredNodes.filter(n => n.type === 'boss').length,
      elites: filteredNodes.filter(n => n.type === 'elite').length,
      dungeons: filteredNodes.filter(n => n.type === 'dungeon').length,
    };
    return stats;
  }, [filteredNodes]);

  return (
    <Container className="py-8">
      <div className="mb-8">
        <Typography variant="h1" className="mb-2">Interactive World Map</Typography>
        <Typography variant="body" textColor="secondary">
          Explore the world of Destiny Rising. Find materials, bosses, and more.
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <Card padding="md">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Typography variant="bodySm" weight="semibold">Search</Typography>
              </div>
              <Input
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>

          {/* Region & Zone Selection */}
          <Card padding="md">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <Typography variant="bodySm" weight="semibold">Location</Typography>
              </div>
              <select
                value={selectedRegion || ''}
                onChange={(e) => {
                  setSelectedRegion(e.target.value || undefined);
                  setSelectedZone(undefined);
                }}
                className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
              {zones.length > 0 && (
                <select
                  value={selectedZone || ''}
                  onChange={(e) => setSelectedZone(e.target.value || undefined)}
                  className="w-full h-10 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 text-sm"
                >
                  <option value="">All Zones</option>
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              )}
            </div>
          </Card>

          {/* Layers */}
          <Card padding="md">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <Typography variant="bodySm" weight="semibold">Layers</Typography>
              </div>
              <div className="space-y-2">
                {WorldService.getAllLayers().map(layer => {
                  const Icon = getLayerIcon(layer.id);
                  return (
                    <button
                      key={layer.id}
                      onClick={() => toggleLayer(layer.id)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        enabledLayers.has(layer.id)
                          ? 'bg-[rgb(var(--color-primary)/0.1)] border border-[rgb(var(--color-primary))]'
                          : 'bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <Typography variant="bodySm" className="flex-1 text-left">
                        {layer.name}
                      </Typography>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: layer.color }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card padding="md">
            <div className="space-y-3">
              <Typography variant="bodySm" weight="semibold">Statistics</Typography>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-secondary))]">Total Nodes:</span>
                  <span className="font-semibold">{nodeStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-secondary))]">Materials:</span>
                  <span className="font-semibold">{nodeStats.materials}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-secondary))]">Bosses:</span>
                  <span className="font-semibold">{nodeStats.bosses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-secondary))]">Elites:</span>
                  <span className="font-semibold">{nodeStats.elites}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-secondary))]">Dungeons:</span>
                  <span className="font-semibold">{nodeStats.dungeons}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-3">
          <Card padding="none" className="overflow-hidden">
            {/* Map Header */}
            <div className="p-4 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))]">
              <div className="flex items-center justify-between">
                <Typography variant="body" weight="semibold">
                  {selectedRegion ? regions.find(r => r.id === selectedRegion)?.name : 'World Map'}
                  {selectedZone && ` - ${zones.find(z => z.id === selectedZone)?.name}`}
                </Typography>
                <Badge variant="primary">{filteredNodes.length} nodes</Badge>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="relative h-[600px] bg-[rgb(var(--color-background))] overflow-auto">
              <div className="relative min-w-[1200px] min-h-[800px] p-8">
                {/* Grid Background */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgb(var(--color-border)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-border)) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                  }}
                />

                {/* Nodes */}
                {filteredNodes.map(node => {
                  const Icon = getNodeIcon(node.type);
                  const layer = WorldService.getLayerById(node.type + 's');
                  
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="absolute group"
                      style={{
                        left: `${(node.position.x / 2000) * 100}%`,
                        top: `${(node.position.y / 2000) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div 
                        className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all group-hover:scale-110"
                        style={{
                          backgroundColor: layer ? `${layer.color}20` : 'rgb(var(--color-surface))',
                          borderColor: layer?.color || 'rgb(var(--color-border))',
                        }}
                      >
                        <Icon 
                          className="h-5 w-5" 
                        />
                        {node.status === 'respawning' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[rgb(var(--color-warning))] rounded-full animate-pulse" />
                        )}
                        {node.status === 'locked' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[rgb(var(--color-error))] rounded-full" />
                        )}
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {node.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Selected Node Details */}
          {selectedNode && (
            <Card padding="md" className="mt-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Typography variant="h3" className="mb-1">{selectedNode.name}</Typography>
                  <Typography variant="bodySm" textColor="secondary">
                    {selectedNode.description}
                  </Typography>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                >
                  ×
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Typography variant="caption" textColor="tertiary">Type</Typography>
                  <Typography variant="bodySm" weight="semibold" className="capitalize">
                    {selectedNode.type}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" textColor="tertiary">Difficulty</Typography>
                  <Typography variant="bodySm" weight="semibold" className="capitalize">
                    {selectedNode.difficulty}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" textColor="tertiary">Status</Typography>
                  <Badge 
                    variant={
                      selectedNode.status === 'available' ? 'success' :
                      selectedNode.status === 'respawning' ? 'warning' : 'error'
                    }
                    className="capitalize"
                  >
                    {selectedNode.status}
                  </Badge>
                </div>
                <div>
                  <Typography variant="caption" textColor="tertiary">Respawn</Typography>
                  <Typography variant="bodySm" weight="semibold">
                    {selectedNode.respawnTime ? `${selectedNode.respawnTime}m` : 'N/A'}
                  </Typography>
                </div>
              </div>
              {selectedNode.drops && selectedNode.drops.length > 0 && (
                <div className="mt-4">
                  <Typography variant="bodySm" weight="semibold" className="mb-2">Drops</Typography>
                  <div className="space-y-1">
                    {selectedNode.drops.map((drop, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-[rgb(var(--color-text-secondary))]">{drop.itemName}</span>
                        <Badge variant="outline">{(drop.dropRate * 100).toFixed(0)}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}
