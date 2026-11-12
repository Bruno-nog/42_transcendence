import { api } from "@/src/lib/axios";

export async function getFollowers(userId: number) {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data;
}

export async function getFollowing(userId: number) {
  const response = await api.get(`/users/${userId}/following`);
  return response.data;
}