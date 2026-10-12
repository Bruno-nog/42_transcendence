import type { Metadata } from "next";
import { Providers } from "@/src/providers/Providers";
import "@/src/styles/global.css";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { UserPresence } from "@/src/components/UserPresence.tsx";

export const metadata: Metadata = {
  title: "MediaHub",
  description: "Track movies, series, books and games.",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as name)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <UserPresence />
            <div className="min-h-screen w-full flex flex-col bg-[#181d27]">
              {children}
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}