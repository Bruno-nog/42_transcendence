"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { Avatar } from "../ui/Avatar";
import { Typography } from "../ui/Typography";

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative flex h-[520px] w-full flex-col items-center justify-between bg-[url('/Banner.png')] bg-cover bg-center px-6 py-6 before:absolute before:inset-0 before:bg-black/40">
      <header className="w-3/4 relative z-10 flex items-center justify-between gap-8 rounded-2xl px-6 py-2.5 backdrop-blur-md">
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

        {!isAuthenticated ? (
          <div className="flex items-center gap-6">
            <Button className="bg-[#2ECC71] px-5 py-1.5 text-sm hover:bg-[#27ae60]">
              <Link href="/login">Login</Link>
            </Button>

            <Button className="bg-[#e69512] px-5 py-1.5 text-sm hover:bg-[#bb7607]">
              <Link href="/register">Registrar</Link>
            </Button>
          </div>
        ) : (
          <Avatar name="Maria R2D2" size="sm" />
        )}
      </header>

      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        <Typography variant="body1" className="max-w-md text-base text-gray-200">
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

  );
}