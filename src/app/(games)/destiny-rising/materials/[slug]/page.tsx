import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { getMaterialBySlug, getMaterialSlugs } from "@/features/materials/services/material-service";
import { MapPin, Clock, Repeat, Zap, Package, Users, Sword, FlaskConical, CheckCircle } from "lucide-react";
import Link from "next/link";

interface MaterialDetailPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getMaterialSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: MaterialDetailPageProps): Promise<Metadata> {
  const material = getMaterialBySlug(params.slug);
  if (!material) return { title: "Material Not Found" };

  return {
    title: material.name,
    description: `${material.description} Find ${material.name} at ${material.sources[0]?.location || "various locations"}. Used by ${material.usedBy.length} items.`,
  };
}

const rarityColors: Record<string, string> = {
  common: "from-gray-500/20 to-gray-600/20 border-gray-500/30",
  uncommon: "from-green-500/20 to-green-600/20 border-green-500/30",
  rare: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  epic: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
  legendary: "from-yellow-500/20 to-amber-600/20 border-yellow-500/30",
};

export default function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  const material = getMaterialBySlug(params.slug);
  if (!material) notFound();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "Materials", href: "/destiny-rising/materials" },
          { label: material.name },
        ]}
        className="mb-6"
      />

      <Container>
        {/* Hero Section */}
        <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${rarityColors[material.rarity]} p-6 lg:p-8 mb-8`}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Icon */}
            <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-4xl font-bold text-[rgb(var(--color-text-primary))]">
              {material.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={material.rarity === "legendary" ? "warning" : material.rarity === "epic" ? "primary" : material.rarity === "rare" ? "secondary" : "outline"} className="capitalize">
                  {material.rarity}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {material.category}
                </Badge>
                {material.isWeekly && <Badge variant="warning">Weekly</Badge>}
                {material.isDaily && !material.isWeekly && <Badge variant="default">Daily</Badge>}
              </div>

              <Typography variant="h1">{material.name}</Typography>
              <Typography variant="body" textColor="secondary">
                {material.description}
              </Typography>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                {material.energyCost && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-[rgb(var(--color-warning))]" />
                    <Typography variant="bodySm" weight="medium">{material.energyCost} Energy</Typography>
                  </div>
                )}
                {material.respawnTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
                    <Typography variant="bodySm" weight="medium">{material.respawnTime}</Typography>
                  </div>
                )}
                {material.dropRate && (
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" />
                    <Typography variant="bodySm" weight="medium">{material.dropRate}</Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drop Locations */}
            <Card>
              <div className="p-4 space-y-4">
                <Typography variant="h3">Drop Locations</Typography>
                <div className="space-y-3">
                  {material.sources.map((source, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                      <MapPin className="h-5 w-5 text-[rgb(var(--color-primary))] mt-0.5" />
                      <div className="flex-1">
                        <Typography variant="bodySm" weight="semibold">
                          {source.location}
                        </Typography>
                        {source.bossName && (
                          <Typography variant="caption" textColor="secondary">
                            Boss: {source.bossName}
                          </Typography>
                        )}
                        {source.domainName && (
                          <Typography variant="caption" textColor="secondary">
                            Domain: {source.domainName}
                          </Typography>
                        )}
                        {source.enemyType && (
                          <Typography variant="caption" textColor="secondary">
                            Enemy: {source.enemyType}
                          </Typography>
                        )}
                        {source.notes && (
                          <Typography variant="caption" textColor="tertiary" className="mt-1 block">
                            {source.notes}
                          </Typography>
                        )}
                        {source.coordinates && (
                          <Link
                            href={source.mapLink || "#"}
                            className="inline-flex items-center gap-1 mt-2 text-xs text-[rgb(var(--color-primary))] hover:underline"
                          >
                            <MapPin className="h-3 w-3" />
                            View on Map
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Used By */}
            <Card>
              <div className="p-4 space-y-4">
                <Typography variant="h3">Used By</Typography>
                <div className="space-y-3">
                  {material.usedBy.slice(0, 10).map((usage, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                      {usage.type === "character" && <Users className="h-5 w-5 text-[rgb(var(--color-primary))]" />}
                      {usage.type === "weapon" && <Sword className="h-5 w-5 text-[rgb(var(--color-accent))]" />}
                      {usage.type === "build" && <FlaskConical className="h-5 w-5 text-[rgb(var(--color-secondary))]" />}
                      <div className="flex-1">
                        <Link
                          href={
                            usage.type === "character"
                              ? `/destiny-rising/characters/${usage.slug}`
                              : usage.type === "weapon"
                              ? `/destiny-rising/weapons/${usage.slug}`
                              : "#"
                          }
                          className="text-sm font-medium text-[rgb(var(--color-text-primary))] hover:text-[rgb(var(--color-primary))]"
                        >
                          {usage.name}
                        </Link>
                        <Typography variant="caption" textColor="secondary" className="block">
                          {usage.purpose} • x{usage.quantity}
                        </Typography>
                      </div>
                    </div>
                  ))}
                  {material.usedBy.length > 10 && (
                    <Typography variant="caption" textColor="tertiary" className="text-center">
                      +{material.usedBy.length - 10} more
                    </Typography>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <div className="p-4 space-y-3">
                <Typography variant="h4">Quick Info</Typography>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--color-text-secondary))]">Region</span>
                    <span className="font-medium">{material.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--color-text-secondary))]">World</span>
                    <span className="font-medium">{material.world}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[rgb(var(--color-text-secondary))]">Stack Limit</span>
                    <span className="font-medium">{material.stackLimit.toLocaleString()}</span>
                  </div>
                  {material.sellValue && (
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--color-text-secondary))]">Sell Value</span>
                      <span className="font-medium">{material.sellValue} Gold</span>
                    </div>
                  )}
                  {material.dailyLimit && (
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--color-text-secondary))]">Daily Limit</span>
                      <span className="font-medium">{material.dailyLimit}</span>
                    </div>
                  )}
                  {material.weeklyLimit && (
                    <div className="flex justify-between">
                      <span className="text-[rgb(var(--color-text-secondary))]">Weekly Limit</span>
                      <span className="font-medium">{material.weeklyLimit}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Verification */}
            <Card>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[rgb(var(--color-success))]" />
                  <Typography variant="h4">Verified Data</Typography>
                </div>
                <div className="space-y-1 text-xs text-[rgb(var(--color-text-secondary))]">
                  <p>Source: {material.verification.source}</p>
                  <p>Game Version: v{material.verification.gameVersion}</p>
                  <p>Last Updated: {new Date(material.verification.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
