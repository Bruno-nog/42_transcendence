"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Typography } from "@/src/components/ui/Typography";
import { useAuth } from "@/src/hooks/useAuth";
import { Loader } from "@/src/components/ui/loader";
import UserDashboard from "@/src/app/[locale]/Dashboard/page";
import Footer from "@/src/components/Fotter";
import { Media } from "@/src/types/media";
import { MovieDetailsModal } from "@/src/components/MovieDetailsModal";
import { MediaCard } from "@/src/components/media/MediaCard";
import SearchMovie from "@/src/components/SearchMovie";
import { LatestReviewsSection } from "@/src/components/LatestReviewsSection";
import { API_BASE_URL } from "@/src/utils/data";

export default function HomePage() {
  const t = useTranslations("Profile");
  const [dbMovies, setDbMovies] = useState<Media[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDbMovies() {
      try {
        const res = await fetch(`${API_BASE_URL}/media?limit=100`);
        if (res.ok) {
          const result = await res.json();
          setDbMovies(result);
        }
      } catch (err) {
        console.error("Erro ao carregar filmes do banco:", err);
      }
    }

    fetchDbMovies();
  }, []);

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#181d24]">
        <Loader />
      </div>
    );
  }

  if (isAuthenticated) {
    return <UserDashboard />;
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#14181f] text-white min-h-screen pb-12">
      <div className="w-full max-w-5xl px-6 py-10 flex flex-col gap-10">
          <SearchMovie />
        <main className="w-full max-w-6xl mx-auto flex flex-col items-center gap-10 px-4 sm:px-6 py-10">
          <section className="w-full space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
              <Typography variant="h3" className="text-lg font-bold text-white">
                {t("FEATURED_MOVIES")}
              </Typography>
            </div>

            <div className="w-full rounded-2xl bg-[#1e2530] p-4 sm:p-5">
              {dbMovies.length === 0 ? (
                <p className="text-sm text-gray-400">{t("ERROR_SERACH_MOVIE")}</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {dbMovies.slice(0, 4).map((movie) => (
                    <MediaCard
                      key={movie.id}
                      media={movie}
                      onClick={() => setSelectedMovieId(String(movie.external_id))}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="w-full">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
              <Typography variant="h3" className="text-sm font-semibold text-white">
                {t("LATEST_REVIEWS")}
              </Typography>
            </div>
            <LatestReviewsSection limit={4} />
          </section>

          <div className="py-4 text-center">
            <Typography variant="body1" className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {t("WRITE_AND_SHARE_REVIEWS_CREATE_YOUR_OWN_LISTS")}
              <br className="hidden sm:inline" />{" "}
              {t("SHARE_YOUR_LIFE_THROUGH_CINEMA")}
            </Typography>
          </div>

          <MovieDetailsModal
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}