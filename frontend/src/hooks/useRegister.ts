import { useMutation } from "@tanstack/react-query";

import { register } from "@/src/services/auth/register";

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}