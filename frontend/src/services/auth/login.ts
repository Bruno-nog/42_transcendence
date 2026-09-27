import { api } from "@/src/lib/axios";
import { LoginRequest, LoginResponse } from "@/src/types/auth";


export async function login(
  data: LoginRequest,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/login", data);

  return response.data;
}