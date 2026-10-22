import { PublicReview } from "@/src/components/LatestReviewsSection";
import { api } from "@/src/lib/axios";

export interface UserReview {
  id: number;
  user_id: number;
  media_id: number;
  external_id: string;
  media_type: string;
  title: string;
  cover_url: string | null;
  release_year: number | null;
  review: string | null;
  rate: number | null;
  acting: number | null;
  direction: number | null;
  photography: number | null;
  screenplay: number | null;
  soundtrack: number | null;
  liked: boolean;
  watched_before: boolean;
  date_film: string | null;
  created_at: string;
}

export interface ReviewPayload {
  mediaId: number;
  review: string;
  rate: number;
  acting: number;
  direction: number;
  photography: number;
  screenplay: number;
  soundtrack: number;
  like: boolean;
  whatchedBefore: boolean;
  dateFilm: string;
}

export async function getUserReviews(
  userId: number,
): Promise<UserReview[]> {
  const response = await api.get<UserReview[]>(
    `/reviews/users/${userId}`,
  );

  return response.data;
}

export async function getLatestReviews(
  limit: number = 4,
): Promise<PublicReview[]> {
  const response = await api.get<PublicReview[]>("/reviews", {
    params: { limit },
  });
  return response.data;
}

export async function createReview(
  data: ReviewPayload,
): Promise<UserReview> {
  const response = await api.post<UserReview>("/reviews", data);
  return response.data;
}

export async function updateReview(
  reviewId: number,
  data: ReviewPayload,
): Promise<UserReview> {
  const response = await api.patch<UserReview>(
    `/reviews/${reviewId}`,
    data,
  );
  return response.data;
}

export async function deleteReview(reviewId: number): Promise<void> {
  await api.delete(`/reviews/${reviewId}`);
}