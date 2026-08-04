"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { type ButtonHTMLAttributes, type HTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

const modalVariants = cva(
  "fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4",
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[90vw]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const Modal = ({ open, onOpenChange, children, className, size }: ModalProps) => {
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
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                  "fixed left-1/2 top-1/2 z-[var(--z-modal)] w-full -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-[var(--shadow-xl)] focus:outline-none",
                  modalVariants({ size, className })
                )}
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

const ModalHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn("flex flex-col gap-2 border-b border-[rgb(var(--color-border))] p-6", className)}
      ref={ref}
      {...props}
    />
  )
);
ModalHeader.displayName = "ModalHeader";

const ModalTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Dialog.Title
      className={cn("text-lg font-semibold text-[rgb(var(--color-text-primary))]", className)}
      ref={ref}
      {...props}
    />
  )
);
ModalTitle.displayName = "ModalTitle";

const ModalDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Dialog.Description
      className={cn("text-sm text-[rgb(var(--color-text-secondary))]", className)}
      ref={ref}
      {...props}
    />
  )
);
ModalDescription.displayName = "ModalDescription";

const ModalContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("p-6", className)} ref={ref} {...props} />
  )
);
ModalContent.displayName = "ModalContent";

const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
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
ModalFooter.displayName = "ModalFooter";

const ModalClose = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
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
ModalClose.displayName = "ModalClose";

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
  ModalClose,
};
