"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
} from "react";
import { X } from "lucide-react";

import { cn } from "../../../lib/cn";

import {
  ModalContentProps,
  ModalDescriptionProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalProps,
  ModalTitleProps,
} from "./modal.types";
import { modalContentVariants } from "./modal.variants";

// Contexto interno para compartilhar o evento onClose com os subcomponentes
const ModalContext = createContext<{ onClose: () => void } | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Componentes do Modal devem ser usados dentro de <Modal />");
  }
  return context;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
  closeOnEsc = true,
}: ModalProps) => {
  // Trata tecla ESC e previne scroll na página
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEsc) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ onClose }}>
      {/* Backdrop (Fundo Escuro) */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in-0"
        onClick={closeOnBackdropClick ? onClose : undefined}
      >
        {children}
      </div>
    </ModalContext.Provider>
  );
};

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, size, showCloseButton = true, children, onClick, ...props }, ref) => {
    const { onClose } = useModalContext();

    return (
      <div
        ref={ref}
        className={cn(modalContentVariants({ size }), className)}
        // Previne que o clique dentro do modal feche o backdrop
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        {...props}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Fechar"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
        {children}
      </div>
    );
  }
);
ModalContent.displayName = "ModalContent";

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}
      {...props}
    />
  )
);
ModalHeader.displayName = "ModalHeader";

export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
      {...props}
    />
  )
);
ModalTitle.displayName = "ModalTitle";

export const ModalDescription = forwardRef<
  HTMLParagraphElement,
  ModalDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0", className)}
      {...props}
    />
  )
);
ModalFooter.displayName = "ModalFooter";