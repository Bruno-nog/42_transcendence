import { HTMLAttributes, ReactNode } from "react";
import { VariantProps } from "class-variance-authority";
import { modalContentVariants } from "./modal.variants";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /**
   * Se true, permite fechar o modal clicando no fundo escuro (backdrop).
   * Padrão: true
   */
  closeOnBackdropClick?: boolean;
  /**
   * Se true, permite fechar o modal pressionando a tecla 'Escape'.
   * Padrão: true
   */
  closeOnEsc?: boolean;
}

export interface ModalContentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalContentVariants> {
  /**
   * Exibe ou esconde o botão padrão de fechar ('X') no canto superior direito.
   * Padrão: true
   */
  showCloseButton?: boolean;
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
export interface ModalDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}
export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {}