import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Sword,
  FlaskConical,
  Shield,
  Trophy,
  Map,
  Brain,
  Zap,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description:
    "The ultimate companion platform for Destiny Rising — character databases, build lab, team builder, and more.",
};

const featuredModules = [
  {
    title: "Characters",
    description: "Explore every hero, their skills, talents, and optimal builds.",
    icon: Users,
    href: "/characters",
    count: "40+",
    badgeVariant: "primary" as const,
  },
  {
    title: "Build Lab",
    description: "AI-powered build optimization for maximum efficiency.",
    icon: FlaskConical,
    href: "/build-lab",
    count: "New",
    badgeVariant: "accent" as const,
  },
  {
    title: "Weapons",
    description: "Detailed weapon stats, upgrade paths, and character synergies.",
    icon: Sword,
    href: "/weapons",
    count: "60+",
    badgeVariant: "secondary" as const,
  },
  {
    title: "Team Builder",
    description: "Create synergistic teams with elemental combos.",
    icon: Shield,
    href: "/teams",
    count: "Beta",
    badgeVariant: "primary" as const,
  },
  {
    title: "Tier List",
    description: "Community and meta-driven character rankings.",
    icon: Trophy,
    href: "/tier-list",
    count: "Updated",
    badgeVariant: "warning" as const,
  },
  {
    title: "AI Advisor",
    description: "Smart recommendations for builds, farming, and progression.",
    icon: Brain,
    href: "/ai-advisor",
    count: "Beta",
    badgeVariant: "accent" as const,
  },
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="relative py-8 lg:py-16">
        {/* Background Gradient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[rgb(var(--color-primary)/0.08)] blur-3xl" />
          <div className="absolute -top-20 left-1/3 h-[300px] w-[400px] -translate-x-1/2 rounded-full bg-[rgb(var(--color-accent)/0.05)] blur-3xl" />
        </div>

        <Container className="relative">
          <div className="flex flex-col items-center text-center">
            <Badge variant="primary" className="mb-4 px-3 py-1">
              <Zap className="h-3 w-3" />
              Season 1 Update Available
            </Badge>

            <Typography variant="display" className="mb-4">
              Your Ultimate{" "}
              <span className="gradient-text">Destiny Rising</span>
              <br />
              Companion
            </Typography>

            <Typography
              variant="bodyLg"
              textColor="secondary"
              className="mb-8 max-w-2xl"
            >
              Character databases, build optimization, team composition,
              mission planning, and AI-powered recommendations — everything
              you need to dominate.
            </Typography>

            <div className="flex items-center gap-3">
              <Button size="lg">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Characters
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Quick Stats ─── */}
      <section className="py-8">
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Characters", value: "40+", icon: Users },
              { label: "Weapons", value: "60+", icon: Sword },
              { label: "Builds", value: "500+", icon: FlaskConical },
              { label: "Active Users", value: "10K+", icon: Map },
            ].map((stat) => (
              <Card
                key={stat.label}
                variant="elevated"
                padding="sm"
                className="text-center"
              >
                <CardContent className="flex flex-col items-center gap-2 p-0">
                  <stat.icon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                  <Typography variant="h3" className="mb-0">
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" textColor="secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Featured Modules ─── */}
      <section className="py-8">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Typography variant="h2">Explore</Typography>
              <Typography variant="bodySm" textColor="secondary" className="mt-1">
                Everything you need to master Destiny Rising
              </Typography>
            </div>
            <Link href="/discover">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredModules.map((module) => {
              const Icon = module.icon;
              return (
                <Link key={module.href} href={module.href} className="group">
                  <Card
                    variant="interactive"
                    padding="md"
                    className="h-full"
                  >
                    <CardContent className="flex flex-col gap-4 p-0">
                      <div className="flex items-start justify-between">
                        <div className="rounded-lg bg-[rgb(var(--color-surface-elevated))] p-2.5 transition-colors group-hover:bg-[rgb(var(--color-primary)/0.1)]">
                          <Icon className="h-5 w-5 text-[rgb(var(--color-text-secondary))] transition-colors group-hover:text-[rgb(var(--color-primary))]" />
                        </div>
                        <Badge variant={module.badgeVariant}>
                          {module.count}
                        </Badge>
                      </div>
                      <div>
                        <Typography variant="h4" className="mb-1">
                          {module.title}
                        </Typography>
                        <Typography variant="bodySm" textColor="secondary">
                          {module.description}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
