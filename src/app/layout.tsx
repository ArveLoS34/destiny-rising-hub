import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import { CommandPaletteProvider } from "@/components/providers/CommandPaletteProvider";
import { siteConfig } from "@/config/site";
import "./globals.css";

// ─── Fonts ───
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─── Metadata ───
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Destiny Rising",
    "game guide",
    "character database",
    "build planner",
    "team builder",
    "tier list",
  ],
  authors: [{ name: "Destiny Rising Hub Team" }],
  creator: "Destiny Rising Hub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ─── Root Layout ───
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[rgb(var(--color-background))] text-[rgb(var(--color-text-primary))]">
        <Providers>
          <ErrorBoundary>
            <AppShell>{children}</AppShell>
            <CommandPaletteProvider />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
