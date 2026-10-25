"use client";

import { useEffect, useState } from "react";
import SideBar from "@/src/components/SideBar";
import { Typography } from "@/src/components/ui/Typography";
import { getFavorites, FavoriteMedia } from "@/src/services/auth/favorites";
import { getFriends, removeFriend, Friend } from "@/src/services/auth/friends";
import { MovieDetailsModal } from "@/src/components/MovieDetailsModal";
import { MediaCard } from "@/src/components/media/MediaCard";
import { FriendDetailsModal } from "@/src/components/FriendDetailsModal";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { Avatar } from "../components/ui/Avatar";
import { getCurrentUser } from "@/src/services/auth/user";
import {
  getUserReviews,
  UserReview,
} from "@/src/services/auth/reviews";

export default function ProfilePageView() {
  const t = useTranslations('Profile');

  const [favorites, setFavorites] = useState<FavoriteMedia[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);

  const API_BASE_URL = "https://localhost:8000";

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const user = await getCurrentUser();

      const [favoritesData, friendsData, reviewsData] =
        await Promise.all([
          getFavorites(),
          getFriends(),
          getUserReviews(user.id),
        ]);

      setFavorites(favoritesData || []);
      setFriends(friendsData || []);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error(t("ERROR_LOADING_PROFILE_DATA"), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfileData();

    const interval = setInterval(() => {
      getFriends()
        .then((friendsData) => setFriends(friendsData || []))
        .catch((error) => {
          console.error(t("ERROR_LOADING_PROFILE_DATA"), error);
        });
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  const handleRemoveFriend = async (userId: number) => {
    try {
      await removeFriend(userId);
      setFriends((prev) => prev.filter((friend) => friend.id !== userId));
    } catch (error) {
      console.error(t('ERROR_REMOVING_FRIEND'), error);
    }
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <>
      <header className="w-full relative z-10 flex items-center justify-around gap-8 rounded-2xl px-6 py-2.5 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍿</span>
        </Link>

        <nav className="flex items-center justify-around gap-6">
          <Link href="/" className="text-sm font-medium text-white hover:text-emerald-400">
            {t('HOME')}
          </Link>
          <Link href="/movies" className="text-sm font-medium text-gray-300 hover:text-white">
            {t('MOVIES')}
          </Link>
        </nav>

        <LanguageSwitcher />
      </header>

      <div className="flex min-h-screen w-full bg-[#181d27] p-6 gap-6">
        <SideBar />

        <main className="flex-1 space-y-8">
          <section className="rounded-xl bg-[#232a36] p-6 space-y-5 shadow-lg">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
              <Typography variant="h3" className="text-base font-bold text-white">
                {t('YOUR_FAVORITES')}
              </Typography>
            </div>

            {loading ? (
              <Typography className="text-gray-400">{t('LOADING_FAVORITES')}</Typography>
            ) : favorites.length === 0 ? (
              <Typography className="text-gray-400">{t('NO_FAVORITES_FOUND')}.</Typography>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {favorites.map((movie) => (
                  <MediaCard
                    key={movie.id}
                    media={movie}
                    onClick={() => setSelectedMovieId(String(movie.external_id))}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl bg-[#232a36] p-6 space-y-5 shadow-lg">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
              <Typography variant="h3" className="text-base font-bold text-white">
                {t('YOUR_FRIENDS')}
              </Typography>
            </div>

            {loading ? (
              <Typography className="text-gray-400">{t('LOADING_FRIENDS')}</Typography>
            ) : friends.length === 0 ? (
              <Typography className="text-gray-400">{t('NO_FRIENDS_ADDED_YET')}</Typography>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend)}
                    className="group relative flex flex-col items-center p-4 rounded-lg bg-gray-800/60 hover:bg-gray-800 transition-all border border-gray-700/50 cursor-pointer"
                  >
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
                    <Typography className="text-sm font-medium text-white truncate max-w-full">
                      {friend.username}
                    </Typography>
                    {friend.bio && (
                      <Typography className="text-xs text-gray-400 truncate max-w-full mt-1">
                        {friend.bio}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl bg-[#232a36] p-6 space-y-5 shadow-lg">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
              <Typography
                variant="h3"
                className="text-base font-bold text-white"
              >
                Minhas avaliações
              </Typography>
            </div>

            {loading ? (
              <Typography className="text-gray-400">
                Carregando avaliações...
              </Typography>
            ) : reviews.length === 0 ? (
              <Typography className="text-gray-400">
                Você ainda não publicou nenhuma avaliação.
              </Typography>
            ) : (
              /* Grid Responsivo: 1 coluna em telas menores e 2 colunas a partir de telas médias (md) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="flex gap-4 rounded-lg border border-gray-700/50 bg-gray-800/50 p-4"
                  >
                    {review.cover_url && (
                      <img
                        src={getImageUrl(review.cover_url)}
                        alt={review.title}
                        className="h-28 w-20 shrink-0 rounded-md object-cover"
                      />
                    )}

                    <div className="min-w-0 flex-1 space-y-2">
                      <Typography className="font-semibold text-white truncate">
                        {review.title}
                        {review.release_year
                          ? ` (${review.release_year})`
                          : ""}
                      </Typography>

                      <Typography className="text-sm text-emerald-400 font-medium">
                        Nota: {review.rate ?? "Não informada"}/10
                      </Typography>

                      {review.review && (
                        <Typography className="text-sm text-gray-300 line-clamp-3">
                          {review.review}
                        </Typography>
                      )}

                      {review.date_film && (
                        <Typography className="text-xs text-gray-500">
                          Assistido em:{" "}
                          {new Date(`${review.date_film}T12:00:00`).toLocaleDateString(
                            "pt-BR",
                          )}
                        </Typography>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      <MovieDetailsModal
        movieId={selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
      />

      <FriendDetailsModal
        friend={selectedFriend}
        onClose={() => setSelectedFriend(null)}
        onRemoveFriend={handleRemoveFriend}
      />
    </>
  );
}