"use client";

import { useEffect, useState } from "react";
import { Friend } from "@/src/services/auth/friends";
import {
  getFollowing,
  followUser,
  unfollowUser,
} from "@/src/services/auth/follows";
import { getCurrentUser } from "@/src/services/auth/user";
import { Typography } from "@/src/components/ui/Typography";
import { Avatar } from "../ui/Avatar";
import { API_BASE_URL } from "@/src/utils/data";

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
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    if (!friend) return;

    let cancelled = false;

    const checkFollowing = async () => {
      try {
        const currentUser = await getCurrentUser();
        const following = await getFollowing(currentUser.id);

        if (!cancelled) {
          setIsFollowing(
            following.some((user) => user.id === friend.id)
          );
        }
      } catch (error) {
        console.error("Erro ao verificar seguidores:", error);
      }
    };

    checkFollowing();

    return () => {
      cancelled = true;
    };
  }, [friend]);

  if (!friend) return null;

  const getImageUrl = (url: string | null) => {
    if (!url) return "/maria.png";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const handleFollow = async () => {
    try {
      setLoadingFollow(true);

      if (isFollowing) {
        await unfollowUser(friend.id);
        setIsFollowing(false);
      } else {
        await followUser(friend.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar follow:", error);
    } finally {
      setLoadingFollow(false);
    }
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
          <div className="relative">
            <Avatar
              src={getImageUrl(friend.avatar_url)}
              alt={friend.username}
              className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500 shadow-md"
            />
            <span
              title={friend.is_online ? "Online" : "Offline"}
              className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-zinc-900 ${
                friend.is_online ? "bg-emerald-500" : "bg-gray-500"
              }`}
            />
          </div>

          <div className="space-y-1">
            <Typography
              variant="h3"
              className="text-xl font-bold text-white"
            >
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

          <button
            onClick={handleFollow}
            disabled={loadingFollow}
            className={`w-full py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
              isFollowing
                ? "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {loadingFollow
              ? "Aguarde..."
              : isFollowing
                ? "Deixar de seguir"
                : "Seguir"}
          </button>
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
