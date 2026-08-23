import { cn } from "@/lib/utils";

/**
 * Reusable cinematic hero frame. The background is an original CSS/SVG
 * scene (glowing moon, starfield, atmosphere gradient) — deliberately not
 * a reproduction of any Bungie/NetEase key art, to keep the site free of
 * copyrighted third-party artwork while still reading as "premium sci-fi".
 */
export function Hero({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[rgb(var(--color-border))]",
        "min-h-[420px] sm:min-h-[480px] lg:min-h-[560px]",
        className
      )}
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 70% 20%, rgb(var(--color-primary) / 0.16), transparent 60%), radial-gradient(ellipse 70% 50% at 15% 90%, rgb(var(--color-accent) / 0.10), transparent 60%), linear-gradient(180deg, rgb(var(--color-background-alt)) 0%, rgb(var(--color-background)) 100%)",
        }}
      />

      {/* Glowing moon */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full sm:h-[520px] sm:w-[520px]"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgb(226 232 240 / 0.9), rgb(148 163 184 / 0.35) 45%, transparent 70%)",
          boxShadow: "0 0 120px 40px rgb(139 92 246 / 0.12)",
        }}
      />

      {/* Starfield */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-70" aria-hidden="true">
        <defs>
          <pattern id="dr-stars" width="140" height="140" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="20" r="1" fill="white" opacity="0.5" />
            <circle cx="60" cy="70" r="1.3" fill="white" opacity="0.35" />
            <circle cx="110" cy="30" r="0.8" fill="white" opacity="0.6" />
            <circle cx="90" cy="110" r="1" fill="white" opacity="0.3" />
            <circle cx="30" cy="100" r="0.9" fill="white" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dr-stars)" />
      </svg>

      {/* Bottom fade so content stays readable */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[rgb(var(--color-background))] via-[rgb(var(--color-background)/0.55)] to-transparent" />

      {/* Fine grid, very low opacity, for texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative flex h-full min-h-[420px] flex-col justify-end p-6 sm:min-h-[480px] sm:p-10 lg:min-h-[560px] lg:p-14">
        {children}
      </div>
    </section>
  );
}
