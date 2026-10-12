export interface Media {
  id: number;
  external_id: string;
  media_type: string;
  title: string;
  description: string;
  cover_url: string;
  release_year: number;
  genres?: string;
  vote_average?: number;
}
