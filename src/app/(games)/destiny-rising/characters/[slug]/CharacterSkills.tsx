import { Typography } from "@/components/ui/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Progress } from "@/components/ui/Progress";
import type { Character, CharacterSkill } from "@/types/domain";
import { Sword, Zap, Star, Shield } from "lucide-react";

interface CharacterSkillsProps {
  character: Character;
}

const skillTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  basic: Sword,
  skill: Zap,
  ultimate: Star,
  passive: Shield,
};

function SkillCard({ skill }: { skill: CharacterSkill }) {
  const Icon = skillTypeIcons[skill.type] || Zap;

  return (
    <Card variant="elevated" padding="md">
      <CardContent className="p-0">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-lg bg-[rgb(var(--color-primary)/0.1)] p-3">
            <Icon className="h-6 w-6 text-[rgb(var(--color-primary))]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Typography variant="h4">{skill.name}</Typography>
              <Badge variant="outline" className="text-[10px]">
                {skill.type.toUpperCase()}
              </Badge>
              {skill.cooldown && (
                <Badge variant="outline" className="text-[10px]">
                  CD: {skill.cooldown}s
                </Badge>
              )}
              {skill.energyCost && (
                <Badge variant="outline" className="text-[10px]">
                  Energy: {skill.energyCost}
                </Badge>
              )}
            </div>
            <Typography variant="bodySm" textColor="secondary" className="mb-3">
              {skill.description}
            </Typography>

            {/* Scaling Table */}
            <div className="space-y-2">
              <Typography variant="caption" weight="semibold" textColor="tertiary">
                SCALING
              </Typography>
              <div className="grid grid-cols-3 gap-2">
                {skill.scaling.map((scale) => (
                  <div
                    key={scale.level}
                    className="rounded-lg bg-[rgb(var(--color-surface-elevated))] p-2 text-center"
                  >
                    <Typography variant="caption" textColor="tertiary">
                      Lv {scale.level}
                    </Typography>
                    <Typography variant="bodySm" weight="semibold" className="text-[rgb(var(--color-primary))]">
                      {scale.value}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CharacterSkills({ character }: CharacterSkillsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Attack */}
      <div>
        <Typography variant="h3" className="mb-4">Basic Attack</Typography>
        {character.skills
          .filter((s) => s.type === "basic")
          .map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
      </div>

      {/* Skill */}
      <div>
        <Typography variant="h3" className="mb-4">Skill</Typography>
        {character.skills
          .filter((s) => s.type === "skill")
          .map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
      </div>

      {/* Ultimate */}
      <div>
        <Typography variant="h3" className="mb-4">Ultimate</Typography>
        <SkillCard skill={character.ultimate} />
      </div>

      {/* Passive */}
      <div>
        <Typography variant="h3" className="mb-4">Passive</Typography>
        <SkillCard skill={character.passive} />
      </div>

      {/* Talents */}
      <div>
        <Typography variant="h3" className="mb-4">Talents</Typography>
        <Accordion type="single" collapsible className="space-y-2">
          {character.talents.map((talent) => (
            <AccordionItem key={talent.id} value={talent.id} className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-4">
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <Badge variant="primary" className="text-[10px]">Lv {talent.unlockLevel}</Badge>
                  <Typography variant="bodySm" weight="semibold">{talent.name}</Typography>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Typography variant="bodySm" textColor="secondary" className="mb-2">
                  {talent.description}
                </Typography>
                <ul className="space-y-1">
                  {talent.effects.map((effect, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--color-primary))]" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
