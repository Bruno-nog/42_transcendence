import { HTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";
import { badgeVariants } from "./badge.variants";

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Ícone opcional exibido no lado esquerdo do texto.
   */
  icon?: React.ReactNode;
}