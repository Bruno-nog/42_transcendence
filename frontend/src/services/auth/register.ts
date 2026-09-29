import { api } from "@/src/lib/axios";

import { RegisterRequest } from "@/src/types/auth";

export async function register(
  data: RegisterRequest,
) {
  const response = await api.post("/register", data);

  return response.data;
}