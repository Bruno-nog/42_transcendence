
import { api } from "@/src/lib/axios";

export interface FeedActivity {
  id: number;
  user_id: number;
  username: string;
  user_avatar: string | null;
  media_id: number;
  external_id: number;
  media_type: string;
  title: string;
  cover_url: string | null;
  release_year: number | null;
  review: string | null;
  rate: number;
  acting: number | null;
  direction: number | null;
  photography: number | null;
  screenplay: number | null;
  soundtrack: number | null;
  liked: boolean;
  likes: number;
  watched_before: boolean;
  date_film: string | null;
  created_at: string;
}

export async function getFeed(): Promise<FeedActivity[]> {
  const response = await api.get<FeedActivity[]>("/feed");

  return response.data;
}
