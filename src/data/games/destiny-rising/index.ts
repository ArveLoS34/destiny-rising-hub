import type { Game } from "@/types/domain";

/**
 * Destiny Rising — Game Configuration
 *
 * This defines the game metadata and available modules.
 * The platform uses this to dynamically enable/disable features per game.
 */
export const destinyRisingConfig: Game = {
  id: "destiny-rising",
  slug: "destiny-rising",
  name: "Destiny Rising",
  shortName: "DR",
  description:
    "An action-packed RPG featuring a diverse roster of heroes with unique abilities, deep team synergies, and strategic combat across multiple game modes.",
  developer: "Destiny Rising Studios",
  publisher: "Destiny Rising Studios",
  genre: "Action RPG",
  platform: ["iOS", "Android"],
  releaseDate: "2025-01-15",
  currentVersion: "1.4.0",
  status: "active",
  coverImage: "/games/destiny-rising/cover.jpg",
  accentColor: "#7C3AED",
  modules: [
    { id: "characters", name: "Characters", slug: "characters", description: "Character database and profiles", enabled: true, order: 1 },
    { id: "weapons", name: "Weapons", slug: "weapons", description: "Weapon database and stats", enabled: true, order: 2 },
    { id: "materials", name: "Materials", slug: "materials", description: "Material guide and calculator", enabled: true, order: 3 },
    { id: "artifacts", name: "Artifacts", slug: "artifacts", description: "Artifact sets and effects", enabled: true, order: 4 },
    { id: "builds", name: "Build Lab", slug: "build-lab", description: "Build optimization tool", enabled: true, order: 5 },
    { id: "teams", name: "Team Builder", slug: "teams", description: "Team composition tool", enabled: true, order: 6 },
    { id: "missions", name: "Mission Planner", slug: "missions", description: "Mission planning and rewards", enabled: false, order: 7 },
    { id: "tierlist", name: "Tier List", slug: "tier-list", description: "Community tier rankings", enabled: true, order: 8 },
    { id: "codex", name: "Codex", slug: "codex", description: "Lore and guides", enabled: false, order: 9 },
  ],
};
