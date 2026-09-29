import { forwardRef, ElementType } from "react";

import { cn } from "../../../lib/cn";

import { TypographyProps } from "./typography.types";
import { typographyVariants } from "./typography.variants";

// Mapeamento padrão de variantes para elementos HTML
const variantElementMap: Record<
  NonNullable<TypographyProps["variant"]>,
  ElementType
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body1: "p",
  body2: "p",
  caption: "span",
  label: "label",
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "body1", as, children, ...props }, ref) => {
    // Define a tag HTML a ser usada (prioriza 'as', senão busca no mapa padrão)
    const Component = as || (variant ? variantElementMap[variant] : "p");

    return (
      <Component
        ref={ref}
        className={cn(typographyVariants({ variant }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";