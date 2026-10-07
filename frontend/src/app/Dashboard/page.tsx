"use client";

import { useState, useEffect } from "react";

import { Typography } from "@/src/components/ui/Typography";
import { Avatar } from "@/src/components/ui/Avatar";
import { useAuth } from "@/src/hooks/useAuth";
import { Loader } from "@/src/components/ui/loader";
import Footer from "@/src/components/Fotter";
import { MediaCard } from "@/src/components/media/MediaCard";
import { Media } from "@/src/types/media";
import SearchMovie from "@/src/components/SearchMovie";
import { MovieDetailsModal } from "@/src/components/MovieDetailsModal";

export default function HomePage() {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [dbMovies, setDbMovies] = useState<Media[]>([]);

  const { isAuthenticated, isLoading } = useAuth();

  // Busca os filmes cadastrados no banco de dados
  useEffect(() => {
    async function fetchDbMovies() {
      try {
        const res = await fetch("https://localhost:8000/movies?limit=8");
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

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#14181f]">
        <Loader />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="w-full flex flex-col items-center bg-[#14181f] text-white min-h-screen pb-12">

      <div className="w-full max-w-5xl px-6 py-10 flex flex-col gap-10">

        <SearchMovie />

        <section className="space-y-3">
          <div className="flex items-center gap-2 border-l-2 border-[#2ECC71] pl-2">
            <Typography variant="h3" className="text-sm font-semibold text-white">
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

        <section className="space-y-3">
          <div className="flex items-center gap-2 border-l-2 border-[#2ECC71] pl-2">
            <Typography variant="h3" className="text-sm font-semibold text-white">
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

        <div className="py-4 text-center">
          <Typography variant="body1" className="text-sm text-gray-300 leading-relaxed font-normal">
            Escreva e compartilhe resenhas. Crie suas próprias listas.
            <br />
            Compartilhe sua vida através do cinema.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-start">

          {/* Coluna Esquerda: Avaliações */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-l-2 border-[#2ECC71] pl-2">
              <Typography variant="h3" className="text-sm font-semibold text-white">
                Avaliações mais populares desta semana
              </Typography>
            </div>

            <div className="flex flex-col gap-4">
              {[1, 2].map((item) => (
                <div key={item} className="relative flex gap-3 rounded-2xl bg-[#d9d9d9] text-gray-900 p-3.5 shadow-sm">
                  <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-400">
                    <img src="/f7.png" alt="Poster" className="h-full w-full object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between pr-8">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">A Odisseia</h4>
                      <p className="mt-1 text-[11px] text-gray-600 line-clamp-2 leading-tight">
                        Agamemnon estava nos portões da frente de Troia, movendo-se como Darth Vader...
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Avatar name="Usuário" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="hidden md:block w-[1px] bg-gray-700/60 self-stretch my-2" />

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-l-2 border-[#2ECC71] pl-2">
              <Typography variant="h3" className="text-sm font-semibold text-white">
                Listas populares
              </Typography>
            </div>

            <div className="flex flex-col gap-4">
              <div className="h-24 w-full overflow-hidden rounded-xl bg-gray-800">
                <img src="/f5.png" alt="Lista 1" className="h-full w-full object-cover" />
              </div>
              <div className="h-24 w-full overflow-hidden rounded-xl bg-gray-800">
                <img src="/f6.png" alt="Lista 2" className="h-full w-full object-cover" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <MovieDetailsModal
        movieId={selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
      />

      <Footer/>
    </div>
    )
  }
}