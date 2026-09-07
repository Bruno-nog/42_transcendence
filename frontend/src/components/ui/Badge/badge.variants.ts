import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-blue-100 text-blue-800 border border-transparent hover:bg-blue-200",
        secondary:
          "bg-gray-100 text-gray-800 border border-transparent hover:bg-gray-200",
        outline:
          "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50",
        success:
          "bg-green-100 text-green-800 border border-transparent hover:bg-green-200",
        warning:
          "bg-yellow-100 text-yellow-800 border border-transparent hover:bg-yellow-200",
        error:
          "bg-red-100 text-red-800 border border-transparent hover:bg-red-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);