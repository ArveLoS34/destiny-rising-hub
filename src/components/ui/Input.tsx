"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type InputHTMLAttributes, forwardRef } from "react";

const inputVariants = cva(
  "flex w-full rounded-lg border bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[rgb(var(--color-text-tertiary))] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-[rgb(var(--color-border))] focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary)/0.3)]",
        filled:
          "border-transparent bg-[rgb(var(--color-surface-elevated))] focus:bg-[rgb(var(--color-surface-overlay))] focus:border-[rgb(var(--color-primary))]",
        ghost:
          "border-transparent focus:border-[rgb(var(--color-border))] focus:bg-[rgb(var(--color-surface-elevated))]",
      },
      inputSize: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "filled" | "ghost";
  inputSize?: "sm" | "md" | "lg";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
export type { InputProps };
