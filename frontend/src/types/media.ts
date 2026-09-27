export interface Media {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  adult: boolean;
  video: boolean;
}