import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "w-full rounded-md border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-600",
        error:
          "border-red-500 bg-white text-gray-900 placeholder:text-red-300 focus-visible:ring-red-500",
      },
      inputSize: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
      fullWidth: true,
    },
  }
);