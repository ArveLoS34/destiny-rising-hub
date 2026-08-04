import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { getAllCharacters, getFilterOptions, getCharacterCount } from "@/features/characters/services/character-service";
import { CharacterListClient } from "./CharacterListClient";
import { Users, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Characters",
  description:
    "Browse all Destiny Rising characters — stats, builds, skills, tier list placements, and more. Filter by element, role, rarity, and faction.",
  keywords: ["Destiny Rising", "characters", "tier list", "builds", "database"],
};

export default function CharactersPage() {
  const characters = getAllCharacters();
  const filterOptions = getFilterOptions();
  const count = getCharacterCount();

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Destiny Rising", href: "/" },
          { label: "Characters" },
        ]}
        className="mb-6"
      />

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1">Characters</Typography>
          <Badge variant="primary">{count}</Badge>
        </div>
        <Typography variant="body" textColor="secondary" className="max-w-2xl">
          Complete character database with stats, builds, skills, and tier list placements.
          All data verified against in-game sources.
        </Typography>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-2">
            <Users className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">{count}</Typography>
            <Typography variant="caption" textColor="tertiary">Total Characters</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-accent)/0.1)] p-2">
            <Shield className="h-5 w-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">
              {filterOptions.rarities.length}
            </Typography>
            <Typography variant="caption" textColor="tertiary">Rarities</Typography>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
          <div className="rounded-lg bg-[rgb(var(--color-secondary)/0.1)] p-2">
            <Zap className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
          </div>
          <div>
            <Typography variant="bodySm" weight="semibold">
              {filterOptions.elements.length}
            </Typography>
            <Typography variant="caption" textColor="tertiary">Elements</Typography>
          </div>
        </div>
      </div>

      {/* Character List (Client Component) */}
      <CharacterListClient
        characters={characters}
        filterOptions={filterOptions}
      />
    </>
  );
}
