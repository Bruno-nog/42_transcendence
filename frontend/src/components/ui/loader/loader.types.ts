import { VariantProps } from "class-variance-authority";
import { loaderVariants } from "./loader.variants";

export interface LoaderProps
  extends VariantProps<typeof loaderVariants> {
  className?: string;
}