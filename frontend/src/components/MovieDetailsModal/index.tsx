"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/src/i18n/routing";
import { Media } from "@/src/types/media";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/src/services/auth/favorites";
import { useAuth } from "@/src/hooks/useAuth";
import { ReviewModal } from "../ReviewModal";
import { Button } from "../ui/button";

interface MovieDetailsModalProps {
  movieId: string | null;
  onClose: () => void;
}

export function MovieDetailsModal({
  movieId,
  onClose,
}: MovieDetailsModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setMovie(null);
      return;
    }

    async function fetchMovieDetailsAndFavorites() {
      try {
        setLoading(true);
        setError(null);

        const [movieRes, favorites] = await Promise.all([
          fetch(`https://localhost:8000/movies/${movieId}`),
          getFavorites().catch(() => []),
        ]);

        if (!movieRes.ok) {
          throw new Error("Erro ao carregar os detalhes do filme.");
        }

        const movieData = await movieRes.json();
        setMovie(movieData);

        const alreadyFavorite = favorites.some(
          (favorite) => String(favorite.external_id) === String(movieId)
        );
        setIsFavorite(alreadyFavorite);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro inesperado."
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchMovieDetailsAndFavorites();
  }, [movieId]);

  useEffect(() => {
    if (!notification) return;

    const timeoutId = window.setTimeout(() => {
      setNotification(null);
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

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

  const handleGoToMoviePage = () => {
    if (!movie) return;
    onClose();
    router.push(`/movies/${movie.external_id || movie.id}`);
  };

  if (!movieId) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-white shadow-2xl">
          <Button
            onClick={onClose}
            aria-label="Fechar detalhes do filme"
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          >
            ✕
          </Button>

          {loading && (
            <div className="flex h-64 items-center justify-center">
              <p className="text-zinc-400">Carregando detalhes...</p>
            </div>
          )}

          {error && (
            <div className="flex h-64 flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-red-400">{error}</p>
              <Button
                onClick={onClose}
                className="rounded bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700"
              >
                Fechar
              </Button>
            </div>
          )}

          {!loading && !error && movie && (
            <div className="flex flex-col gap-6 p-6 sm:flex-row">
              {movie.cover_url && (
                <div className="w-full flex-shrink-0 overflow-hidden rounded-lg bg-surface sm:w-48">
                  <img
                    src={movie.cover_url}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between gap-4">
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
                    <p className="max-h-36 overflow-y-auto pr-2 text-sm leading-relaxed text-zinc-300">
                      {movie.description || "Nenhuma sinopse disponível."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-4">
                  <Button
                    onClick={handleGoToMoviePage}
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
                  >
                    Ver página completa →
                  </Button>

                  {isAuthenticated && (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setReviewModalOpen(true)}
                        className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-800"
                      >
                        Avaliar
                      </Button>

                      <Button
                        onClick={handleToggleFavorite}
                        disabled={actionLoading}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                          isFavorite
                            ? "border border-red-600/50 bg-red-600/20 text-red-400 hover:bg-red-600/30"
                            : "bg-emerald-600 text-white hover:bg-emerald-500"
                        }`}
                      >
                        {isFavorite ? "♥ Favorito" : "♡ Favoritar"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[70] flex items-center rounded-xl border border-emerald-500/30 bg-zinc-900 px-4 py-3 text-sm text-white shadow-2xl"
        >
          <span className="mr-2 text-emerald-400">✓</span>
          {notification}

          <button
            type="button"
            onClick={() => setNotification(null)}
            className="ml-4 text-zinc-400 hover:text-white"
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>
      )}

      {movie && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          movieId={movie.id}
          movieTitle={movie.title}
          onReviewChanged={(message) => {
            setNotification(message);
            setReviewModalOpen(false);
          }}
        />
      )}
    </>
  );
}