import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[rgb(var(--color-text-primary))] sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
