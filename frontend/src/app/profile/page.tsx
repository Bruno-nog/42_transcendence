"use client";

import Link from "next/link";
import { Avatar } from "@/src/components/ui/Avatar";
import { Typography } from "@/src/components/ui/Typography";
import Header from "@/src/components/Header";

export default function ProfilePage() {
  const favoriteMovies = [
    { title: "Avatar", image: "/f1.png" },
    { title: "Zero a Direita", image: "/f2.png" },
    { title: "Pânico VI", image: "/f3.png" },
    { title: "Vingadores", image: "/f4.png" },
    { title: "Avatar", image: "/f1.png" },
  ];

  const stats = [
    { label: "Filmes", value: "366" },
    { label: "Review", value: "157" },
    { label: "Curtidas", value: "58" },
    { label: "Seguidores", value: "102" },
  ];

  return (
    <div className="min-h-screen bg-[#181d24] p-8 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <Header />

        {/* Informações do Perfil */}
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            {/* Foto de Perfil */}
            <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-emerald-500">
              <img
                src="/maria.png"
                alt="Maria R2D2"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Nome e Estatísticas */}
            <div className="space-y-3">
              <Typography variant="h2" className="text-xl font-bold text-white">
                Maria R2D2
              </Typography>

              <div className="flex gap-3">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center rounded-lg border border-gray-700 bg-[#1e2530] px-4 py-1.5 min-w-[70px]"
                  >
                    <span className="text-base font-bold text-white">{stat.value}</span>
                    <span className="text-[10px] text-gray-400">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Abas / Indicadores */}
          <div className="flex gap-3 pt-2">
            <div className="h-3 w-16 rounded-full bg-emerald-500" />
            <div className="h-3 w-16 rounded-full bg-[#232a36]" />
            <div className="h-3 w-16 rounded-full bg-[#232a36]" />
            <div className="h-3 w-16 rounded-full bg-[#232a36]" />
            <div className="h-3 w-16 rounded-full bg-[#232a36]" />
          </div>
        </div>

        {/* Grid Principal do Perfil */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Seções da Esquerda (2 colunas) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Seção 1: Seus Favoritos */}
            <section className="rounded-xl bg-[#232a36] p-5 space-y-4">
              <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
                <Typography variant="h3" className="text-sm font-bold text-white">
                  Seus Favoritos
                </Typography>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {favoriteMovies.map((movie, index) => (
                  <div
                    key={index}
                    className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105"
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Seção 2: Seus Favoritos */}
            <section className="rounded-xl bg-[#232a36] p-5 space-y-4">
              <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
                <Typography variant="h3" className="text-sm font-bold text-white">
                  Seus Favoritos
                </Typography>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {favoriteMovies.map((movie, index) => (
                  <div
                    key={index}
                    className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105"
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Painel Lateral Direita (1 coluna) */}
          <div className="h-full min-h-[350px] rounded-xl bg-[#232a36] p-6">
            {/* Espaço reservado para o conteúdo da lateral direita (Reviews, Atividades, etc) */}
          </div>
        </div>
      </div>
    </div>
  );
}