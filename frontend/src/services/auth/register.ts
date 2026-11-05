import { api } from "@/src/lib/axios";

import { RegisterRequest, RegisterResponse } from "@/src/types/auth";

export async function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/register", data);

  return response.data;
}