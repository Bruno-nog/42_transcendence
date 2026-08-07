import type { Metadata } from "next";
import { Providers } from "../providers/Providers";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "MediaHub",
  description: "Track movies, series, books and games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}