import { InputHTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";
import { inputVariants } from "./input.variants";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  helperText?: string;
  label?: string;
}