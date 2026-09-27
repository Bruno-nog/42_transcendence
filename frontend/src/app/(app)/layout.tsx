import Header from "@/src/components/Header";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#14181f] text-white flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1 w-full flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}