import { Typography } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Character } from "@/types/domain";
import { Star, Users, Wrench, ThumbsUp } from "lucide-react";

interface CharacterBuildsProps {
  character: Character;
}

const difficultyColors: Record<string, "success" | "warning" | "error"> = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

export function CharacterBuilds({ character }: CharacterBuildsProps) {
  return (
    <div className="space-y-6">
      <Typography variant="h3">Popular Builds</Typography>

      <div className="space-y-4">
        {character.popularBuilds.map((build) => (
          <Card key={build.id} variant="elevated" padding="md">
            <CardContent className="p-0 space-y-4">
              {/* Build Header */}
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="h4" className="mb-1">
                    {build.name}
                  </Typography>
                  <Typography variant="bodySm" textColor="secondary">
                    {build.description}
                  </Typography>
                </div>
                <Badge variant={difficultyColors[build.difficulty]}>
                  {build.difficulty}
                </Badge>
              </div>

              {/* Playstyle */}
              <div className="flex items-center gap-2">
                <Wrench className="h-3.5 w-3.5 text-[rgb(var(--color-text-tertiary))]" />
                <Typography variant="caption" textColor="secondary">
                  Playstyle: {build.playstyle}
                </Typography>
              </div>

              {/* Team Composition */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-3.5 w-3.5 text-[rgb(var(--color-text-tertiary))]" />
                  <Typography variant="caption" weight="semibold" textColor="tertiary">
                    TEAM COMPOSITION
                  </Typography>
                </div>
                <div className="flex flex-wrap gap-2">
                  {build.teamComposition.map((charId, i) => (
                    <Badge key={i} variant="outline">
                      {charId}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Build Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--color-border))]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400" />
                    <Typography variant="caption" weight="medium">
                      {build.rating}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5 text-[rgb(var(--color-text-tertiary))]" />
                    <Typography variant="caption" textColor="tertiary">
                      {build.votes.toLocaleString()} votes
                    </Typography>
                  </div>
                </div>
                <Typography variant="caption" textColor="tertiary">
                  by {build.author}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
