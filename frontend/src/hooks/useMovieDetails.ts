"use client";

import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../services/media/movieDetails";


export function useMovieDetails(tmdbId: number | null) {
  return useQuery({
    queryKey: ["movie-details", tmdbId],
    queryFn: () => getMovieDetails(tmdbId!),
    enabled: tmdbId !== null,
  });
}