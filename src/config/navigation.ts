import {
  Users,
  Sword,
  Package,
  FlaskConical,
  Shield,
  Map,
  Brain,
  MessageSquare,
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
        href: "/destiny-rising/characters",
        icon: Users,
        description: "Browse all characters",
      },
      {
        label: "Weapons",
        href: "/destiny-rising/weapons",
        icon: Sword,
        description: "Weapon database & stats",
      },
      {
        label: "Materials",
        href: "/destiny-rising/materials",
        icon: Package,
        description: "Upgrade materials guide",
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        label: "Build Lab",
        href: "/destiny-rising/build-lab",
        icon: FlaskConical,
        description: "Optimize your builds",
      },
      {
        label: "Team Builder",
        href: "/destiny-rising/teams",
        icon: Shield,
        description: "Create synergistic teams",
      },
      {
        label: "Mission Planner",
        href: "/destiny-rising/planner",
        icon: Map,
        description: "Plan your missions",
      },
    ],
  },
  {
    title: "Advanced",
    items: [
      {
        label: "AI Advisor",
        href: "/destiny-rising/ai-advisor",
        icon: Brain,
        description: "AI-powered recommendations",
        badge: "Beta",
      },
      {
        label: "Community",
        href: "/destiny-rising/community",
        icon: MessageSquare,
        description: "Join the discussion",
      },
    ],
  },
];

export const mobileNavigation: NavItem[] = [
  { label: "Home", href: "/", icon: Users },
  { label: "Characters", href: "/destiny-rising/characters", icon: Users },
  { label: "Build Lab", href: "/destiny-rising/build-lab", icon: FlaskConical },
  { label: "Teams", href: "/destiny-rising/teams", icon: Shield },
  { label: "Community", href: "/destiny-rising/community", icon: MessageSquare },
];
