import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

const typographyVariants = cva("", {
  variants: {
    variant: {
      display: "text-display",
      h1: "text-h1",
      h2: "text-h2",
      h3: "text-h3",
      h4: "text-h4",
      bodyLg: "text-body-lg",
      body: "text-body",
      bodySm: "text-body-sm",
      caption: "text-caption",
      overline: "text-overline",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    textColor: {
      primary: "text-[rgb(var(--color-text-primary))]",
      secondary: "text-[rgb(var(--color-text-secondary))]",
      tertiary: "text-[rgb(var(--color-text-tertiary))]",
      disabled: "text-[rgb(var(--color-text-disabled))]",
      accent: "text-[rgb(var(--color-accent))]",
      success: "text-[rgb(var(--color-success))]",
      warning: "text-[rgb(var(--color-warning))]",
      error: "text-[rgb(var(--color-error))]",
      gradient: "gradient-text",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      true: "truncate",
    },
  },
  defaultVariants: {
    variant: "body",
    weight: "normal",
    textColor: "primary",
    align: "left",
  },
});

interface TypographyProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  variant?: "display" | "h1" | "h2" | "h3" | "h4" | "bodyLg" | "body" | "bodySm" | "caption" | "overline";
  weight?: "normal" | "medium" | "semibold" | "bold";
  textColor?: "primary" | "secondary" | "tertiary" | "disabled" | "accent" | "success" | "warning" | "error" | "gradient";
  align?: "left" | "center" | "right";
  truncate?: boolean;
}

const variantToElement: Record<string, "h1" | "h2" | "h3" | "h4" | "p" | "span"> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  bodyLg: "p",
  body: "p",
  bodySm: "p",
  caption: "span",
  overline: "span",
};

const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "body", as, weight, textColor, align, truncate, ...props }, ref) => {
    const Component = as || variantToElement[variant] || "p";

    return (
      <Component
        className={cn(typographyVariants({ variant, weight, textColor, align, truncate, className }))}
        ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
        {...props}
      />
    );
  }
);
Typography.displayName = "Typography";

export { Typography, typographyVariants };
export type { TypographyProps };
import { cva } from "class-variance-authority";
