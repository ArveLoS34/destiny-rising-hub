import Image from "next/image";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { cva } from "class-variance-authority";

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

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ size = "md", src, alt, fallback, className, ...props }, ref) => {
    const initials = fallback || alt?.charAt(0).toUpperCase() || "?";

    if (!src) {
      return (
        <span
          ref={ref}
          className={cn(
            avatarVariants({ size }),
            "bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-secondary))]",
            className
          )}
          {...props}
        >
          {initials}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
        {...props}
      >
        <Image
          src={src}
          alt={alt || ""}
          fill
          className="object-cover"
          sizes="80px"
        />
      </span>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
export type { AvatarProps };
