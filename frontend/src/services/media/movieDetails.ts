import { api } from "@/src/lib/axios";
import { MediaDetails } from "@/src/types/media";

export async function getMovieDetails(
  tmdbId: number,
): Promise<MediaDetails> {
  const { data } = await api.get<MediaDetails>(`/movies/${tmdbId}`);

  return data;
}