import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "rounded-lg border bg-white text-gray-900 shadow-sm transition-all",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white",
        outline: "border-2 border-gray-300 bg-transparent shadow-none",
        ghost: "border-transparent bg-gray-50/50 shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);