/**
 * Site-wide configuration for Destiny Rising Hub.
 */
export const siteConfig = {
  name: "Destiny Rising Hub",
  description:
    "The ultimate companion platform for Destiny Rising — character databases, build lab, team builder, mission planner, and more.",
  url: "https://destinyrisinghub.com",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/destinyrisinghub",
    discord: "https://discord.gg/destinyrisinghub",
    github: "https://github.com/destinyrisinghub",
  },
  version: "1.0.0",
  gameVersion: "1.0",
} as const;

export type SiteConfig = typeof siteConfig;
