import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations('Common');
  return (
    <footer className="border-t border-white/10 flex flex-col gap-5 py-6 text-center">
      <span className="text-2xl">🍿</span>
      <Link href="/privacy-policy">
        {t('PRIVACY_POLICY')}
      </Link>

      <Link href="/terms-of-service">
        {t('TERMS_OF_SERVICE')}
      </Link>
    </footer>
  );
}