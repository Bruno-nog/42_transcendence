"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Typography } from "@/src/components/ui/Typography";
import { Avatar } from "@/src/components/ui/Avatar";
import { useAuth } from "@/src/hooks/useAuth";
import { Loader } from "@/src/components/ui/loader";
import UserDashboard from "../Dashboard/page";

export default function HomePage() {
  const featuredMovies = [
    { title: "Avatar", image: "/f1.png" },
    { title: "Zero a Direita", image: "/f2.png" },
    { title: "Pânico VI", image: "/f3.png" },
    { title: "Vingadores", image: "/f4.png" },
  ];

  const { isAuthenticated, isLoading } = useAuth();

  // 1. Enquanto carrega a verificação do localStorage
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#181d24]">
        <Loader />
      </div>
    );
  }

  // 2. Se o usuário estiver logado, mostra APENAS o Dashboard (sem banner)
  if (isAuthenticated) {
    return <UserDashboard />;
  }

  // 3. Se NÃO estiver logado, mostra a Landing Page completa (Banner, Conteúdo e Rodapé)
  return (
    <div className="min-h-screen bg-[#181d24] text-white">

      {/* Conteúdo da Landing Page */}
      <main className="flex w-full flex-col items-center justify-center gap-10 px-6 py-10">
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
            <Typography variant="h3" className="text-lg font-bold text-white">
              Filmes em Destaques
            </Typography>
          </div>

          <div className="w-full rounded-xl bg-[#232a36] p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {featuredMovies.map((movie, index) => (
                <div
                  key={index}
                  className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105"
                >
                  <img src={movie.image} alt={movie.title} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
            <Typography variant="h3" className="text-lg font-bold text-white">
              Acabei de analisar...
            </Typography>
          </div>

          <div className="rounded-xl bg-[#232a36] p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {featuredMovies
                .slice()
                .reverse()
                .map((movie, index) => (
                  <div
                    key={index}
                    className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105"
                  >
                    <img src={movie.image} alt={movie.title} className="h-full w-full object-cover" />
                  </div>
                ))}
            </div>
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
      </main>

      <footer className="border-t border-white/10 py-6 text-center">
        <span className="text-2xl">🍿</span>
      </footer>
    </div>
  );
}