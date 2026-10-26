
import { api } from "@/src/lib/axios";
import { Media } from "@/src/types/media";

export type Recommendation = Media & {
  matched_genres: string[];
  recommendation_score: number;
  reason: string;
};

export type RecommendationsResponse = {
  recommendations: Recommendation[];
  message?: string;
};

export async function getRecommendations(): Promise<RecommendationsResponse> {
  const { data } = await api.get<RecommendationsResponse>(
    "/users/me/recommendations",
  );

  return data;
}
