import { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Sword,
  Package,
  Shield,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Hero } from "@/components/ui/Hero";
import { StatCard } from "@/components/ui/StatCard";
import { DatabaseCard } from "@/components/ui/DatabaseCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DataUnavailable } from "@/components/ui/DataUnavailable";
import { Button } from "@/components/ui/Button";
import { characters } from "@/data/games/destiny-rising/characters";
import { weapons } from "@/data/games/destiny-rising/weapons";
import { artifacts } from "@/data/games/destiny-rising/artifacts";
import { materials } from "@/data/games/destiny-rising/materials";
import { builds } from "@/data/games/destiny-rising/builds";
import { teams } from "@/data/games/destiny-rising/teams";

export const metadata: Metadata = {
  title: "Home",
  description:
    "The ultimate companion platform for Destiny Rising — character databases, build lab, team builder, and more.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* ─── Hero ─── */}
      <Hero>
        <span className="reveal mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface)/0.6)] px-3 py-1 text-xs font-medium text-[rgb(var(--color-text-secondary))]">
          <Sparkles className="h-3 w-3 text-[rgb(var(--color-primary-bright))]" />
          Welcome to
        </span>
        <h1
          className="reveal max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-[rgb(var(--color-text-primary))] sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "60ms" }}
        >
          Destiny Rising <span className="gradient-text">Hub</span>
        </h1>
        <p
          className="reveal mt-4 max-w-lg text-base text-[rgb(var(--color-text-secondary))] sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          Your ultimate Destiny: Rising companion. Database, builds, tools, and more.
        </p>
        <div className="reveal mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "180ms" }}>
          <Link href="/destiny-rising/characters">
            <Button size="lg">
              Explore Database
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/destiny-rising/ai-advisor">
            <Button size="lg" variant="outline">
              AI Advisor
            </Button>
          </Link>
        </div>
      </Hero>

      {/* ─── Stats (real, verified counts — no hardcoded numbers) ─── */}
      <section>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Users} value={characters.length} label="Characters" sublabel="Verified" accent="primary" />
          <StatCard icon={Sword} value={weapons.length} label="Weapons" sublabel="Verified" accent="secondary" />
          <StatCard icon={Package} value={materials.length} label="Materials" sublabel="Verified" accent="accent" />
          <StatCard icon={Shield} value={artifacts.length} label="Artifacts" sublabel="Verified" accent="warning" />
        </div>
      </section>

      {/* ─── Featured Database ─── */}
      <section>
        <SectionHeader
          title="Featured Database"
          description="Every entry is sourced from verified Destiny: Rising data."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DatabaseCard
            icon={Users}
            title="Characters"
            count={`${characters.length} Guardians`}
            description="Browse every playable Lightbearer, their kit, and role."
            href="/destiny-rising/characters"
            accent="primary"
          />
          <DatabaseCard
            icon={Sword}
            title="Weapons"
            count={`${weapons.length} Weapons`}
            description="Full weapon database with stats and types."
            href="/destiny-rising/weapons"
            accent="secondary"
          />
          <DatabaseCard
            icon={Package}
            title="Materials"
            count={`${materials.length} Materials`}
            description="Upgrade materials referenced across the database."
            href="/destiny-rising/materials"
            accent="accent"
          />
          <DatabaseCard
            icon={Shield}
            title="Artifacts"
            count={`${artifacts.length} Artifacts`}
            description="Artifact data verified — a dedicated browse page is not live yet."
            accent="primary"
          />
        </div>
      </section>

      {/* ─── AI Advisor panel ─── */}
      <section>
        <div className="glass gradient-border relative overflow-hidden rounded-2xl p-6 sm:p-10">
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full opacity-25 blur-3xl"
            style={{ backgroundColor: "rgb(var(--color-primary))" }}
          />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--color-primary)/0.3)] bg-[rgb(var(--color-primary)/0.12)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-primary-bright))]">
                <Brain className="h-3 w-3" />
                AI Advisor · Beta
              </span>
              <h3 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                Build smarter.
              </h3>
              <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))]">
                Understand your Guardians, weapons, and team composition — recommendations are only ever
                built from verified data already in this database.
              </p>
            </div>
            <Link href="/destiny-rising/ai-advisor" className="shrink-0">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Popular Builds ─── */}
      <section>
        <SectionHeader
          title="Popular Builds"
          description="Community build data, once verified entries exist."
          action={
            <Link
              href="/destiny-rising/build-lab"
              className="text-xs font-medium text-[rgb(var(--color-primary-bright))] hover:underline"
            >
              View all builds →
            </Link>
          }
        />
        <div className="glass rounded-xl p-2">
          {builds.length === 0 && teams.length === 0 ? (
            <DataUnavailable
              title="No verified builds yet"
              description="Build Lab and Team Builder will populate here as soon as real, verified build data is added — nothing fabricated in the meantime."
            />
          ) : null}
        </div>
      </section>

      {/* ─── Recent Updates ─── */}
      <section>
        <SectionHeader title="Recent Updates" description="Patch notes, new characters, new weapons." />
        <div className="glass rounded-xl p-2">
          <DataUnavailable
            title="No verified updates yet"
            description="Patch notes and changelog data will appear here once a verified source is connected — no placeholder news."
          />
        </div>
      </section>
    </div>
  );
}
