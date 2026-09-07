import { useMutation } from "@tanstack/react-query";

import { login } from "@/src/services/auth/login";

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}