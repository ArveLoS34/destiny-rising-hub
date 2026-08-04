import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Progress } from "@/components/ui/Progress";
import { CharacterHero } from "./CharacterHero";
import { CharacterSkills } from "./CharacterSkills";
import { CharacterMaterials } from "./CharacterMaterials";
import { CharacterBuilds } from "./CharacterBuilds";
import { CharacterAnalysis } from "./CharacterAnalysis";
import { getAllCharacters, getCharacterDetail } from "@/features/characters/services/character-service";
import { charactersDetail } from "@/data/games/destiny-rising/characters-detail";
import {
  Shield,
  Sword,
  Heart,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

interface CharacterPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const characters = getAllCharacters();
  return characters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const character = charactersDetail.find((c) => c.slug === slug);

  if (!character) {
    return { title: "Character Not Found" };
  }

  return {
    title: `${character.name} — ${character.title}`,
    description: `${character.name} (${character.rarity} ${character.element} ${character.role}) — ${character.title}. Stats, skills, builds, tier list, and more for Destiny Rising.`,
    keywords: [
      "Destiny Rising",
      character.name,
      character.element,
      character.role,
      character.rarity,
      "build",
      "tier list",
      "guide",
    ],
  };
}

export default async function CharacterDetailPage({ params }: CharacterPageProps) {
  const { slug } = await params;
  const character = charactersDetail.find((c) => c.slug === slug);

  if (!character) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Characters", href: "/(games)/destiny-rising/characters" },
          { label: character.name },
        ]}
        className="mb-6"
      />

      {/* Hero Banner */}
      <CharacterHero character={character} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
        <Card variant="elevated" padding="sm">
          <CardContent className="flex flex-col items-center gap-1 p-0 text-center">
            <Star className="h-5 w-5 text-yellow-400" />
            <Typography variant="bodySm" weight="semibold">{character.tierListPlacement.overall}</Typography>
            <Typography variant="caption" textColor="tertiary">Tier</Typography>
          </CardContent>
        </Card>
        <Card variant="elevated" padding="sm">
          <CardContent className="flex flex-col items-center gap-1 p-0 text-center">
            <TrendingUp className="h-5 w-5 text-[rgb(var(--color-success))]" />
            <Typography variant="bodySm" weight="semibold">{character.winRate}%</Typography>
            <Typography variant="caption" textColor="tertiary">Win Rate</Typography>
          </CardContent>
        </Card>
        <Card variant="elevated" padding="sm">
          <CardContent className="flex flex-col items-center gap-1 p-0 text-center">
            <Users className="h-5 w-5 text-[rgb(var(--color-primary))]" />
            <Typography variant="bodySm" weight="semibold">{character.pickRate}%</Typography>
            <Typography variant="caption" textColor="tertiary">Pick Rate</Typography>
          </CardContent>
        </Card>
        <Card variant="elevated" padding="sm">
          <CardContent className="flex flex-col items-center gap-1 p-0 text-center">
            <Star className="h-5 w-5 text-[rgb(var(--color-accent))]" />
            <Typography variant="bodySm" weight="semibold">{character.popularity}</Typography>
            <Typography variant="caption" textColor="tertiary">Popularity</Typography>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="skills">
        <TabsList className="mb-6">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="builds">Builds</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <CharacterSkills character={character} />
        </TabsContent>

        <TabsContent value="materials">
          <CharacterMaterials character={character} />
        </TabsContent>

        <TabsContent value="builds">
          <CharacterBuilds character={character} />
        </TabsContent>

        <TabsContent value="analysis">
          <CharacterAnalysis character={character} />
        </TabsContent>
      </Tabs>
    </>
  );
}
