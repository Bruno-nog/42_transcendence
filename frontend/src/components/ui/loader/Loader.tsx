import { cn } from "../../../lib/cn";

import { LoaderProps } from "./loader.types";
import { loaderVariants } from "./loader.variants";

export function Loader({
  size,
  variant,
  className,
}: LoaderProps) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={cn(
        loaderVariants({
          size,
          variant,
        }),
        className,
      )}
    />
  );
}