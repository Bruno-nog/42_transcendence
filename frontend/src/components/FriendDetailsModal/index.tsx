"use client";

import { Friend } from "@/src/services/auth/friends";
import { Typography } from "@/src/components/ui/Typography";

interface FriendDetailsModalProps {
  friend: Friend | null;
  onClose: () => void;
  onRemoveFriend?: (userId: number) => void;
}

export function FriendDetailsModal({
  friend,
  onClose,
  onRemoveFriend,
}: FriendDetailsModalProps) {
  const API_BASE_URL = "https://localhost:8000";

  console.log("friend", friend)

  if (!friend) return null;

  const getImageUrl = (url: string | null) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-zinc-900 text-white shadow-2xl border border-zinc-800 p-6 space-y-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <img
            src={getImageUrl(friend.avatar_url)}
            alt={friend.username}
            className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500 shadow-md"
          />

          <div className="space-y-1">
            <Typography variant="h3" className="text-xl font-bold text-white">
              {friend.username}
            </Typography>
          </div>

          <div className="w-full bg-zinc-800/50 p-4 rounded-lg border border-zinc-800 space-y-1 text-left">
            <Typography className="text-xs font-semibold uppercase text-zinc-400">
              Biografia
            </Typography>
            <Typography className="text-sm text-zinc-300 leading-relaxed">
              {friend.bio || "Este usuário não possui biografia cadastrada."}
            </Typography>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          {onRemoveFriend && (
            <button
              onClick={() => {
                onRemoveFriend(friend.id);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600/30 text-sm font-medium transition"
            >
              Remover Amigo
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition text-zinc-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}