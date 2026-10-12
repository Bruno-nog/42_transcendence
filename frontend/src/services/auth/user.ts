import { api } from "@/src/lib/axios";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface AvatarResponse {
  avatar_url: string;
}

export interface UserUpdate {
  username: string;
  bio: string | null;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await api.get<UserProfile>("/users/me");
  return response.data;
}

export async function updateCurrentUser(
  data: UserUpdate,
): Promise<UserProfile> {
  await api.patch("/users/me", data);
  return getCurrentUser();
}

export async function uploadAvatar(file: File): Promise<AvatarResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<AvatarResponse>(
    "/users/me/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}