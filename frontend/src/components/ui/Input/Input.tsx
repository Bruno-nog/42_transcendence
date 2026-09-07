import { forwardRef } from "react";

import { cn } from "../../../lib/cn";

import { InputProps } from "./input.types";
import { inputVariants } from "./input.variants";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      fullWidth,
      error,
      helperText,
      label,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = error ? "error" : variant;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          disabled={disabled}
          className={cn(
            inputVariants({
              variant: resolvedVariant,
              inputSize,
              fullWidth,
            }),
            className
          )}
          {...props}
        />
        {helperText && (
          <span
            className={cn(
              "text-xs",
              error ? "text-red-500" : "text-gray-500"
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";