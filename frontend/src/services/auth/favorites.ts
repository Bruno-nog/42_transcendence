import { api } from "@/src/lib/axios";

export interface FavoriteMedia {
  id: number;
  external_id: string;
  media_type: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  release_year: number | null;
  genres: string | null;
  created_at: string;
}

export async function getFavorites(): Promise<FavoriteMedia[]> {
  const response = await api.get<FavoriteMedia[]>("/users/me/favorites");
  return response.data;
}

export async function addFavorite(externalId: string): Promise<void> {
  await api.post(`/users/me/favorites/${externalId}`);
}

export async function removeFavorite(externalId: string): Promise<void> {
  await api.delete(`/users/me/favorites/${externalId}`);
}