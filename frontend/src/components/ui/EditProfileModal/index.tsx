"use client";

import { React, useEffect, useState } from "react";
import { X, Camera } from "lucide-react";
import toast from "react-hot-toast";
import {
  updateCurrentUser,
  uploadAvatar,
  type UserProfile,
} from "../../../services/auth/user";
import { Avatar } from "../Avatar";

interface EditProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onSaved: (user: UserProfile) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getAvatarUrl(url: string | null) {
  if (!url) return "/default-avatar.png";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_URL}${url}`;
}

export default function EditProfileModal({
  user,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error("Selecione uma imagem JPG, PNG ou WebP.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setFile(selectedFile);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      toast.error("O nome de usuário é obrigatório.");
      return;
    }

    setSaving(true);

    try {
      let updatedUser = await updateCurrentUser({
        username: trimmedUsername,
        bio: bio.trim() || null,
      });

      onSaved(updatedUser);

      if (file) {
        try {
          const result = await uploadAvatar(file);

          updatedUser = {
            ...updatedUser,
            avatar_url: result.avatar_url,
          };

          onSaved(updatedUser);
        } catch {
          toast.error(
            "Os dados foram salvos, mas não foi possível atualizar a foto.",
          );
          return;
        }
      }

      toast.success("Perfil atualizado com sucesso!");
      onClose();
    } catch {
      toast.error("Não foi possível atualizar os dados do perfil.");
    } finally {
      setSaving(false);
    }
  }

  const avatarSrc = preview ?? getAvatarUrl(user.avatar_url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="w-full max-w-lg rounded-xl border border-gray-700 bg-[#232a36] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="edit-profile-title"
            className="text-xl font-bold text-white"
          >
            Editar perfil
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar modal"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              src={avatarSrc}
              alt={username || "Avatar do usuário"}
              name={username}
              className="h-24 w-24 border-2 border-emerald-500"
            />

            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/10">
              <Camera size={16} />
              Alterar foto
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={saving}
                className="hidden"
              />
            </label>

            <p className="text-xs text-gray-400">
              JPG, PNG ou WebP · máximo de 5 MB
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profile-username"
              className="block text-sm font-medium text-gray-200"
            >
              Nome de usuário
            </label>
            <input
              id="profile-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              maxLength={50}
              required
              disabled={saving}
              className="w-full rounded-lg border border-gray-700 bg-[#1e2530] px-3 py-2.5 text-white outline-none transition focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profile-bio"
              className="block text-sm font-medium text-gray-200"
            >
              Biografia
            </label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={300}
              rows={4}
              disabled={saving}
              placeholder="Conte um pouco sobre você..."
              className="w-full resize-none rounded-lg border border-gray-700 bg-[#1e2530] px-3 py-2.5 text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-500"
            />
            <p className="text-right text-xs text-gray-400">
              {bio.length}/300
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-700 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-700 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-[#09090b] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}