"use client";

import { useEffect, useState } from "react";
import SideBar from "@/src/components/SideBar";
import { Typography } from "@/src/components/ui/Typography";
import { getFavorites, removeFavorite, FavoriteMedia } from "@/src/services/auth/favorites";
import { getFriends, removeFriend, Friend } from "@/src/services/auth/friends";
import { MovieDetailsModal } from "@/src/components/MovieDetailsModal";
import { MediaCard } from "@/src/components/media/MediaCard";
import { FriendDetailsModal } from "@/src/components/FriendDetailsModal";

export default function ProfilePage() {
  const [favorites, setFavorites] = useState<FavoriteMedia[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const API_BASE_URL = "https://localhost:8000";

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [favoritesData, friendsData] = await Promise.all([
        getFavorites(),
        getFriends(),
      ]);

      setFavorites(favoritesData || []);
      setFriends(friendsData || []);
    } catch (error) {
      console.error("Erro ao carregar dados do perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleRemoveFriend = async (userId: number) => {
    try {
      await removeFriend(userId);
      setFriends((prev) => prev.filter((friend) => friend.id !== userId));
    } catch (error) {
      console.error("Erro ao remover amigo:", error);
    }
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <>
      <div className="flex min-h-screen w-full bg-[#181d27] p-6 gap-6">
        <SideBar />

        <main className="flex-1 space-y-8">
          <section className="rounded-xl bg-[#232a36] p-6 space-y-5 shadow-lg">
            <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
              <Typography variant="h3" className="text-base font-bold text-white">
                Seus Favoritos
              </Typography>
            </div>

            {loading ? (
              <Typography className="text-gray-400">Carregando favoritos...</Typography>
            ) : favorites.length === 0 ? (
              <Typography className="text-gray-400">Nenhum favorito encontrado.</Typography>
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
                Seus Amigos
              </Typography>
            </div>

            {loading ? (
              <Typography className="text-gray-400">Carregando amigos...</Typography>
            ) : friends.length === 0 ? (
              <Typography className="text-gray-400">Nenhum amigo adicionado ainda.</Typography>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend)}
                    className="group relative flex flex-col items-center p-4 rounded-lg bg-gray-800/60 hover:bg-gray-800 transition-all border border-gray-700/50 cursor-pointer"
                  >
                    <img
                      src={getImageUrl(friend.avatar_url)}
                      alt={friend.username}
                      className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-emerald-500/50"
                    />
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