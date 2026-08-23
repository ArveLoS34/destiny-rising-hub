import { EmptyState } from "@/components/ui/EmptyState";
import { ShieldAlert } from "lucide-react";

/**
 * Standard "no fabricated data" state. Use this — never placeholder/fake
 * content — anywhere the underlying dataset has no verified entries yet.
 */
export function DataUnavailable({
  title = "Data not yet available",
  description = "This section is waiting on verified Destiny: Rising data. We don't publish unverified or placeholder information.",
  size = "md" as const,
}: {
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <EmptyState
      icon={ShieldAlert}
      title={title}
      description={description}
      size={size}
    />
  );
}
