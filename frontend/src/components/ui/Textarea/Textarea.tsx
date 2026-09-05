import { forwardRef } from "react";

import { cn } from "../../../lib/cn";

import { TextareaProps } from "./textarea.types";
import { textareaVariants } from "./textarea.variants";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      fullWidth,
      error,
      helperText,
      label,
      id,
      disabled,
      rows = 4,
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
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            textareaVariants({
              variant: resolvedVariant,
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

Textarea.displayName = "Textarea";