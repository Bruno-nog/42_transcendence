import { InputProps } from "../Input/input.types";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  /**
   * Opcional: permite customizar se o ícone de alternar senha deve ser visível ou não.
   * Por padrão é true.
   */
  showTogglePassword?: boolean;
}