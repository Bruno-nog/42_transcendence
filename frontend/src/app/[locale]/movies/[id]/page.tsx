"use client";

import { useEffect, useState, use } from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Fotter";
import { Media } from "@/src/types/media";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "@/src/components/ui/button";
import { Star, Heart, MessageSquare, Bookmark } from "lucide-react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/src/services/auth/favorites";
import { ReviewModal } from "@/src/components/ReviewModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MovieDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const API_BASE_URL = "https://localhost:8000";

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setLoading(true);
        const [res, favorites] = await Promise.all([
          fetch(`${API_BASE_URL}/media/${id}`),
          getFavorites().catch(() => []),
        ]);

        if (!res.ok) {
          throw new Error("Filme não encontrado.");
        }

        const data = await res.json();
        setMovie(data);

        const alreadyFavorite = favorites.some(
          (fav) => String(fav.external_id) === String(id) || String(fav.id) === String(id)
        );
        setIsFavorite(alreadyFavorite);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar filme.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!movie) return;
    try {
      setActionLoading(true);
      if (isFavorite) {
        await removeFavorite(String(movie.external_id || movie.id));
        setIsFavorite(false);
      } else {
        await addFavorite(String(movie.external_id || movie.id));
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Erro ao favoritar:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181d24] text-white flex flex-col justify-between">
        <Header />
        <div className="py-20 text-center text-gray-400 text-sm">Carregando filme...</div>
        <Footer />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#181d24] text-white flex flex-col justify-between">
        <Header />
        <div className="py-20 text-center text-red-400 text-sm">{error || "Filme não encontrado."}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181d24] text-[#9ab] flex flex-col items-center justify-between">
      <Header bannerUrl={movie.cover_url} />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center gap-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center">
            <div className="w-full rounded-lg overflow-hidden border border-[#2c3440] shadow-2xl bg-[#1e2530]">
              <img
                src={movie.cover_url || "/placeholder-poster.png"}
                alt={movie.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-6 flex flex-col gap-4">
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {movie.title}
                </h1>
                {movie.release_year && (
                  <span className="text-lg text-gray-400 font-medium">
                    {movie.release_year}
                  </span>
                )}
              </div>
            </div>

            {movie.genres && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.split(", ").map((genre) => (
                  <span
                    key={genre}
                    className="text-xs uppercase tracking-wider font-semibold bg-[#202832] text-gray-300 px-2.5 py-1 rounded border border-[#2c3440]"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-[#2c3440] pt-4">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-2">
                Sinopse
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {movie.description || "Nenhuma sinopse cadastrada para este filme."}
              </p>
            </div>
          </div>

          <div className="md:col-span-12 lg:col-span-3 bg-[#1e2530] border border-[#2c3440] rounded-xl p-4 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-around border-b border-[#2c3440] pb-3 text-gray-400">
              <div className="flex flex-col items-center gap-1">
                <Star size={18} className="text-amber-400" />
                <span className="text-white font-semibold text-sm">4.2</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Heart size={18} className="text-red-500" />
                <span className="text-gray-300">Favorito</span>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setReviewModalOpen(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} /> Avaliar / Escrever Review
                </Button>

                <Button
                  onClick={handleToggleFavorite}
                  disabled={actionLoading}
                  className={`w-full py-2 rounded font-semibold flex items-center justify-center gap-2 border transition ${
                    isFavorite
                      ? "bg-red-600/20 border-red-600/50 text-red-400 hover:bg-red-600/30"
                      : "bg-[#202832] border-[#2c3440] text-gray-300 hover:text-white hover:bg-[#2c3440]"
                  }`}
                >
                  <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
                  {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                </Button>
              </div>
            ) : (
              <p className="text-center text-gray-400">
                Faça login para avaliar ou favoritar este filme.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {movie && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          movieId={movie.id}
          movieTitle={movie.title}
          onReviewChanged={() => {
            setReviewModalOpen(false);
          }}
        />
      )}
    </div>
  );
}