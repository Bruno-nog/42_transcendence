"use client";

import { forwardRef, useState } from "react";
// Importe seus ícones preferidos (ex: lucide-react, react-icons, etc.)
import { Eye, EyeOff } from "lucide-react";

import { cn } from "../../../lib/cn";
import { Input } from "../Input/Input";

import { PasswordInputProps } from "./password-input.types";

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showTogglePassword = true, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          disabled={disabled}
          className={cn(showTogglePassword && "pr-10", className)}
          {...props}
        />
        {showTogglePassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            className="absolute right-3 top-[38px] -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";