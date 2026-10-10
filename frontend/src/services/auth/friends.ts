import { api } from "@/src/lib/axios";

export interface Friend {
  id: number;
  username: string;
  bio: string | null;
  avatar_url: string | null;
}

export async function getFriends(): Promise<Friend[]> {
  const response = await api.get<Friend[]>("/users/me/friends");
  return response.data;
}

export async function searchUsers(username: string): Promise<Friend[]> {
  const response = await api.get<Friend[]>("/users/search", {
    params: { username },
  });

  return response.data;
}

export async function addFriend(userId: number): Promise<void> {
  await api.post(`/users/me/friends/${userId}`);
}

export async function removeFriend(userId: number): Promise<void> {
  await api.delete(`/users/me/friends/${userId}`);
}