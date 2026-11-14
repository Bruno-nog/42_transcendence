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
import { API_BASE_URL } from "@/src/utils/data";
import { NotificationsPopover } from "@/src/components/NotificationsPopover";

interface UserData {
  id: number;
  username: string;
  avatar_url: string | null;
}

interface HeaderProps {
  bannerUrl?: string | null;
}

export default function Header({ bannerUrl }: HeaderProps) {
  const t = useTranslations('Common');
  const { isAuthenticated, logout } = useAuth();

  const [user, setUser] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const backgroundStyle = bannerUrl
    ? `linear-gradient(to bottom, rgba(24,29,36,0.85) 0%, rgba(24,29,36,0.3) 50%, rgba(24,29,36,0.95) 100%), url('${bannerUrl}')`
    : `url('/Banner.png')`;

  const headerHeight = bannerUrl ? "h-[320px]" : "h-[520px]";

  return (
    <section 
      className={`relative flex ${headerHeight} w-full flex-col items-center justify-between bg-cover bg-center px-4 md:px-6 py-6 transition-all duration-300`}
      style={{ backgroundImage: backgroundStyle }}
    >
      <header className="w-full md:w-3/4 relative z-10 flex items-center justify-between gap-4 rounded-2xl px-4 md:px-6 py-2.5 backdrop-blur-md bg-black/40 border border-white/10 shadow-lg">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍿</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-white hover:text-emerald-400">
            {t('HOME')}
          </Link>
          <Link href="/movies" className="text-sm font-medium text-gray-300 hover:text-white">
            {t('MOVIES')}
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Button className="bg-[#2ECC71] px-4 py-1.5 text-sm hover:bg-[#27ae60]">
                <Link href="/login">{t('LOG_IN')}</Link>
              </Button>

              <Button className="bg-[#e69512] px-4 py-1.5 text-sm hover:bg-[#bb7607]">
                <Link href="/register">{t('SIGN_UP')}</Link>
              </Button>

              <LanguageSwitcher />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2">
                <Typography variant='body1' className="text-amber-100 text-sm">{user?.username}</Typography>
                <Avatar 
                  src={getImageUrl(user?.avatar_url ?? null)} 
                  name={user?.username || "Usuário"} 
                  size="sm" 
                />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-[70px] cursor-pointer rounded-xl bg-red-500 py-1 text-center text-xs text-white transition-colors"
              >
                {t('LOGOUT')}
              </button>

              <LanguageSwitcher />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden p-2 rounded-lg bg-gray-800/80 text-gray-200 hover:text-white focus:outline-none"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="relative flex h-full w-72 flex-col justify-between bg-[#14181f] p-6 text-white z-10 shadow-2xl ml-auto">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">Menu</span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-400 hover:text-white p-1"
                  aria-label="Fechar menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isAuthenticated && user && (
                <Link 
                  href="/profile" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50"
                >
                  <Avatar 
                    src={getImageUrl(user?.avatar_url ?? null)} 
                    name={user?.username || "Usuário"} 
                    size="sm" 
                  />
                  <Typography variant='body1' className="text-amber-100 font-medium truncate">{user?.username}</Typography>
                </Link>
                
                <NotificationsPopover />
              )}

              <hr className="border-gray-700/60" />

              <nav className="flex flex-col gap-4">
                <Link 
                  href="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium text-white hover:text-emerald-400"
                >
                  {t('HOME')}
                </Link>
                <Link 
                  href="/movies" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium text-gray-300 hover:text-white"
                >
                  {t('MOVIES')}
                </Link>
              </nav>

              <hr className="border-gray-700/60" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Idioma:</span>
                <LanguageSwitcher />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-gray-700/60">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Button className="w-full bg-[#2ECC71] py-2 text-sm hover:bg-[#27ae60]">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>{t('LOG_IN')}</Link>
                  </Button>
                  <Button className="w-full bg-[#e69512] py-2 text-sm hover:bg-[#bb7607]">
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>{t('SIGN_UP')}</Link>
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="w-full cursor-pointer rounded-xl bg-red-500 py-2 text-center text-sm text-white transition-colors"
                >
                  {t('LOGOUT')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!isAuthenticated && !bannerUrl ? (
        <div className="relative z-10 my-auto flex flex-col items-center text-center px-2">
          <Typography variant="body1" className="max-w-md text-sm md:text-base text-gray-200">
            {t('KEEP_A_RECORD_OF_THE_MOVIES_YOU_HAVE_WATCHED')}
            <br />
            {t('SAVE_THE_ONES_YOU_WANT_TO_SEE')}
            <br />
            {t('TELL_YOUR_FRIENDS_WHAT_YOU_LIKED')}
          </Typography>

          <Typography variant="caption" className="mt-4 text-xs text-gray-400">
            {t('THE_SOCIAL_NETWORK_FOR_MOVIE_LOVERS')}
          </Typography>
        </div>
      ) : (
        <div />
      )}
    </section>
  );
}