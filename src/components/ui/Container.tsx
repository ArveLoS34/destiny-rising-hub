import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";

const containerVariants = cva("mx-auto w-full px-4", {
  variants: {
    size: {
      sm: "max-w-[var(--container-sm)]",
      md: "max-w-[var(--container-md)]",
      lg: "max-w-[var(--container-lg)]",
      xl: "max-w-[var(--container-xl)]",
      "2xl": "max-w-[var(--container-2xl)]",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    size: "2xl",
  },
});

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        className={cn(containerVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

export { Container, containerVariants };
export type { ContainerProps };
