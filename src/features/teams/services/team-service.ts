import type { TeamSummary, TeamFilters, TeamSortField, TeamComparison } from "@/types/domain";
import { teams } from "@/data/games/destiny-rising/teams";
import { logger } from "@/lib/logger";

const CONTEXT = "TeamService";

export function getAllTeams(): TeamSummary[] {
  logger.debug(CONTEXT, "Fetching all teams", { count: teams.length });
  return [...teams];
}

export function getTeamBySlug(slug: string): TeamSummary | undefined {
  return teams.find((t) => t.slug === slug);
}

export function getTeamsByCharacter(characterId: string): TeamSummary[] {
  return teams.filter((t) => t.members.some((m) => m.characterId === characterId));
}

export function getTeamCount(): number {
  return teams.length;
}

export function getTeamSlugs(): string[] {
  return teams.map((t) => t.slug);
}

export function getTeamFilterOptions() {
  return {
    templates: [...new Set(teams.map((t) => t.template))],
    elements: [...new Set(teams.flatMap((t) => t.elementCoverage))].sort(),
  };
}

export function filterTeams(
  teamList: TeamSummary[],
  filters: TeamFilters
): TeamSummary[] {
  let result = [...teamList];

  if (filters.search.trim()) {
    const query = filters.search.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.members.some((m) => m.characterName.toLowerCase().includes(query)) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (filters.templates.length > 0) {
    result = result.filter((t) => filters.templates.includes(t.template));
  }

  if (filters.elements.length > 0) {
    result = result.filter((t) =>
      filters.elements.some((el) => t.elementCoverage.includes(el))
    );
  }

  result = sortTeams(result, filters.sortBy, filters.sortOrder);
  return result;
}

export function sortTeams(
  teamList: TeamSummary[],
  sortBy: TeamSortField,
  order: "asc" | "desc" = "desc"
): TeamSummary[] {
  return [...teamList].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "popularity": comparison = a.popularity - b.popularity; break;
      case "rating": comparison = a.rating - b.rating; break;
      case "score": comparison = a.score.overall - b.score.overall; break;
      case "tier": {
        const tierOrder: Record<string, number> = { "S+": 7, S: 6, "A+": 5, A: 4, "B+": 3, B: 2, C: 1 };
        comparison = (tierOrder[a.tier] || 0) - (tierOrder[b.tier] || 0);
        break;
      }
      case "name": comparison = a.title.localeCompare(b.title); break;
      default: comparison = 0;
    }
    return order === "desc" ? -comparison : comparison;
  });
}

export function compareTeams(teamAId: string, teamBId: string): TeamComparison | null {
  const teamA = teams.find((t) => t.id === teamAId);
  const teamB = teams.find((t) => t.id === teamBId);
  if (!teamA || !teamB) return null;

  const differences: TeamComparison["differences"] = [
    { category: "Overall", teamAValue: `${teamA.score.overall}/100`, teamBValue: `${teamB.score.overall}/100`, winner: teamA.score.overall > teamB.score.overall ? "A" : teamA.score.overall < teamB.score.overall ? "B" : "tie" },
    { category: "Damage", teamAValue: `${teamA.score.damage}/100`, teamBValue: `${teamB.score.damage}/100`, winner: teamA.score.damage > teamB.score.damage ? "A" : teamA.score.damage < teamB.score.damage ? "B" : "tie" },
    { category: "Support", teamAValue: `${teamA.score.support}/100`, teamBValue: `${teamB.score.support}/100`, winner: teamA.score.support > teamB.score.support ? "A" : teamA.score.support < teamB.score.support ? "B" : "tie" },
    { category: "Control", teamAValue: `${teamA.score.control}/100`, teamBValue: `${teamB.score.control}/100`, winner: teamA.score.control > teamB.score.control ? "A" : teamA.score.control < teamB.score.control ? "B" : "tie" },
    { category: "Survivability", teamAValue: `${teamA.score.survivability}/100`, teamBValue: `${teamB.score.survivability}/100`, winner: teamA.score.survivability > teamB.score.survivability ? "A" : teamA.score.survivability < teamB.score.survivability ? "B" : "tie" },
    { category: "Tier", teamAValue: teamA.tier, teamBValue: teamB.tier, winner: "tie" },
    { category: "Template", teamAValue: teamA.template, teamBValue: teamB.template, winner: "tie" },
  ];

  const recommendation = teamA.score.overall > teamB.score.overall
    ? `${teamA.title} has a higher overall score and is recommended.`
    : teamB.score.overall > teamA.score.overall
    ? `${teamB.title} has a higher overall score and is recommended.`
    : "Both teams are equally viable. Choose based on your preferred playstyle.";

  return { teamA, teamB, differences, recommendation };
}
