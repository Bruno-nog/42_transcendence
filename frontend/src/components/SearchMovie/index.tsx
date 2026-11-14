"use client"

import { useState } from "react";
import { useSearchMedia } from "@/src/hooks/useSearchMedia";
import { MovieDetailsModal } from "../MovieDetailsModal";
import { MediaCard } from "../media/MediaCard";
import { Media } from "@/src/types/media";
import { useTranslations } from "next-intl";

export default function SearchMovie() {
  const t = useTranslations('Common');
  const [title, setTitle] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const { mutate, data, isPending, error, reset } = useSearchMedia();

  function handleSearch() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    mutate(trimmedTitle);
  }

  function handleClear() {
    setTitle("");
    reset();
  }

  return (
    <section className="mx-auto max-w-container px-4 md:px-0 space-y-6 mb-12">
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">
        {t('DISCOVER_MOVIES')}
      </h1>

      <div className="flex flex-col sm:flex-row max-w-2xl gap-3">
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            placeholder="Digite o nome de um filme"
            value={title}
            onChange={(event) => {
              const value = event.target.value;
              setTitle(value);
              if (!value.trim()) {
                reset();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            className="h-11 w-full rounded-md border border-border bg-surface pl-4 pr-10 text-white outline-none placeholder:text-muted focus:border-primary text-sm md:text-base"
          />

          {title && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 text-gray-400 hover:text-white transition-colors text-sm font-bold p-1 rounded-full"
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={isPending}
          className="h-11 rounded-md bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90 transition-opacity text-sm md:text-base shrink-0"
        >
          {isPending ? `${t('SEARCHING')}` : `${t('SEARCH')}`}
        </button>
      </div>

      {error && (
        <p className="text-danger text-sm md:text-base">
          {t('THE_MOVIE_COULD_NOT_BE_FOUND')}
        </p>
      )}

      {data && (
        <section className="space-y-4 pt-4">
          <h2 className="text-lg md:text-xl font-semibold text-white">
            {t('SEARCH_RESULTS')}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.isArray(data) ? (
              data.map((movie: Media) => (
                <MediaCard
                  key={movie.external_id}
                  media={movie}
                  onClick={() => setSelectedMovieId(String(movie.external_id))}
                />
              ))
            ) : (
              <MediaCard
                media={data}
                onClick={() => setSelectedMovieId(String(data.external_id))}
              />
            )}
          </div>
        </section>
      )}

      <MovieDetailsModal
        movieId={selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
      />
    </section>
  );
}