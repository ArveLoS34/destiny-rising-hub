import { cn } from "@/lib/utils";
import { type ImgHTMLAttributes, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";

const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
        "2xl": "h-20 w-20 text-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const initials = fallback || alt?.charAt(0).toUpperCase() || "?";

    if (!src) {
      return (
        <span
          className={cn(
            avatarVariants({ size }),
            "bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))]"
          )}
        >
          {initials}
        </span>
      );
    }

    return (
      <img
        className={cn(avatarVariants({ size, className }))}
        src={src}
        alt={alt}
        ref={ref}
        {...props}
      />
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
export type { AvatarProps };
