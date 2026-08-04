"use client";

import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = ({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        "z-[var(--z-tooltip)] overflow-hidden rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated))] px-3 py-1.5 text-xs text-[rgb(var(--color-text-primary))] shadow-[var(--shadow-md)]",
        className
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="fill-[rgb(var(--color-surface-elevated))]" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
