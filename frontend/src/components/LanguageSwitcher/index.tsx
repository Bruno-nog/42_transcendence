'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/src/i18n/routing';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as 'pt' | 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="relative inline-flex items-center">
      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
      <select
        value={locale}
        onChange={handleLanguageChange}
        className="appearance-none bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-sm border border-zinc-700/60 rounded-lg pl-9 pr-8 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
      >
        <option value="pt" className="bg-zinc-900 text-zinc-200">
          PT
        </option>
        <option value="en" className="bg-zinc-900 text-zinc-200">
          EN
        </option>
      </select>
      {/* Seta indicativa customizada */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
        ▼
      </div>
    </div>
  );
}