"use client";

import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { Avatar } from "../ui/Avatar";
import { Typography } from "../ui/Typography";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { Link } from "@/src/i18n/routing";
import { getCurrentUser } from "@/src/services/auth/user";
import toast from "react-hot-toast";

interface UserData {
  id: number;
  username: string;
  avatar_url: string | null;
}

export default function Header() {
  const t = useTranslations('Common');
  const { isAuthenticated } = useAuth();

  const [user, setUser] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const API_BASE_URL = "https://localhost:8000";

  useEffect(() => {
    async function loadUser() {
      if (!isAuthenticated) {
        setLoadingUser(false);
        return;
      }
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        toast.error(t('UNABLE_TO_LOAD_YOUR_PROFILE'));
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, [isAuthenticated]);

  const getImageUrl = (url: string | null) => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <section className="relative flex h-[520px] w-full flex-col items-center justify-between bg-[url('/Banner.png')] bg-cover bg-center px-6 py-6 before:absolute before:inset-0 before:bg-black/40">
      <header className="w-3/4 relative z-10 flex items-center justify-between gap-8 rounded-2xl px-6 py-2.5 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍿</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-white hover:text-emerald-400">
            {t('HOME')}
          </Link>
          <Link href="/movies" className="text-sm font-medium text-gray-300 hover:text-white">
            {t('MOVIES')}
          </Link>
          <Link href="/lists" className="text-sm font-medium text-gray-300 hover:text-white">
            {t('LISTS')}
          </Link>
        </nav>

        {!isAuthenticated ? (
          <div className="flex items-center gap-6">
            <Button className="bg-[#2ECC71] px-5 py-1.5 text-sm hover:bg-[#27ae60]">
              <Link href="/login">{t('LOG_IN')}</Link>
            </Button>

            <Button className="bg-[#e69512] px-5 py-1.5 text-sm hover:bg-[#bb7607]">
              <Link href="/register">{t('SIGN_UP')}</Link>
            </Button>
          </div>
        ) : (
          <>
            <Link href="/profile" className="flex items-center justify-between gap-2">
              <Typography variant='body1' className="text-amber-100">{user?.username}</Typography>
              <Avatar 
                src={getImageUrl(user?.avatar_url ?? null)} 
                name={user?.username || "Usuário"} 
                size="sm" 
              />
            </Link>
          </>
        )}

        <LanguageSwitcher />
      </header>

      {!isAuthenticated ? (
        <div className="relative z-10 my-auto flex flex-col items-center text-center">
          <Typography variant="body1" className="max-w-md text-base text-gray-200">
            {t('KEEP_A_RECORD_OF_THE_MOVIES_YOU_HAVE_WATCHED')}
            <br />
            {t('SAVE_THE_ONES_YOU_WANT_TO_SEE')}
            <br />
            {t('TELL_YOUR_FRIENDS_WHAT_YOU_LIKED')}
          </Typography>

          <Button href="/register" className="mt-6 bg-[#2ECC71] px-8 py-2.5 hover:bg-[#27ae60]">
            {t('SIGN_UP')}
          </Button>

          <Typography variant="caption" className="mt-4 text-xs text-gray-400">
            {t('THE_SOCIAL_NETWORK_FOR_MOVIE_LOVERS')}
          </Typography>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}