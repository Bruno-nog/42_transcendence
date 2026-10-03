"use client";

import { Media } from "@/src/types/media";
import { useEffect, useState } from "react";

interface MovieDetailsModalProps {
  movieId: string | null;
  onClose: () => void;
}

export function MovieDetailsModal({ movieId, onClose }: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;

    async function fetchMovieDetails() {
      try {
        setLoading(true);
        setError(null);
        // Ajuste a URL do seu backend FastAPI se necessário
        const res = await fetch(`https://localhost:8000/movies/${movieId}`);

        if (!res.ok) {
          throw new Error("Erro ao carregar os detalhes do filme.");
        }

        const data = await res.json();
        setMovie(data);
      } catch (err: any) {
        setError(err.message || "Erro inesperado.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [movieId]);

  if (!movieId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-zinc-900 text-white shadow-2xl border border-zinc-800">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
        >
          ✕
        </button>

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <p className="text-zinc-400">Carregando detalhes...</p>
          </div>
        )}

        {error && (
          <div className="flex h-64 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={onClose}
              className="rounded bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700"
            >
              Fechar
            </button>
          </div>
        )}

        {!loading && !error && movie && (
          <div className="flex flex-col gap-6 p-6 sm:flex-row">
            {movie.cover_url && (
              <div className="w-full sm:w-48 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
                <img
                  src={movie.cover_url}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {movie.title}
                </h2>
                {movie.release_year && (
                  <span className="text-sm font-medium text-zinc-400">
                    {movie.release_year}
                  </span>
                )}
              </div>

              {movie.genres && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.split(", ").map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <h3 className="text-sm font-semibold uppercase text-zinc-400">
                  Sinopse
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {movie.description || "Nenhuma sinopse disponível."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}