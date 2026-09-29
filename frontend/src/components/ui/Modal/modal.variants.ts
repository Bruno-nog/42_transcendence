import { cva } from "class-variance-authority";

export const modalContentVariants = cva(
  "relative w-full rounded-lg bg-white p-6 shadow-xl transition-all duration-200 animate-in fade-in-0 zoom-in-95",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);