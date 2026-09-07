import { ElementType, HTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";
import { typographyVariants } from "./typography.variants";

export interface TypographyProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  /**
   * Permite alterar a tag HTML que será renderizada (ex: 'h1', 'p', 'span').
   * Se não for fornecida, a tag será inferida com base na variant.
   */
  as?: ElementType;
}