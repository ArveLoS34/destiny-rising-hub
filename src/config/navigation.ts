import {
  Users,
  Sword,
  Package,
  Gem,
  FlaskConical,
  Shield,
  Map,
  Trophy,
  Newspaper,
  Calendar,
  BookOpen,
  Brain,
  MessageSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const mainNavigation: NavSection[] = [
  {
    title: "Database",
    items: [
      {
        label: "Characters",
        href: "/characters",
        icon: Users,
        description: "Browse all characters",
      },
      {
        label: "Weapons",
        href: "/weapons",
        icon: Sword,
        description: "Weapon database & stats",
      },
      {
        label: "Materials",
        href: "/materials",
        icon: Package,
        description: "Upgrade materials guide",
      },
      {
        label: "Artifacts",
        href: "/artifacts",
        icon: Gem,
        description: "Artifact sets & effects",
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        label: "Build Lab",
        href: "/build-lab",
        icon: FlaskConical,
        description: "Optimize your builds",
      },
      {
        label: "Team Builder",
        href: "/teams",
        icon: Shield,
        description: "Create synergistic teams",
      },
      {
        label: "Mission Planner",
        href: "/missions",
        icon: Map,
        description: "Plan your missions",
      },
      {
        label: "Tier List",
        href: "/tier-list",
        icon: Trophy,
        description: "Character rankings",
      },
    ],
  },
  {
    title: "Discover",
    items: [
      {
        label: "News",
        href: "/news",
        icon: Newspaper,
        description: "Latest updates",
      },
      {
        label: "Events",
        href: "/events",
        icon: Calendar,
        description: "Active & upcoming events",
      },
      {
        label: "Codex",
        href: "/codex",
        icon: BookOpen,
        description: "Game lore & guides",
      },
    ],
  },
  {
    title: "Advanced",
    items: [
      {
        label: "AI Advisor",
        href: "/ai-advisor",
        icon: Brain,
        description: "AI-powered recommendations",
        badge: "Beta",
      },
      {
        label: "Community",
        href: "/community",
        icon: MessageSquare,
        description: "Join the discussion",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        description: "App preferences",
      },
    ],
  },
];

export const mobileNavigation: NavItem[] = [
  { label: "Home", href: "/", icon: Users },
  { label: "Characters", href: "/characters", icon: Users },
  { label: "Build Lab", href: "/build-lab", icon: FlaskConical },
  { label: "Tier List", href: "/tier-list", icon: Trophy },
  { label: "More", href: "/discover", icon: BookOpen },
];
