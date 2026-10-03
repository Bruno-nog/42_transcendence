"use client";

import SideBar from "@/src/components/SideBar";
import { Typography } from "@/src/components/ui/Typography";

export default function ProfilePage() {
  const favoriteMovies = [
    { title: "Avatar", image: "/f1.png" },
    { title: "Zero a Direita", image: "/f2.png" },
    { title: "Pânico VI", image: "/f3.png" },
    { title: "Vingadores", image: "/f4.png" },
    { title: "Avatar", image: "/f1.png" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#181d27] p-6 gap-6">
      <SideBar />

      <main className="flex-1 space-y-8">
        <section className="rounded-xl bg-[#232a36] p-6 space-y-5 shadow-lg">
          <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
            <Typography variant="h3" className="text-base font-bold text-white">
              Seus Favoritos
            </Typography>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favoriteMovies.map((movie, index) => (
              <div
                key={index}
                className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105 shadow-md cursor-pointer"
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-[#232a36] p-6 space-y-5 shadow-lg">
          <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
            <Typography variant="h3" className="text-base font-bold text-white">
              Vistos Recentemente
            </Typography>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favoriteMovies.map((movie, index) => (
              <div
                key={index}
                className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105 shadow-md cursor-pointer"
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}