import { api } from "@/src/lib/axios";

export interface FollowUser {
  id: number;
  username: string;
  avatar_url: string | null;
}

export async function getFollowers(userId: number) {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data;
}

export async function getFollowing(userId: number): Promise<FollowUser[]> {
  const response = await api.get(`/users/${userId}/following`);
  return response.data;
}

export async function followUser(userId: number) {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
}

export async function unfollowUser(userId: number) {
  const response = await api.delete(`/users/${userId}/follow`);
  return response.data;
}