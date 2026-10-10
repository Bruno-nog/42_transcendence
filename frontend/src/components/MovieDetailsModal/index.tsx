"use client";

import { Media } from "@/src/types/media";
import { useEffect, useState } from "react";
import { getFavorites, addFavorite, removeFavorite } from "@/src/services/auth/favorites";

interface MovieDetailsModalProps {
  movieId: string | null;
  onClose: () => void;
}

export function MovieDetailsModal({ movieId, onClose }: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    async function fetchMovieDetailsAndFavorites() {
      try {
        setLoading(true);
        setError(null);

        // Busca os detalhes do filme e a lista de favoritos em paralelo
        const [movieRes, favorites] = await Promise.all([
          fetch(`https://localhost:8000/movies/${movieId}`),
          getFavorites().catch(() => []), // Retorna vazio caso ocorra erro ao buscar favoritos
        ]);

        if (!movieRes.ok) {
          throw new Error("Erro ao carregar os detalhes do filme.");
        }

        const movieData = await resJsonOrNull(movieRes);
        setMovie(movieData);

        // Verifica se o filme atual já está na lista de favoritos do usuário usando o external_id
        const alreadyFavorite = favorites.some(
          (fav) => String(fav.external_id) === String(movieId)
        );
        setIsFavorite(alreadyFavorite);
      } catch (err: any) {
        setError(err.message || "Erro inesperado.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetailsAndFavorites();
  }, [movieId]);

  async function resJsonOrNull(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  const handleToggleFavorite = async () => {
    if (!movieId) return;
    try {
      setActionLoading(true);
      if (isFavorite) {
        await removeFavorite(movieId);
        setIsFavorite(false);
      } else {
        await addFavorite(movieId);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Erro ao alterar favorito:", err);
    } finally {
      setActionLoading(false);
    }
  };

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

            <div className="flex flex-col justify-between flex-1 gap-4">
              <div className="space-y-4">
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
                  <p className="text-sm text-zinc-300 leading-relaxed max-h-36 overflow-y-auto pr-2">
                    {movie.description || "Nenhuma sinopse disponível."}
                  </p>
                </div>
              </div>

              {/* Botão de Favoritar / Desfavoritar */}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-end">
                <button
                  onClick={handleToggleFavorite}
                  disabled={actionLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    isFavorite
                      ? "bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600/30"
                      : "bg-emerald-600 text-white hover:bg-emerald-500"
                  } disabled:opacity-50`}
                >
                  {isFavorite ? "♥ Remover dos Favoritos" : "♡ Adicionar aos Favoritos"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}