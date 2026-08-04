"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { authService } from "@/features/user/services/auth-service";
import { favoritesService } from "@/features/user/services/favorites-service";
import { savedBuildsService } from "@/features/user/services/saved-builds-service";
import { savedTeamsService } from "@/features/user/services/saved-teams-service";
import { collectionsService } from "@/features/user/services/collections-service";
import { activityService } from "@/features/user/services/activity-service";
import type { User, UserStats, Favorite, SavedBuild, SavedTeam, Collection, Activity } from "@/types/domain";
import { 
  Heart, FlaskConical, Users, Folder, Activity as ActivityIcon,
  Settings, Calendar, LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [builds, setBuilds] = useState<SavedBuild[]>([]);
  const [teams, setTeams] = useState<SavedTeam[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        // Auto-login as demo user in development
        const demoUser = await authService.loginAsDemo();
        setUser(demoUser);
        
        // Load data for demo user
        const [fav, bld, tm, col, act] = await Promise.all([
          favoritesService.getUserFavorites(demoUser.id),
          savedBuildsService.getUserBuilds(demoUser.id),
          savedTeamsService.getUserTeams(demoUser.id),
          collectionsService.getUserCollections(demoUser.id),
          activityService.getUserActivities(demoUser.id),
        ]);
        
        setFavorites(fav);
        setBuilds(bld);
        setTeams(tm);
        setCollections(col);
        setActivities(act);
        setStats({
          totalFavorites: fav.length,
          totalSavedBuilds: bld.length,
          totalSavedTeams: tm.length,
          totalCollections: col.length,
          memberSince: demoUser.createdAt,
          lastActive: demoUser.lastLoginAt,
        });
      } else {
        setUser(currentUser);
        
        const [fav, bld, tm, col, act] = await Promise.all([
          favoritesService.getUserFavorites(currentUser.id),
          savedBuildsService.getUserBuilds(currentUser.id),
          savedTeamsService.getUserTeams(currentUser.id),
          collectionsService.getUserCollections(currentUser.id),
          activityService.getUserActivities(currentUser.id),
        ]);
        
        setFavorites(fav);
        setBuilds(bld);
        setTeams(tm);
        setCollections(col);
        setActivities(act);
        setStats({
          totalFavorites: fav.length,
          totalSavedBuilds: bld.length,
          totalSavedTeams: tm.length,
          totalCollections: col.length,
          memberSince: currentUser.createdAt,
          lastActive: currentUser.lastLoginAt,
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    router.push("/login");
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  if (isLoading) {
    return (
      <Container className="py-12">
        <Typography variant="body" textColor="secondary" className="text-center">
          Loading profile...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-12">
        <Typography variant="body" textColor="secondary" className="text-center">
          Please{" "}
          <Link href="/login" className="text-[rgb(var(--color-primary))] hover:underline">
            sign in
          </Link>{" "}
          to view your profile.
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Profile" },
        ]}
        className="mb-6"
      />

      <Container>
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <Avatar
            fallback={user.displayName.charAt(0)}
            size="2xl"
            className="h-20 w-20 text-2xl"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <Typography variant="h1">{user.displayName}</Typography>
              <Badge variant="outline">@{user.username}</Badge>
            </div>
            <Typography variant="body" textColor="secondary" className="mb-2">
              {user.bio || "No bio yet."}
            </Typography>
            <div className="flex items-center gap-4 text-sm text-[rgb(var(--color-text-tertiary))]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
              <Badge variant="primary" className="text-[10px]">
                {user.role}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card variant="elevated" padding="sm">
              <CardContent className="flex flex-col items-center gap-2 p-0 text-center">
                <Heart className="h-5 w-5 text-[rgb(var(--color-error))]" />
                <Typography variant="h3">{stats.totalFavorites}</Typography>
                <Typography variant="caption" textColor="tertiary">Favorites</Typography>
              </CardContent>
            </Card>
            <Card variant="elevated" padding="sm">
              <CardContent className="flex flex-col items-center gap-2 p-0 text-center">
                <FlaskConical className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                <Typography variant="h3">{stats.totalSavedBuilds}</Typography>
                <Typography variant="caption" textColor="tertiary">Builds</Typography>
              </CardContent>
            </Card>
            <Card variant="elevated" padding="sm">
              <CardContent className="flex flex-col items-center gap-2 p-0 text-center">
                <Users className="h-5 w-5 text-[rgb(var(--color-accent))]" />
                <Typography variant="h3">{stats.totalSavedTeams}</Typography>
                <Typography variant="caption" textColor="tertiary">Teams</Typography>
              </CardContent>
            </Card>
            <Card variant="elevated" padding="sm">
              <CardContent className="flex flex-col items-center gap-2 p-0 text-center">
                <Folder className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
                <Typography variant="h3">{stats.totalCollections}</Typography>
                <Typography variant="caption" textColor="tertiary">Collections</Typography>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="favorites">
          <TabsList className="mb-6">
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-1" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="builds">
              <FlaskConical className="h-4 w-4 mr-1" />
              My Builds
            </TabsTrigger>
            <TabsTrigger value="teams">
              <Users className="h-4 w-4 mr-1" />
              My Teams
            </TabsTrigger>
            <TabsTrigger value="collections">
              <Folder className="h-4 w-4 mr-1" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="activity">
              <ActivityIcon className="h-4 w-4 mr-1" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            <Card>
              <CardContent className="p-6">
                {favorites.length > 0 ? (
                  <div className="space-y-2">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: fav.itemColor }}
                        >
                          {fav.itemName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <Typography variant="bodySm" weight="medium">{fav.itemName}</Typography>
                          <Typography variant="caption" textColor="tertiary">{fav.type}</Typography>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{fav.type}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body" textColor="secondary" className="text-center py-8">
                    Your favorite characters, weapons, builds, and teams will appear here.
                    <br />
                    <Link href="/characters" className="text-[rgb(var(--color-primary))] hover:underline text-sm mt-2 inline-block">
                      Browse characters →
                    </Link>
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="builds">
            <Card>
              <CardContent className="p-6">
                {builds.length > 0 ? (
                  <div className="space-y-2">
                    {builds.map((build) => (
                      <div key={build.id} className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                        <FlaskConical className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                        <div className="flex-1">
                          <Typography variant="bodySm" weight="medium">{build.title}</Typography>
                          <Typography variant="caption" textColor="tertiary">
                            {build.characterName} • {build.weaponName}
                          </Typography>
                        </div>
                        <Badge variant={build.isPublic ? "success" : "outline"} className="text-[10px]">
                          {build.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body" textColor="secondary" className="text-center py-8">
                    Your saved builds will appear here. Create your first build from any character page.
                    <br />
                    <Link href="/build-lab" className="text-[rgb(var(--color-primary))] hover:underline text-sm mt-2 inline-block">
                      Explore builds →
                    </Link>
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardContent className="p-6">
                {teams.length > 0 ? (
                  <div className="space-y-2">
                    {teams.map((team) => (
                      <div key={team.id} className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                        <Users className="h-5 w-5 text-[rgb(var(--color-accent))]" />
                        <div className="flex-1">
                          <Typography variant="bodySm" weight="medium">{team.title}</Typography>
                          <Typography variant="caption" textColor="tertiary">
                            {team.memberIds.length} members
                          </Typography>
                        </div>
                        <Badge variant={team.isPublic ? "success" : "outline"} className="text-[10px]">
                          {team.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body" textColor="secondary" className="text-center py-8">
                    Your saved teams will appear here. Create your first team from the Team Builder.
                    <br />
                    <Link href="/destiny-rising/teams" className="text-[rgb(var(--color-primary))] hover:underline text-sm mt-2 inline-block">
                      Explore teams →
                    </Link>
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections">
            <Card>
              <CardContent className="p-6">
                {collections.length > 0 ? (
                  <div className="space-y-2">
                    {collections.map((col) => (
                      <div key={col.id} className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                        <Folder className="h-5 w-5 text-[rgb(var(--color-secondary))]" />
                        <div className="flex-1">
                          <Typography variant="bodySm" weight="medium">{col.title}</Typography>
                          <Typography variant="caption" textColor="tertiary">
                            {col.items.length} items
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body" textColor="secondary" className="text-center py-8">
                    Your collections will appear here. Create collections to organize your favorites.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardContent className="p-6">
                {activities.length > 0 ? (
                  <div className="space-y-2">
                    {activities.map((act) => (
                      <div key={act.id} className="flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--color-surface-elevated))]">
                        <ActivityIcon className="h-5 w-5 text-[rgb(var(--color-text-tertiary))]" />
                        <div className="flex-1">
                          <Typography variant="bodySm" weight="medium">{act.title}</Typography>
                          <Typography variant="caption" textColor="tertiary">
                            {new Date(act.createdAt).toLocaleDateString()}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body" textColor="secondary" className="text-center py-8">
                    Your recent activity will appear here.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6 space-y-6">
                <Typography variant="h3">Settings</Typography>
                
                {/* Theme */}
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Theme</Typography>
                  <div className="flex gap-2">
                    <Badge variant="primary" className="cursor-pointer">Dark</Badge>
                    <Badge variant="outline" className="cursor-pointer">Light</Badge>
                    <Badge variant="outline" className="cursor-pointer">System</Badge>
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Language</Typography>
                  <div className="flex gap-2">
                    <Badge variant="primary" className="cursor-pointer">English</Badge>
                    <Badge variant="outline" className="cursor-pointer">Türkçe</Badge>
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Notifications</Typography>
                  <Typography variant="caption" textColor="tertiary">
                    Notification preferences will be available after full authentication setup.
                  </Typography>
                </div>

                {/* Privacy */}
                <div className="space-y-2">
                  <Typography variant="bodySm" weight="medium">Privacy</Typography>
                  <Typography variant="caption" textColor="tertiary">
                    Privacy settings will be available after full authentication setup.
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </>
  );
}
