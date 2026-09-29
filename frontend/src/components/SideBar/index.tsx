"use client"

import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { Typography } from "../ui/Typography";
import { useAuth } from "@/src/hooks/useAuth";

export default function SideBar() {
  const { logout } = useAuth();

  return (
    <aside className="flex w-64 flex-col justify-between border-r border-gray-800 bg-[#1e2530] p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Avatar name="Maria R2D2" size="lg" />
          <Typography variant="body2" className="text-sm font-semibold text-gray-300">
            Maria R2D2
          </Typography>
        </div>

        <hr className="w-full border-gray-700" />

        {/* Navegação da Sidebar */}
        <nav className="flex w-full flex-col gap-4 text-center">
          <Link href="/profile" className="text-sm text-gray-300 hover:text-white">
            Perfil
          </Link>
          <Link href="/discover" className="text-sm text-gray-300 hover:text-white">
            Descobrir
          </Link>
          <Link href="/movies" className="text-sm text-gray-300 hover:text-white">
            Filmes
          </Link>
          <Link href="/liked" className="text-sm text-gray-300 hover:text-white">
            Curtidos
          </Link>
        </nav>
      </div>

      {/* Botão de Sair no rodapé da Sidebar */}
      <div className="flex flex-col gap-4">
        <hr className="w-full border-gray-700" />
        <button
          type="button"
          onClick={logout}
          className="w-full text-center text-xs text-gray-400 transition-colors hover:text-red-400 cursor-pointer"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}