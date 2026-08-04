import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { InteractiveMap } from "@/features/world/components/InteractiveMap";
import { Map, Layers, Navigation } from "lucide-react";

export const metadata: Metadata = {
  title: "Interactive World Map",
  description: "Explore the world of Destiny Rising. Find materials, bosses, and plan your routes with our interactive world map.",
};

export default function InteractiveWorldPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "Interactive World Map" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1">Interactive World Map</Typography>
          <Badge variant="accent" className="gap-1">
            <Map className="h-3 w-3" />
            Live
          </Badge>
        </div>
        <Typography variant="body" textColor="secondary" className="max-w-2xl">
          Explore the vast world of Destiny Rising. Find materials, track boss respawns, 
          plan optimal routes, and discover hidden secrets across all regions.
        </Typography>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-2">
            <Layers className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Layer System</Typography>
            <Typography variant="caption" textColor="tertiary">
              Toggle layers to see materials, bosses, and more
            </Typography>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-accent)/0.1)] p-2">
            <Navigation className="h-5 w-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Route Planning</Typography>
            <Typography variant="caption" textColor="tertiary">
              AI-powered optimal route generation
            </Typography>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-secondary)/0.1)] p-2">
            <Map className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">Live Status</Typography>
            <Typography variant="caption" textColor="tertiary">
              Real-time node status and respawn tracking
            </Typography>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <InteractiveMap />
    </>
  );
}
