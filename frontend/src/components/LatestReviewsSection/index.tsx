"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { Heart, UserPlus, Check } from "lucide-react";

import { getCurrentUser } from "@/src/services/auth/user";
import { addFriend, getFriends } from "@/src/services/auth/friends";
import {
  getLatestReviews,
  getMyLikedReviews,
  likeReview,
  unlikeReview,
  type PublicReview,
} from "@/src/services/auth/reviews";

import { useAuth } from "@/src/hooks/useAuth";
import { Avatar } from "@/src/components/ui/Avatar";
import { Typography } from "@/src/components/ui/Typography";

import { API_BASE_URL } from "@/src/utils/data";

interface LatestReviewsSectionProps {
  limit?: number;
}

export function LatestReviewsSection({
  limit = 4,
}: LatestReviewsSectionProps) {
  const { isAuthenticated } = useAuth();

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [latestReviews, setLatestReviews] = useState<PublicReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [addingFriendId, setAddingFriendId] = useState<number | null>(null);
  const [friendsIds, setFriendsIds] = useState<number[]>([]);

  const [likedReviewIds, setLikedReviewIds] = useState<number[]>([]);
  const [likingReviewId, setLikingReviewId] = useState<number | null>(null);

  const getImageUrl = (url: string | null) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  useEffect(() => {
    async function loadUserDataAndFriends() {
      if (!isAuthenticated) return;
      try {
        const [user, myFriends] = await Promise.all([
          getCurrentUser(),
          getFriends().catch(() => []),
        ]);

        setCurrentUserId(user.id);
        if (Array.isArray(myFriends)) {
          setFriendsIds(myFriends.map((friend) => friend.id));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do usuário e amigos:", err);
      }
    }

    loadUserDataAndFriends();
  }, [isAuthenticated]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoadingReviews(true);
        const data = await getLatestReviews(limit);
        setLatestReviews(data);
      } catch (err) {
        console.error("Erro ao carregar últimas reviews:", err);
        toast.error("Não foi possível carregar as avaliações recentes.");
      } finally {
        setLoadingReviews(false);
      }
    }

    fetchReviews();
  }, [limit]);

  useEffect(() => {
    let cancelled = false;

    const fetchLikedReviews = async () => {
      if (!isAuthenticated) {
        if (!cancelled) {
          setLikedReviewIds([]);
        }
        return;
      }

      try {
        const reviewIds = await getMyLikedReviews();

        if (!cancelled) {
          setLikedReviewIds(reviewIds);
        }
      } catch {
        if (!cancelled) {
          setLikedReviewIds([]);
        }
      }
    };

    fetchLikedReviews();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleToggleLike = async (review: PublicReview) => {
    if (!isAuthenticated) {
      toast.error("Faça login para curtir avaliações.");
      return;
    }

    if (likingReviewId !== null) return;

    const alreadyLiked = likedReviewIds.includes(review.id);

    try {
      setLikingReviewId(review.id);

      const response = alreadyLiked
        ? await unlikeReview(review.id)
        : await likeReview(review.id);

      setLatestReviews((prev) =>
        prev.map((item) =>
          item.id === review.id
            ? { ...item, likes: response.likes }
            : item,
        ),
      );

      setLikedReviewIds((prev) =>
        alreadyLiked
          ? prev.filter((id) => id !== review.id)
          : [...prev, review.id],
      );
    } catch (error) {
      console.error("Erro ao atualizar curtida:", error);
      toast.error("Não foi possível atualizar sua curtida.");
    } finally {
      setLikingReviewId(null);
    }
  };

  const handleAddFriend = async (userId: number, username?: string) => {
    if (!isAuthenticated) {
      toast.error("Faça login para adicionar amigos.");
      return;
    }

    try {
      setAddingFriendId(userId);
      await addFriend(userId);
      setFriendsIds((prev) => [...prev, userId]);
      toast.success(`${username || "Usuário"} adicionado aos amigos!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao adicionar amigo.";
      toast.error(msg);
    } finally {
      setAddingFriendId(null);
    }
  };

  return (
    <section className="space-y-4 w-full">
      <div className="w-full rounded-2xl bg-[#1e2530] p-5">
        {loadingReviews ? (
          <p className="text-sm text-gray-400">Carregando avaliações...</p>
        ) : latestReviews.length === 0 ? (
          <p className="text-sm text-gray-400">
            Nenhuma avaliação recente encontrada.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestReviews.map((review) => {
              const isSelf = currentUserId !== null && currentUserId === review.user_id;
              const isAlreadyFriend = friendsIds.includes(review.user_id);
              const isLoadingThis = addingFriendId === review.user_id;

              return (
                <div
                  key={review.id}
                  className="flex flex-col justify-between rounded-xl bg-[#2b3342] p-4 transition hover:bg-[#343e52]"
                >
                  <div className="flex gap-3">
                    {review.cover_url && (
                      <img
                        src={getImageUrl(review.cover_url)}
                        alt={review.title}
                        className="h-20 w-14 flex-shrink-0 rounded object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <Typography
                        variant="h4"
                        className="text-sm font-bold text-white truncate"
                      >
                        {review.title}
                      </Typography>
                      <Typography className="text-xs text-emerald-400 mt-0.5">
                        Nota: {review.rate ?? "-"}/10
                      </Typography>
                      <Typography
                        variant="body2"
                        className="mt-1 line-clamp-2 text-xs text-gray-300"
                      >
                        {review.review || "Sem comentário..."}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar
                        src={getImageUrl(review.user_avatar ?? null)}
                        name={review.username || "Usuário"}
                        size="sm"
                      />
                      <span className="text-xs text-gray-400 truncate">
                        {review.username || "Usuário Anônimo"}
                      </span>
                    </div>

                    {!isSelf && isAuthenticated && (
                      <>
                        <button
                          type="button"
                          disabled={isLoadingThis || isAlreadyFriend}
                          onClick={() => handleAddFriend(review.user_id, review.username)}
                          title={
                            isAlreadyFriend
                              ? "Já é seu amigo"
                              : "Adicionar amigo"
                          }
                          className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                            isAlreadyFriend
                              ? "bg-emerald-600/20 text-emerald-400 cursor-default"
                              : "bg-gray-700/60 text-gray-300 hover:bg-emerald-600 hover:text-white"
                          } disabled:opacity-50`}
                        >
                          {isAlreadyFriend ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <UserPlus className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleLike(review)}
                          disabled={likingReviewId === review.id}
                          title={
                            likedReviewIds.includes(review.id)
                              ? "Descurtir avaliação"
                              : "Curtir avaliação"
                          }
                          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs transition hover:bg-gray-700/60 disabled:opacity-50"
                        >
                          <Heart
                            className={`h-4 w-4 transition ${
                              likedReviewIds.includes(review.id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />

                          <span className="text-gray-300">
                            {review.likes ?? 0}
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}