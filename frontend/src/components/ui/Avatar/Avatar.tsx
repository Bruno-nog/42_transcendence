"use client";

import { forwardRef, useState } from "react";
import { User } from "lucide-react";

import { cn } from "../../../lib/cn";

import { AvatarProps } from "./avatar.types";
import { avatarVariants } from "./avatar.variants";

/**
 * Função utilitária para extrair até duas iniciais de um nome.
 * Exemplo: "João Silva" -> "JS"
 */
function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, name, children, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    const hasImage = Boolean(src && !imageError);
    const initials = getInitials(name);

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {hasImage ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : children ? (
          children
        ) : (
          <User className="h-1/2 w-1/2 text-gray-400" />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";