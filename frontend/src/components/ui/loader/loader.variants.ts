import { cva } from "class-variance-authority";

export const loaderVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-10 w-10",
      },
      variant: {
        primary: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  },
);