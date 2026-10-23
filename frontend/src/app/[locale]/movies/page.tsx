"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import Footer from "@/src/components/Fotter";
import Header from "@/src/components/Header";
import { Media } from "@/src/types/media";
import { MovieDetailsModal } from "@/src/components/MovieDetailsModal";
import { MediaCard } from "@/src/components/media/MediaCard";
import { Button } from "@/src/components/ui/button";

const ITEMS_PER_PAGE = 10;

export default function AllMoviesPage() {
  const [dbMovies, setDbMovies] = useState<Media[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recent");

  const API_BASE_URL = "https://localhost:8000";

  useEffect(() => {
    async function fetchAllMovies() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/movies?limit=500`);
        if (res.ok) {
          const result = await res.json();
          setDbMovies(result);
        }
      } catch (err) {
        console.error("Erro ao carregar filmes do banco:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllMovies();
  }, []);

  const availableYears = useMemo(() => {
    const years = dbMovies
      .map((m) => m.release_year)
      .filter((year): year is number => Boolean(year));
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [dbMovies]);

  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>();
    dbMovies.forEach((m) => {
      if (m.genres) {
        m.genres.split(",").forEach((g) => {
          const trimmed = g.trim();
          if (trimmed) genreSet.add(trimmed);
        });
      }
    });
    return Array.from(genreSet).sort();
  }, [dbMovies]);

  const processedMovies = useMemo(() => {
    let result = dbMovies.filter((movie) => {
      const matchesSearch = movie.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesYear = selectedYear
        ? String(movie.release_year) === selectedYear
        : true;

      const matchesGenre = selectedGenre
        ? movie.genres?.toLowerCase().includes(selectedGenre.toLowerCase())
        : true;

      return matchesSearch && matchesYear && matchesGenre;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "year_desc") {
        return (b.release_year || 0) - (a.release_year || 0);
      }
      if (sortBy === "year_asc") {
        return (a.release_year || 0) - (b.release_year || 0);
      }

      return (b.id || 0) - (a.id || 0);
    });

    return result;
  }, [dbMovies, searchTerm, selectedYear, selectedGenre, sortBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedYear("");
    setSelectedGenre("");
    setSortBy("recent");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm || selectedYear || selectedGenre || sortBy !== "recent";

  const totalPages = Math.ceil(processedMovies.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMovies = processedMovies.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#181d24] text-[#9ab] flex flex-col items-center justify-between">
        <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2c3440] pb-4 text-xs font-semibold tracking-wider text-gray-400">
            <div className="flex flex-wrap items-center gap-3 uppercase">
              <span className="text-gray-500 font-normal">Navegar Por</span>

              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="bg-[#202832] text-xs text-gray-300 hover:text-white rounded px-2.5 py-1.5 border border-[#2c3440] focus:border-emerald-500 focus:outline-none transition cursor-pointer appearance-none pr-6"
                >
                  <option value="">ANO (TODOS)</option>
                  {availableYears.map((year) => (
                    <option key={year} value={String(year)}>
                      {year}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">
                  ▼
                </span>
              </div>

              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={handleGenreChange}
                  className="bg-[#202832] text-xs text-gray-300 hover:text-white rounded px-2.5 py-1.5 border border-[#2c3440] focus:border-emerald-500 focus:outline-none transition cursor-pointer appearance-none pr-6"
                >
                  <option value="">GÊNERO (TODOS)</option>
                  {availableGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre.toUpperCase()}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">
                  ▼
                </span>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="bg-[#202832] text-xs text-gray-300 hover:text-white rounded px-2.5 py-1.5 border border-[#2c3440] focus:border-emerald-500 focus:outline-none transition cursor-pointer appearance-none pr-6"
                >
                  <option value="recent">ORDENAR: ADICIONADOS</option>
                  <option value="year_desc">ANO: MAIS NOVO</option>
                  <option value="year_asc">ANO: MAIS ANTIGO</option>
                  <option value="title">TÍTULO (A-Z)</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">
                  ▼
                </span>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-[11px] normal-case transition ml-1"
                >
                  <X size={12} /> Limpar
                </button>
              )}
            </div>

            <div className="relative flex items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="BUSCAR FILME..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full sm:w-52 bg-[#202832] text-xs text-white placeholder-gray-500 rounded px-3 py-1.5 pr-8 border border-[#2c3440] focus:border-emerald-500 focus:outline-none transition"
              />
              <Search size={14} className="absolute right-2.5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-[#2c3440] pb-2">
            <h2 className="text-xs uppercase font-semibold tracking-widest text-gray-400">
              Filmes no Banco de Dados
            </h2>
            <span className="text-xs text-gray-500">
              Exibindo {processedMovies.length > 0 ? startIndex + 1 : 0} -{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, processedMovies.length)} de{" "}
              {processedMovies.length}
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-sm text-gray-400">
              Carregando filmes...
            </div>
          ) : paginatedMovies.length === 0 ? (
            <div className="py-20 text-center text-sm text-gray-400">
              Nenhum filme encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paginatedMovies.map((movie) => (
                <MediaCard
                  key={movie.id}
                  media={movie}
                  onClick={() => setSelectedMovieId(String(movie.external_id))}
                />
              ))}
            </div>
          )}

          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#2c3440] text-xs">
              <Button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-[#202832] text-gray-300 hover:bg-emerald-600 hover:text-white disabled:opacity-30 disabled:hover:bg-[#202832] disabled:hover:text-gray-300 transition"
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    const prevPage = array[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-1 text-gray-500">...</span>
                        )}
                        <Button
                          onClick={() => goToPage(page)}
                          className={`px-3 py-1 rounded transition font-medium ${
                            currentPage === page
                              ? "bg-emerald-500 text-black font-bold"
                              : "bg-[#202832] text-gray-400 hover:bg-[#2c3440] hover:text-white"
                          }`}
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>

              <Button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded bg-[#202832] text-gray-300 hover:bg-emerald-600 hover:text-white disabled:opacity-30 disabled:hover:bg-[#202832] disabled:hover:text-gray-300 transition"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}

          <MovieDetailsModal
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
          />
        </main>

        <Footer />
      </div>
    </>
  );
}