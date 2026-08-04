import { Typography } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Character } from "@/types/domain";
import { ThumbsUp, ThumbsDown, Mic } from "lucide-react";

interface CharacterAnalysisProps {
  character: Character;
}

const strengthColors: Record<string, string> = {
  damage: "text-red-400",
  utility: "text-blue-400",
  survivability: "text-green-400",
  synergy: "text-purple-400",
  ease: "text-amber-400",
};

const weaknessColors: Record<string, string> = {
  matchup: "text-red-400",
  mechanic: "text-orange-400",
  resource: "text-yellow-400",
  playstyle: "text-pink-400",
};

export function CharacterAnalysis({ character }: CharacterAnalysisProps) {
  return (
    <div className="space-y-8">
      {/* Strengths */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ThumbsUp className="h-5 w-5 text-[rgb(var(--color-success))]" />
          <Typography variant="h3">Strengths</Typography>
        </div>
        <div className="space-y-3">
          {character.strengths.map((strength, i) => (
            <Card key={i} variant="elevated" padding="sm">
              <CardContent className="flex items-center gap-3 p-0">
                <div className={`shrink-0 rounded-full p-2 bg-[rgb(var(--color-success)/0.1)]`}>
                  <ThumbsUp className={`h-4 w-4 text-[rgb(var(--color-success))]`} />
                </div>
                <div className="flex-1">
                  <Typography variant="bodySm">{strength.description}</Typography>
                  <Badge variant="success" className="mt-1 text-[10px]">
                    {strength.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ThumbsDown className="h-5 w-5 text-[rgb(var(--color-error))]" />
          <Typography variant="h3">Weaknesses</Typography>
        </div>
        <div className="space-y-3">
          {character.weaknesses.map((weakness, i) => (
            <Card key={i} variant="elevated" padding="sm">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="shrink-0 rounded-full p-2 bg-[rgb(var(--color-error)/0.1)]">
                  <ThumbsDown className="h-4 w-4 text-[rgb(var(--color-error))]" />
                </div>
                <div className="flex-1">
                  <Typography variant="bodySm">{weakness.description}</Typography>
                  <Badge variant="error" className="mt-1 text-[10px]">
                    {weakness.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lore */}
      <div>
        <Typography variant="h3" className="mb-4">Lore</Typography>
        <Card variant="elevated" padding="md">
          <CardContent className="p-0">
            <Typography variant="body" textColor="secondary">
              {character.lore}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Voice Actors */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Mic className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
          <Typography variant="h3">Voice Actors</Typography>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(character.voiceActors).map(([lang, actor]) => (
            <Card key={lang} variant="elevated" padding="sm">
              <CardContent className="p-0 text-center">
                <Typography variant="caption" textColor="tertiary" className="uppercase">
                  {lang}
                </Typography>
                <Typography variant="bodySm" weight="medium">
                  {actor}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Faction */}
      <div>
        <Typography variant="h3" className="mb-4">Faction</Typography>
        <Card variant="elevated" padding="md">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="primary">{character.factionRelation.factionId}</Badge>
              <Badge variant="outline">{character.factionRelation.role}</Badge>
            </div>
            <Typography variant="bodySm" textColor="secondary">
              {character.factionRelation.lore}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Data Verification */}
      <div className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
        <Typography variant="caption" weight="semibold" textColor="tertiary" className="mb-2 block">
          DATA VERIFICATION
        </Typography>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Typography variant="caption" textColor="tertiary">Source</Typography>
            <Typography variant="bodySm">{character.verification.source}</Typography>
          </div>
          <div>
            <Typography variant="caption" textColor="tertiary">Game Version</Typography>
            <Typography variant="bodySm">v{character.verification.gameVersion}</Typography>
          </div>
          <div>
            <Typography variant="caption" textColor="tertiary">Verified At</Typography>
            <Typography variant="bodySm">
              {new Date(character.verification.verifiedAt).toLocaleDateString()}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" textColor="tertiary">Last Updated</Typography>
            <Typography variant="bodySm">
              {new Date(character.verification.lastUpdated).toLocaleDateString()}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
