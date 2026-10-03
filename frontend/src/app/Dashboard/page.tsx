"use client";

import { Typography } from "@/src/components/ui/Typography";
import { Avatar } from "@/src/components/ui/Avatar";
import { useAuth } from "@/src/hooks/useAuth";
import { Loader } from "@/src/components/ui/loader";
import Footer from "@/src/components/Fotter";
import { useState } from "react";
import { useSearchMedia } from "@/src/hooks/useSearchMedia";
import { MediaCard } from "@/src/components/media/MediaCard";

export default function HomePage() {
  const [title, setTitle] = useState("");

  const { mutate, data, isPending, error } = useSearchMedia();

  function handleSearch() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    mutate(trimmedTitle);
  }

  const featuredMovies = [
    { title: "Avatar", image: "/f1.png" },
    { title: "Zero a Direita", image: "/f2.png" },
    { title: "Pânico VI", image: "/f3.png" },
    { title: "Vingadores", image: "/f4.png" },
  ];

  const { isAuthenticated, isLoading } = useAuth();

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

      {/* --- CONTEÚDO PRINCIPAL (CONTAINER CENTRALIZADO) --- */}
      <div className="w-full max-w-5xl px-6 py-10 flex flex-col gap-10">

       <section className="mx-auto max-w-container">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-bold text-white">
            Descubra filmes
          </h1>

          <p className="text-muted">
            Pesquise por um filme para começar.
          </p>
        </div>

        <div className="flex max-w-2xl gap-3">
          <input
            type="text"
            placeholder="Digite o nome de um filme"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            className="h-11 flex-1 rounded-md border border-border bg-surface px-4 text-white outline-none placeholder:text-muted focus:border-primary"
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={isPending}
            className="h-11 rounded-md bg-primary px-6 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error && (
          <p className="mt-6 text-danger">
            Não foi possível encontrar o filme.
          </p>
        )}

        {data && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Resultado
            </h2>

            <MediaCard media={data} />
          </section>
        )}
      </section>

        {/* Filmes em Destaques */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-l-2 border-[#2ECC71] pl-2">
            <Typography variant="h3" className="text-sm font-semibold text-white">
              Filmes em Destaques 2
            </Typography>
          </div>

          <div className="w-full rounded-2xl bg-[#1e2530] p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featuredMovies.map((movie, index) => (
                <div
                  key={index}
                  className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105 shadow-md"
                >
                  <img src={movie.image} alt={movie.title} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Acabei de analisar... */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-l-2 border-[#2ECC71] pl-2">
            <Typography variant="h3" className="text-sm font-semibold text-white">
              Acabei de analisar...
            </Typography>
          </div>

          <div className="w-full rounded-2xl bg-[#1e2530] p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featuredMovies
                .slice()
                .reverse()
                .map((movie, index) => (
                  <div
                    key={index}
                    className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105 shadow-md"
                  >
                    <img src={movie.image} alt={movie.title} className="h-full w-full object-cover" />
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Texto Intermediário */}
        <div className="py-4 text-center">
          <Typography variant="body1" className="text-sm text-gray-300 leading-relaxed font-normal">
            Escreva e compartilhe resenhas. Crie suas próprias listas.
            <br />
            Compartilhe sua vida através do cinema.
          </Typography>
        </div>

        {/* --- DUPLE COLUMN (Avaliações | Listas) COM DIVISOR --- */}
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

                  {/* Avatar posicionado no canto superior direito */}
                  <div className="absolute top-3 right-3">
                    <Avatar name="Usuário" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divisor Vertical */}
          <div className="hidden md:block w-[1px] bg-gray-700/60 self-stretch my-2" />

          {/* Coluna Direita: Listas Populares */}
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

      {/* --- RODAPÉ --- */}
      <Footer/>
    </div>
    )
  }
}