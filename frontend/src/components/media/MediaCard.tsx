import { Media } from "@/src/types/media";

interface MediaCardProps {
  media: Media;
  onClick: () => void;
}

export function MediaCard({ media, onClick }: MediaCardProps) {
  const releaseYear = media.release_year;

  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full max-w-[220px] text-left"
    >
      <article className="overflow-hidden rounded-lg bg-card transition-transform hover:-translate-y-1">
        <div className="aspect-[2/3] w-full overflow-hidden bg-surface">
          {media.cover_url ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${media.cover_url}`}
              alt={`Poster de ${media.title}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              Sem imagem
            </div>
          )}
        </div>

        <div className="space-y-2 p-3">
          <h2 className="truncate font-semibold text-white">
            {media.title}
          </h2>

          <div className="flex items-center justify-between text-sm text-muted">
            <span>{releaseYear}</span>

            <span>
              ★ {media.vote_average?.toFixed(1) ?? "—"}
            </span>
          </div>
        </div>
      </article>
    </button>
  );
}