import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getWeaponBySlug } from "@/features/weapons/services/weapon-service";
import { WeaponHero } from "./WeaponHero";
import { WeaponStats } from "./WeaponStats";
import { WeaponRelationships } from "./WeaponRelationships";
import { WeaponMaterials } from "./WeaponMaterials";

interface WeaponDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: WeaponDetailPageProps): Promise<Metadata> {
  const weapon = getWeaponBySlug(params.slug);

  if (!weapon) {
    return {
      title: "Weapon Not Found",
    };
  }

  return {
    title: `${weapon.name} - ${weapon.weaponType} | Destiny Rising Weapons`,
    description: `${weapon.name} (${weapon.rarity} ${weapon.weaponType}) - ${weapon.element} element, ${weapon.damageType} damage type. Stats, perks, upgrade materials, and recommended characters for Destiny Rising.`,
  };
}

export default function WeaponDetailPage({ params }: WeaponDetailPageProps) {
  const weapon = getWeaponBySlug(params.slug);

  if (!weapon) {
    notFound();
  }

  return (
    <Container className="py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "Weapons", href: "/destiny-rising/weapons" },
          { label: weapon.name },
        ]}
        className="mb-6"
      />

      <WeaponHero weapon={weapon} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <WeaponStats weapon={weapon} />
          <WeaponRelationships weapon={weapon} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <WeaponMaterials weapon={weapon} />
          
          {/* Quick Info Card */}
          <Card>
            <div className="p-4 space-y-3">
              <Typography variant="h4">Quick Info</Typography>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-secondary))]">Manufacturer</span>
                  <span className="font-medium">{weapon.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-secondary))]">Release</span>
                  <span className="font-medium">v{weapon.releaseVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgb(var(--color-text-secondary))]">Availability</span>
                  <Badge variant="outline">Permanent</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
