import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { type HTMLAttributes } from "react";

interface FooterProps extends HTMLAttributes<HTMLElement> {}

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] py-6",
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-[var(--container-2xl)] px-4 lg:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]">
              <span className="text-[10px] font-bold text-white">DR</span>
            </div>
            <span className="text-xs text-[rgb(var(--color-text-secondary))]">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[rgb(var(--color-text-tertiary))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
            >
              Discord
            </a>
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[rgb(var(--color-text-tertiary))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
            >
              Twitter
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[rgb(var(--color-text-tertiary))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
            >
              GitHub
            </a>
          </div>

          <div className="text-[10px] text-[rgb(var(--color-text-tertiary))]">
            v{siteConfig.version} • Game v{siteConfig.gameVersion}
          </div>
        </div>
      </div>
    </footer>
  );
}
