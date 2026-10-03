"use client";

import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { Typography } from "../ui/Typography";
import { useAuth } from "@/src/hooks/useAuth";

const stats = [
  { label: "Filmes", value: "366" },
  { label: "Review", value: "157" },
  { label: "Curtidas", value: "58" },
  { label: "Seguidores", value: "102" },
];

export default function SideBar() {
  const { logout } = useAuth();

  return (
    <aside className="flex w-64 min-h-screen flex-col justify-between rounded-xl bg-[#232a36] p-6 shadow-xl shrink-0">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="flex flex-col items-center text-center space-y-4 w-full">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-emerald-500 shadow-md">
            <Avatar
              src="/maria.png"
              alt="Maria R2D2"
              className="h-full w-full object-cover"
            />
          </div>

          <Typography variant="h2" className="text-lg font-bold text-white">
            Maria R2D2
          </Typography>

          <div className="grid grid-cols-2 gap-2 w-full pt-1">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-lg border border-gray-700/60 bg-[#1e2530] py-2 px-1"
              >
                <span className="text-sm font-bold text-white">{stat.value}</span>
                <span className="text-[10px] text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-1.5 pt-2 w-full">
            <div className="h-2 flex-1 rounded-full bg-emerald-500" />
            <div className="h-2 flex-1 rounded-full bg-[#4b6592]" />
            <div className="h-2 flex-1 rounded-full bg-[#4b6592]" />
            <div className="h-2 flex-1 rounded-full bg-[#4b6592]" />
            <div className="h-2 flex-1 rounded-full bg-[#4b6592]" />
          </div>
        </div>

        <hr className="w-full border-gray-700/60" />

        <nav className="flex w-full flex-col gap-3 text-center">
          <Link href="/" className="rounded-lg py-2 text-sm text-white font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition">
            Home
          </Link>
          <Link href="/discover" className="rounded-lg py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition">
            Descobrir
          </Link>
          <Link href="/movies" className="rounded-lg py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition">
            Filmes
          </Link>
          <Link href="/liked" className="rounded-lg py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition">
            Curtidos
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-4 w-full pt-4">
        <hr className="w-full border-gray-700/60" />
        <button
          type="button"
          onClick={logout}
          className="w-full text-center text-xs text-gray-400 bg-red-500 text-white transition-colors cursor-pointer py-1 rounded-2xl"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}