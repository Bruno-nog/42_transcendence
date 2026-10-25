"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/src/services/auth/user";
import {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  type UserReview,
  type ReviewPayload,
} from "@/src/services/auth/reviews";
import { useAuth } from "@/src/hooks/useAuth";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  movieId: number;
  movieTitle: string;
  onReviewChanged?: (message?: string) => void;
}

const emptyForm = {
  reviewText: "",
  rate: 0,
  acting: 0,
  direction: 0,
  photography: 0,
  screenplay: 0,
  soundtrack: 0,
  liked: false,
  watchedBefore: false,
  dateFilm: "",
};

export function ReviewModal({
  open,
  onClose,
  movieId,
  movieTitle,
  onReviewChanged,
}: ReviewModalProps) {
  const { isAuthenticated } = useAuth();

  const [userReview, setUserReview] = useState<UserReview | null>(null);
  const [reviewText, setReviewText] = useState(emptyForm.reviewText);
  const [rate, setRate] = useState(emptyForm.rate);
  const [acting, setActing] = useState(emptyForm.acting);
  const [direction, setDirection] = useState(emptyForm.direction);
  const [photography, setPhotography] = useState(emptyForm.photography);
  const [screenplay, setScreenplay] = useState(emptyForm.screenplay);
  const [soundtrack, setSoundtrack] = useState(emptyForm.soundtrack);
  const [liked, setLiked] = useState(emptyForm.liked);
  const [watchedBefore, setWatchedBefore] = useState(emptyForm.watchedBefore);
  const [dateFilm, setDateFilm] = useState(emptyForm.dateFilm);
  
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  function resetForm() {
    setUserReview(null);
    setReviewText(emptyForm.reviewText);
    setRate(emptyForm.rate);
    setActing(emptyForm.acting);
    setDirection(emptyForm.direction);
    setPhotography(emptyForm.photography);
    setScreenplay(emptyForm.screenplay);
    setSoundtrack(emptyForm.soundtrack);
    setLiked(emptyForm.liked);
    setWatchedBefore(emptyForm.watchedBefore);
    setDateFilm(emptyForm.dateFilm);
  }

  async function loadUserReview() {
    setLoadingReview(true);
    setReviewError(null);

    try {
      const profile = await getCurrentUser();
      const reviews = await getUserReviews(profile.id);
      const existingReview = reviews.find(
        (review) => review.media_id === movieId,
      );

      if (!existingReview) {
        resetForm();
        return;
      }

      setUserReview(existingReview);
      setReviewText(existingReview.review ?? "");
      setRate(existingReview.rate ?? 0);
      setActing(existingReview.acting ?? 0);
      setDirection(existingReview.direction ?? 0);
      setPhotography(existingReview.photography ?? 0);
      setScreenplay(existingReview.screenplay ?? 0);
      setSoundtrack(existingReview.soundtrack ?? 0);
      setLiked(existingReview.liked);
      setWatchedBefore(existingReview.watched_before);
      setDateFilm(existingReview.date_film?.slice(0, 10) ?? "");
    } catch (err) {
      console.error("Erro ao carregar review:", err);
      setReviewError("Não foi possível carregar sua avaliação.");
    } finally {
      setLoadingReview(false);
    }
  }

  useEffect(() => {
    if (open && isAuthenticated) {
      setReviewSuccess(null);
      setReviewError(null);
      void loadUserReview();
    }
  }, [open, isAuthenticated, movieId]);

  async function handleSaveReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(null);

    const payload: ReviewPayload = {
      mediaId: movieId,
      review: reviewText.trim(),
      rate,
      acting,
      direction,
      photography,
      screenplay,
      soundtrack,
      like: liked,
      whatchedBefore: watchedBefore,
      dateFilm: dateFilm || new Date().toISOString().split("T")[0],
    };

    try {
      const isEditing = !!userReview;
      if (isEditing) {
        await updateReview(userReview.id, payload);
      } else {
        await createReview(payload);
      }

      const msg = isEditing ? "Review atualizada com sucesso!" : "Review criada com sucesso!";
      setReviewSuccess(msg);
      onReviewChanged?.(msg);
      
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error("Erro ao salvar review:", err);
      setReviewError("Não foi possível salvar a review. Tente novamente.");
    } finally {
      setReviewLoading(false);
    }
  }

  async function handleDeleteReview() {
    if (!userReview) return;

    setReviewLoading(true);
    setReviewError(null);

    try {
      await deleteReview(userReview.id);
      const msg = "Review excluída com sucesso!";
      resetForm();
      setReviewSuccess(msg);
      onReviewChanged?.(msg);
      
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error("Erro ao excluir review:", err);
      setReviewError("Não foi possível excluir a review.");
    } finally {
      setReviewLoading(false);
    }
  }

  if (!open || !isAuthenticated) return null;

  const scoreFields = [
    { label: "Nota geral", value: rate, setValue: setRate },
    { label: "Atuação", value: acting, setValue: setActing },
    { label: "Direção", value: direction, setValue: setDirection },
    { label: "Fotografia", value: photography, setValue: setPhotography },
    { label: "Roteiro", value: screenplay, setValue: setScreenplay },
    { label: "Trilha sonora", value: soundtrack, setValue: setSoundtrack },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar avaliação"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
        >
          ✕
        </button>

        <h2 id="review-modal-title" className="mb-1 pr-10 text-xl font-bold">
          {userReview ? "Editar avaliação" : "Avaliar filme"}
        </h2>
        <p className="mb-5 text-sm text-zinc-400">{movieTitle}</p>

        {loadingReview ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <p className="text-sm text-zinc-400">Carregando sua avaliação...</p>
          </div>
        ) : (
          <form onSubmit={handleSaveReview} className="space-y-5">
            {/* Bloco Principal: Texto e Nota Geral */}
            <div className="space-y-4 rounded-lg bg-zinc-800/40 p-4 border border-zinc-800">
              <label className="block space-y-1">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Sua review</span>
                <textarea
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  placeholder="O que você achou do filme? Compartilhe seus pensamentos..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  rows={4}
                  required
                />
              </label>
            </div>

            {/* Critérios Técnicos (Colapsável ou Grid Organizado) */}
            <div className="space-y-3">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Critérios (0 a 10)</span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {scoreFields.map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-800/30 p-2.5"
                  >
                    <span className="text-sm text-zinc-300">{field.label}</span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={1}
                      value={field.value}
                      onChange={(event) =>
                        field.setValue(Number(event.target.value))
                      }
                      className="w-16 rounded-md border border-zinc-700 bg-zinc-800 p-1.5 text-center text-sm font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Informações Complementares */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-zinc-800/80">
              <label className="block space-y-1">
                <span className="text-xs text-zinc-400">Data em que assistiu</span>
                <input
                  type="date"
                  value={dateFilm}
                  onChange={(event) => setDateFilm(event.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"
                />
              </label>

              <div className="flex flex-col justify-center space-y-2 pt-1">
                <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={liked}
                    onChange={(event) => setLiked(event.target.checked)}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-emerald-600 focus:ring-emerald-500"
                  />
                  Gostei do filme ❤️
                </label>

                <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={watchedBefore}
                    onChange={(event) => setWatchedBefore(event.target.checked)}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-emerald-600 focus:ring-emerald-500"
                  />
                  Já tinha assistido antes 🔄
                </label>
              </div>
            </div>

            {reviewError && (
              <div role="alert" className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {reviewError}
              </div>
            )}

            {reviewSuccess && (
              <div role="status" className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
                {reviewSuccess}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-4">
              {userReview ? (
                <button
                  type="button"
                  onClick={handleDeleteReview}
                  disabled={reviewLoading}
                  className="rounded-lg bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-600/30 disabled:opacity-50"
                >
                  Excluir review
                </button>
              ) : <div />}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={reviewLoading || !reviewText.trim()}
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {reviewLoading
                    ? "Salvando..."
                    : userReview
                      ? "Atualizar review"
                      : "Salvar review"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}