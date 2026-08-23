import { cn } from "@/lib/utils";

type Rarity = "common" | "rare" | "legendary" | "mythic" | string;

const rarityStyles: Record<string, string> = {
  common:
    "border-[rgb(var(--color-rarity-common)/0.35)] bg-[rgb(var(--color-rarity-common)/0.12)] text-[rgb(var(--color-rarity-common))]",
  rare: "border-[rgb(var(--color-rarity-rare)/0.35)] bg-[rgb(var(--color-rarity-rare)/0.12)] text-[rgb(var(--color-rarity-rare))]",
  legendary:
    "border-[rgb(var(--color-rarity-legendary)/0.4)] bg-[rgb(var(--color-rarity-legendary)/0.14)] text-[rgb(var(--color-rarity-legendary))]",
  mythic:
    "border-[rgb(var(--color-rarity-mythic)/0.45)] bg-[rgb(var(--color-rarity-mythic)/0.16)] text-[rgb(var(--color-rarity-mythic))]",
};

export function RarityBadge({
  rarity,
  className,
}: {
  rarity: Rarity;
  className?: string;
}) {
  const key = String(rarity).toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        rarityStyles[key] ?? rarityStyles.common,
        className
      )}
    >
      {rarity}
    </span>
  );
}
