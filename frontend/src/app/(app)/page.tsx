"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Typography } from "@/src/components/ui/Typography";
import { Avatar } from "@/src/components/ui/Avatar";
import { useAuth } from "@/src/hooks/useAuth";
import { Loader } from "@/src/components/ui/loader";

export default function HomePage() {
  const featuredMovies = [
    { title: "Avatar", image: "/f1.png" },
    { title: "Zero a Direita", image: "/f2.png" },
    { title: "Pânico VI", image: "/f3.png" },
    { title: "Vingadores", image: "/f4.png" },
  ];

  const { logout, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-[#181d24] text-white">
      <section className="relative flex h-[520px] w-full flex-col items-center justify-between bg-[url('/Banner.png')] bg-cover bg-center px-6 py-6 before:absolute before:inset-0 before:bg-black/40">

        <header className="relative z-10 flex items-center justify-between gap-8 rounded-2xl bg-black/40 px-6 py-2.5 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍿</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-white hover:text-emerald-400">
              Início
            </Link>
            <Link href="/movies" className="text-sm font-medium text-gray-300 hover:text-white">
              Filmes
            </Link>
            <Link href="/lists" className="text-sm font-medium text-gray-300 hover:text-white">
              Listas
            </Link>
          </nav>


          {isLoading ? (
            <Loader />
          ) : !isAuthenticated ? (
            <Button className="bg-[#2ECC71] px-5 py-1.5 text-sm hover:bg-[#27ae60]">
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <Button
              className="bg-[#ed2a08] px-5 py-1.5 text-sm hover:bg-[#27ae60]"
              onClick={logout}
            >
              Sair
            </Button>
          )}
        </header>

        <div className="relative z-10 flex flex-col items-center text-center my-auto">
          <Typography variant="body1" className="text-gray-200 text-base max-w-md">
            Registre os filmes que você já assistiu.
            <br />
            Salve aqueles que você quer ver.
            <br />
            Conte aos seus amigos o que você achou bom.
          </Typography>

          <Button href="/register" className="mt-6 bg-[#2ECC71] px-8 py-2.5 hover:bg-[#27ae60]">
            Começar
          </Button>

          <Typography variant="caption" className="mt-4 text-xs text-gray-400">
            A rede social para amantes do cinema.
          </Typography>
        </div>
      </section>

      {isLoading ? (
        <Loader />
      ) : !isAuthenticated ? (
        <main className="flex flex-col justify-center items-center w-full px-6 py-10 gap-10">
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-2">
              <Typography variant="h3" className="text-lg font-bold text-white">
                Filmes em Destaques
              </Typography>
            </div>

            <div className="rounded-xl bg-[#232a36] p-6 w-full">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {featuredMovies.map((movie, index) => (
                  <div key={index} className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105">
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
                {featuredMovies.slice().reverse().map((movie, index) => (
                  <div key={index} className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105">
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

            <section className="flex flex-col gap-5 justify-between">
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
                        <Typography variant="body2" className="mt-1 text-xs text-gray-400 line-clamp-2">
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
      ) : (
        <Typography variant="h1">Usuario logado</Typography>
      )}

      <footer className="border-t border-white/10 py-6 text-center">
        <span className="text-2xl">🍿</span>
      </footer>
    </div>
  );
}