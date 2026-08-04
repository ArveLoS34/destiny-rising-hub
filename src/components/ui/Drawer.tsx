"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { type HTMLAttributes, forwardRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cva } from "class-variance-authority";

const drawerVariants = cva(
  "fixed z-[var(--z-modal)] bg-[rgb(var(--color-surface))] shadow-[var(--shadow-xl)] focus:outline-none",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-[rgb(var(--color-border))] rounded-b-xl",
        bottom: "inset-x-0 bottom-0 border-t border-[rgb(var(--color-border))] rounded-t-xl",
        left: "inset-y-0 left-0 border-r border-[rgb(var(--color-border))] rounded-r-xl",
        right: "inset-y-0 right-0 border-l border-[rgb(var(--color-border))] rounded-l-xl",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        full: "",
      },
    },
    compoundVariants: [
      { side: "top", size: "sm", className: "h-64" },
      { side: "top", size: "md", className: "h-96" },
      { side: "top", size: "lg", className: "h-[75vh]" },
      { side: "top", size: "full", className: "h-full" },
      { side: "bottom", size: "sm", className: "h-64" },
      { side: "bottom", size: "md", className: "h-96" },
      { side: "bottom", size: "lg", className: "h-[75vh]" },
      { side: "bottom", size: "full", className: "h-full" },
      { side: "left", size: "sm", className: "w-80" },
      { side: "left", size: "md", className: "w-96" },
      { side: "left", size: "lg", className: "w-[500px]" },
      { side: "left", size: "full", className: "w-full" },
      { side: "right", size: "sm", className: "w-80" },
      { side: "right", size: "md", className: "w-96" },
      { side: "right", size: "lg", className: "w-[500px]" },
      { side: "right", size: "full", className: "w-full" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
    },
  }
);

const slideVariants = {
  top: { hidden: { y: "-100%" }, visible: { y: 0 } },
  bottom: { hidden: { y: "100%" }, visible: { y: 0 } },
  left: { hidden: { x: "-100%" }, visible: { x: 0 } },
  right: { hidden: { x: "100%" }, visible: { x: 0 } },
};

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const Drawer = ({ open, onOpenChange, children, side, size, className }: DrawerProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[var(--z-modal)] bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={slideVariants[side || "right"]}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(drawerVariants({ side, size, className }))}
              >
                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

const DrawerHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn("flex flex-col gap-2 border-b border-[rgb(var(--color-border))] p-6", className)}
      ref={ref}
      {...props}
    />
  )
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Dialog.Title
      className={cn("text-lg font-semibold text-[rgb(var(--color-text-primary))]", className)}
      ref={ref}
      {...props}
    />
  )
);
DrawerTitle.displayName = "DrawerTitle";

const DrawerContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("overflow-y-auto p-6", className)} ref={ref} {...props} />
  )
);
DrawerContent.displayName = "DrawerContent";

const DrawerFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-[rgb(var(--color-border))] p-6",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerClose = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <Dialog.Close asChild>
      <button
        className={cn(
          "absolute right-4 top-4 rounded-md p-1.5 text-[rgb(var(--color-text-secondary))] transition-colors hover:bg-[rgb(var(--color-surface-elevated))] hover:text-[rgb(var(--color-text-primary))]",
          className
        )}
        ref={ref}
        {...props}
      >
        <X className="h-4 w-4" />
        {children && <span className="sr-only">{children}</span>}
      </button>
    </Dialog.Close>
  )
);
DrawerClose.displayName = "DrawerClose";

export {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
};
