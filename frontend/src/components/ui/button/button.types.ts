import { ButtonHTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";

import { buttonVariants } from "./button.variants";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}