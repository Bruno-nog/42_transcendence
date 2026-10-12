import { forwardRef } from "react";

import { cn } from "../../../lib/cn";

import { BadgeProps } from "./badge.types";
import { badgeVariants } from "./badge.variants";

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="mr-1 inline-flex shrink-0">{icon}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";