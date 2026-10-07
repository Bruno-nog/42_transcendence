"use client";
import { useEffect, useState } from "react";

import { Typography } from "@/src/components/ui/Typography";
import { Avatar } from "@/src/components/ui/Avatar";
import { useAuth } from "@/src/hooks/useAuth";
import { Loader } from "@/src/components/ui/loader";
import UserDashboard from "../Dashboard/page";
import Footer from "@/src/components/Fotter";
import { Media } from "@/src/types/media";
import { MovieDetailsModal } from "@/src/components/MovieDetailsModal";
import { MediaCard } from "@/src/components/media/MediaCard";
import SearchMovie from "@/src/components/SearchMovie";

export default function HomePage() {
  const [dbMovies, setDbMovies] = useState<Media[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  // Busca os filmes cadastrados no banco de dados
  useEffect(() => {
    async function fetchDbMovies() {
      try {
        const res = await fetch("https://localhost:8000/movies?limit=100");
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
    <div className="min-h-screen bg-[#181d24] text-white">

      <SearchMovie />

      <main className="flex w-full flex-col items-center justify-center gap-10 px-6 py-10">
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
            <Typography variant="h3" className="text-lg font-bold text-white">
              Filmes em Destaques
            </Typography>
          </div>

          <div className="w-full rounded-2xl bg-[#1e2530] p-5">
            {dbMovies.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum filme cadastrado ainda.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

        <section className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
            <Typography variant="h3" className="text-lg font-bold text-white">
              Acabei de analisar...
            </Typography>
          </div>

          <div className="w-full rounded-2xl bg-[#1e2530] p-5">
            {dbMovies.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum filme cadastrado ainda.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {dbMovies
                  .slice(4, 8)
                  .map((movie) => (
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

        <div className="py-6 text-center">
          <Typography variant="body1" className="text-base text-gray-300">
            Escreva e compartilhe resenhas. Crie suas próprias listas.
            <br />
            Compartilhe sua vida através do cinema.
          </Typography>
        </div>

        <div className="flex justify-baseline gap-80">
          <section className="flex flex-col justify-between gap-5">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
              <Typography variant="h3" className="text-base font-bold text-white">
                Avaliações mais populares desta semana
              </Typography>
            </div>

            <div className="flex flex-col gap-5">
              {[1, 2].map((item) => (
                <div key={item} className="flex gap-4 rounded-xl bg-[#2b3342] p-4">
                  <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded bg-gray-700">
                    <img src="/f7.png" alt="Poster" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Typography variant="h4" className="text-sm font-bold text-white">
                        A Odisseia
                      </Typography>
                      <Typography
                        variant="body2"
                        className="mt-1 line-clamp-2 text-xs text-gray-400"
                      >
                        Agamemnon estava nos portões da frente de Troia, movendo-se como Darth Vader...
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Avatar name="Usuário" size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
              <Typography variant="h3" className="text-base font-bold text-white">
                Listas populares
              </Typography>
            </div>

            <div className="flex flex-col gap-5">
              <div className="h-28 w-50 overflow-hidden rounded-xl bg-gray-800">
                <img src="/f5.png" alt="Lista 1" className="h-full w-full object-cover" />
              </div>
              <div className="h-28 w-50 overflow-hidden rounded-xl bg-gray-800">
                <img src="/f6.png" alt="Lista 2" className="h-full w-full object-cover" />
              </div>
            </div>
          </section>
        </div>

        <MovieDetailsModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      </main>

      <Footer />
    </div>
  );
}