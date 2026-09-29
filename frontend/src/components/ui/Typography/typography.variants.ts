import { cva } from "class-variance-authority";

export const typographyVariants = cva("font-sans", {
  variants: {
    variant: {
      h1: "text-4xl font-extrabold tracking-tight text-gray-900 lg:text-5xl text-white",
      h2: "text-3xl font-bold tracking-tight text-gray-900",
      h3: "text-2xl font-bold tracking-tight text-gray-900",
      h4: "text-xl font-semibold tracking-tight text-gray-900",
      body1: "text-base font-normal text-gray-700 leading-relaxed",
      body2: "text-sm font-normal text-gray-600 leading-relaxed",
      caption: "text-xs font-medium text-gray-500",
      label: "text-sm font-medium text-gray-800",
    },
  },
  defaultVariants: {
    variant: "body1",
  },
});