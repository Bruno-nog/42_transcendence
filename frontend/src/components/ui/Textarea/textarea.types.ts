import { TextareaHTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";
import { textareaVariants } from "./textarea.variants";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: boolean;
  helperText?: string;
  label?: string;
}