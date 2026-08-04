
/**
 * User domain model.
 * Represents a registered user of the platform.
 */

// ─── User Types ───

export type UserRole = "user" | "moderator" | "admin" | "superadmin";
export type AuthProvider = "email" | "google" | "discord" | "github";
export type ThemePreference = "light" | "dark" | "system";

// ─── User ───

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  email: string;
  emailVerified: boolean;
  provider: AuthProvider;
  providerAccountId: string;
  role: UserRole;
  locale: string;
  theme: ThemePreference;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

// ─── User Stats ───

export interface UserStats {
  totalFavorites: number;
  totalSavedBuilds: number;
  totalSavedTeams: number;
  totalCollections: number;
  memberSince: string;
  lastActive: string;
}

// ─── Favorite ───

export type FavoriteType = "character" | "weapon" | "build" | "team";

export interface Favorite {
  id: string;
  userId: string;
  type: FavoriteType;
  itemId: string;
  itemName: string;
  itemSlug: string;
  itemIcon: string;
  itemColor: string;
  createdAt: string;
}

// ─── Saved Build ───

export interface SavedBuild {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  characterId: string;
  characterName: string;
  weaponId: string;
  weaponName: string;
  artifactSetIds: string[];
  tags: string[];
  notes: string | null;
  isPublic: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Saved Team ───

export interface SavedTeam {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  memberIds: string[];
  template: string | null;
  tags: string[];
  notes: string | null;
  isPublic: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Collection ───

export interface Collection {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  icon: string | null;
  items: CollectionItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  type: FavoriteType;
  itemId: string;
  itemName: string;
  itemSlug: string;
  addedAt: string;
}

// ─── Activity ───

export type ActivityType =
  | "favorite_added"
  | "favorite_removed"
  | "build_saved"
  | "build_updated"
  | "team_saved"
  | "team_updated"
  | "collection_created"
  | "collection_updated"
  | "profile_updated"
  | "settings_changed";

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string | null;
  link: string | null;
  metadata: Record<string, string> | null;
  createdAt: string;
}

// ─── User Settings ───

export interface UserSettings {
  locale: string;
  theme: ThemePreference;
  notifications: {
    email: boolean;
    buildUpdates: boolean;
    teamUpdates: boolean;
    patchNotes: boolean;
  };
  privacy: {
    profilePublic: boolean;
    buildsPublic: boolean;
    teamsPublic: boolean;
    collectionsPublic: boolean;
    showActivity: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: "small" | "medium" | "large";
  };
}

export const defaultUserSettings: UserSettings = {
  locale: "en",
  theme: "dark",
  notifications: {
    email: true,
    buildUpdates: true,
    teamUpdates: true,
    patchNotes: true,
  },
  privacy: {
    profilePublic: true,
    buildsPublic: true,
    teamsPublic: true,
    collectionsPublic: false,
    showActivity: true,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: "medium",
  },
};
