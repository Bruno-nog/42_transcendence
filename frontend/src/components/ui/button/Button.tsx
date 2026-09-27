import { forwardRef } from "react";

import { cn } from "../../../lib/cn";
import { Loader } from "../loader/Loader";

import { ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      fullWidth,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
          }),
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader
            size="sm"
            variant="white"
          />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";