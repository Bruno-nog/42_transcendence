import { Media } from "@/src/types/media";
import Link from "next/link";

interface MediaCardProps {
  media: Media;
}

export function MediaCard({ media }: MediaCardProps) {
  const releaseYear = media.release_date
    ? media.release_date.split("-")[0]
    : "—";

  return (
    <Link
      href={`/films/${media.id}`}
      className="block w-full max-w-[220px]"
    >
      <article className="w-full max-w-[220px] overflow-hidden rounded-lg bg-card">
        <div className="aspect-[2/3] w-full overflow-hidden bg-surface">
          {media.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
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
              ★ {media.vote_average?.toFixed(1)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}