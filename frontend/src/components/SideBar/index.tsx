"use client";

import { React, useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Avatar } from "../ui/Avatar";
import { Typography } from "../ui/Typography";
import { useAuth } from "@/src/hooks/useAuth";
import {
  getCurrentUser,
  uploadAvatar,
  type UserProfile,
} from "../../services/auth/user";
import EditProfileModal from "../ui/EditProfileModal";


const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_AVATAR = "/maria.png";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const stats = [
  { label: "Filmes", value: "366" },
  { label: "Review", value: "157" },
  { label: "Curtidas", value: "58" },
  { label: "Seguidores", value: "102" },
];

function getAvatarSrc(avatarUrl: string | null | undefined) {
  if (!avatarUrl) return DEFAULT_AVATAR;
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }
  return `${API_URL}${avatarUrl}`;
}

export default function SideBar() {
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        toast.error("Não foi possível carregar seu perfil.");
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = "";

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Selecione uma imagem JPG, PNG ou WebP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setUploading(true);

    try {
      const response = await uploadAvatar(file);

      setUser((currentUser) =>
        currentUser
          ? { ...currentUser, avatar_url: response.avatar_url }
          : currentUser
      );

      toast.success("Avatar atualizado com sucesso!");
    } catch {
      toast.error("Não foi possível atualizar o avatar.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <aside className="flex h-full w-64 flex-col justify-between bg-[#14181f] p-4 text-white">
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <div className="flex flex-col items-center gap-2">
            <Avatar
              src={getAvatarSrc(user?.avatar_url)}
              alt={user?.username ?? "Avatar do usuário"}
              name={user?.username}
              className="h-24 w-24 object-cover rounded-full"
            />

            <Typography variant="h2" className="text-lg font-bold text-white">
              {loadingUser ? "Carregando..." : user?.username ?? "Usuário"}
            </Typography>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              disabled={!user || uploading}
              className="rounded-lg px-3 py-2 text-sm text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-50"
            >
              Editar perfil
            </button>
          </div>

          <hr className="w-full border-gray-700/60" />

          <nav className="flex w-full flex-col gap-3 text-center">
            <Link
              href="/"
              className="rounded-lg bg-emerald-500/10 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
            >
              Home
            </Link>
            <Link
              href="/discover"
              className="rounded-lg py-2 text-sm text-gray-300 transition hover:bg-gray-800/50 hover:text-white"
            >
              Descobrir
            </Link>
            <Link
              href="/movies"
              className="rounded-lg py-2 text-sm text-gray-300 transition hover:bg-gray-800/50 hover:text-white"
            >
              Filmes
            </Link>
            <Link
              href="/liked"
              className="rounded-lg py-2 text-sm text-gray-300 transition hover:bg-gray-800/50 hover:text-white"
            >
              Curtidos
            </Link>
          </nav>
        </div>

        <div className="flex w-full flex-col gap-4 pt-4">
          <hr className="w-full border-gray-700/60" />
          <button
            type="button"
            onClick={logout}
            className="w-full cursor-pointer rounded-2xl bg-red-500 py-1 text-center text-xs text-white transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {isEditModalOpen && user && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </>
  );
}