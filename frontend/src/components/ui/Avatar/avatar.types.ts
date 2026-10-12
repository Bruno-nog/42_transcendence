import { HTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";
import { avatarVariants } from "./avatar.variants";

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /**
   * URL da imagem do avatar.
   */
  src?: string;
  /**
   * Texto alternativo da imagem.
   */
  alt?: string;
  /**
   * Nome da pessoa/entidade para geração automática de iniciais quando a imagem não for carregada.
   */
  name?: string;
}