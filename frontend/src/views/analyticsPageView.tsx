"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  exportAnalytics,
  getMyAnalytics,
  type AnalyticsData,
  type AnalyticsFilters,
} from "@/src/services/auth/analytics";
import SideBar from "../components/SideBar";
import { Link } from "../i18n/routing";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function AnalyticsPageView() {
  const t = useTranslations('Analytics');
  const locale = useLocale();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    start_date: "",
    end_date: "",
    category: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<AnalyticsFilters>({});

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getMyAnalytics();
        setAnalytics(data);
      } catch {
        setError(t('UNABLE_TO_LOAD_ANALYTICS') || "Não foi possível carregar suas estatísticas.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [t]);

  async function applyFilters(nextFilters: AnalyticsFilters) {
    try {
      setLoading(true);
      setError("");
      const data = await getMyAnalytics(nextFilters);
      setAnalytics(data);
      setAppliedFilters({ ...nextFilters });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as estatísticas com esses filtros."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyFilters() {
    if (
      filters.start_date &&
      filters.end_date &&
      filters.start_date > filters.end_date
    ) {
      setError("A data inicial não pode ser posterior à data final.");
      return;
    }

    await applyFilters({
      start_date: filters.start_date || undefined,
      end_date: filters.end_date || undefined,
      category: filters.category.trim() || undefined,
    });
  }

  async function handleClearFilters() {
    const emptyFilters: AnalyticsFilters = {
      start_date: "",
      end_date: "",
      category: "",
    };
    setFilters(emptyFilters);
    await applyFilters({});
  }

  async function handleExport(format: "csv" | "pdf") {
    try {
      setExporting(format);
      setError("");
      await exportAnalytics(format, appliedFilters);
    } catch {
      setError(`Não foi possível exportar o arquivo ${format.toUpperCase()}.`);
    } finally {
      setExporting(null);
    }
  }

  const monthlyEvolution = analytics?.monthly_evolution ?? [];
  const maxReviews = Math.max(
    ...monthlyEvolution.map((item) => item.reviews_count),
    1
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 rounded bg-neutral-800" />
            <div className="h-4 w-80 rounded bg-neutral-800" />
            <div className="grid gap-4 pt-6 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl border border-neutral-800 bg-neutral-900"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !analytics) {
    return (
      <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100 md:p-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">{t('ANALYTICS')}</h1>
          <p className="mt-4 text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-neutral-200"
          >
            {t('TRY_AGAIN')}
          </button>
        </div>
      </main>
    );
  }

  if (!analytics) return null;

  return (
    <>
      <header className="w-full relative z-10 flex items-center justify-around gap-8 rounded-2xl px-6 py-2.5 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍿</span>
        </Link>

        <nav className="flex items-center justify-around gap-6">
          <Link href="/" className="text-sm font-medium text-white hover:text-emerald-400">
            {t('HOME')}
          </Link>
          <Link href="/movies" className="text-sm font-medium text-gray-300 hover:text-white">
            {t('MOVIES')}
          </Link>
        </nav>

        <LanguageSwitcher />
      </header>

      <div className="flex items-start justify-between min-h-screen bg-neutral-950">
        <SideBar />

        <main className="flex-1 w-full max-w-7xl px-4 py-8 text-neutral-100 sm:px-6 lg:px-10 overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
                  {t('YOUER_HISTORY')}
                </p>
                <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl break-words">
                  {t('ANALYTICS')}
                </h1>
                <p className="mt-2 text-neutral-400 break-words">
                  {t('TRACK_YOUR_REVIEWS_AND_DISCOVER_YOUR_CONSUMPTION_HABITS')}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleExport("csv")}
                  disabled={exporting !== null}
                  className="rounded-xl border border-neutral-700 px-4 py-2.5 text-sm font-medium transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {exporting === "csv" ? t('EXPORTING') || "Exportando..." : t('EXPORT_CSV') || "Exportar CSV"}
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  disabled={exporting !== null}
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {exporting === "pdf" ? t('EXPORTING') || "Exportando..." : t('EXPORT_PDF') || "Exportar PDF"}
                </button>
              </div>
            </header>

            <section className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
              <h2 className="text-lg font-semibold">{t('FILTER_STATISTICS')}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <label className="flex flex-col gap-2 text-sm text-neutral-300">
                  {t('START_DATE')}
                  <input
                    type="date"
                    value={filters.start_date ?? ""}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        start_date: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-neutral-300">
                  {t('END_DATE')}
                  <input
                    type="date"
                    value={filters.end_date ?? ""}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        end_date: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-neutral-300">
                  {t('GENRE')}
                  <input
                    type="text"
                    value={filters.category ?? ""}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                    placeholder="Ex.: Aventura"
                    className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 placeholder:text-neutral-600"
                  />
                </label>
                <div className="flex flex-wrap items-end gap-2">
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    disabled={loading}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
                  >
                    {t('APPLY')}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    disabled={loading}
                    className="rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {t('CLEAR')}
                  </button>
                </div>
              </div>
            </section>

            {error && (
              <p className="mt-5 rounded-xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 overflow-hidden">
                <p className="text-sm text-neutral-400 break-words">{t('TOTAL_REVIEWS')}</p>
                <p className="mt-4 text-4xl font-bold">
                  {analytics.total_reviews}
                </p>
                <p className="mt-2 text-sm text-neutral-500 break-words">
                  {t('REGISTERED_REVIEWS')}
                </p>
              </article>

              <article className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 overflow-hidden">
                <p className="text-sm text-neutral-400 break-words">{t('AVERAGE_RATING')}</p>
                <div className="mt-4 flex items-end gap-2">
                  <p className="text-4xl font-bold">
                    {Number(analytics.average_rate).toFixed(1)}
                  </p>
                  <span className="mb-1 text-lg text-amber-400">/ 10</span>
                </div>
                <p className="mt-2 text-sm text-neutral-500 break-words">
                  {t('YOUR_AVERAGE_RATING')}
                </p>
              </article>

              <article className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:col-span-2 xl:col-span-1 overflow-hidden">
                <p className="text-sm text-neutral-400 break-words">{t('FAVORITE_GENRE')}</p>
                <p className="mt-4 text-3xl font-bold truncate">
                  {analytics.favorite_genre || (t('NOT_DEFINED_YET') || "Ainda não definido")}
                </p>
                <p className="mt-2 text-sm text-neutral-500 break-words">
                  {t('YOUR_MOST_FREQUENT_GENRE')}
                </p>
              </article>
            </section>

            <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:p-8">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold">{t('MONTHLY_EVOLUTION')}</h2>
                  <p className="mt-1 text-sm text-neutral-400">
                    {t('NUMBER_OF_REVIEWS_PER_MONTH')}
                  </p>
                </div>
                <span className="text-sm text-neutral-500">
                  {monthlyEvolution.length}{" "}
                  {monthlyEvolution.length === 1
                    ? t('MONTH') || "mês"
                    : t('MONTHS') || "meses"}
                </span>
              </div>

              {monthlyEvolution.length === 0 ? (
                <div className="mt-8 rounded-xl border border-dashed border-neutral-700 p-8 text-center">
                  <p className="font-medium">{t('NO_DATA_TO_DISPLAY_YET')}</p>
                  <p className="mt-2 text-sm text-neutral-400">
                    {t('YOUR_REVIEWS_WILL_APPEAR_HERE_AS_YOU_USE_THE_PLATFORM')}
                  </p>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="flex h-64 items-end gap-3 overflow-x-auto pb-2">
                    {monthlyEvolution.map((item, index) => {
                      const height = Math.max(
                        (item.reviews_count / maxReviews) * 100,
                        5
                      );

                      const monthLabel = new Date(
                        item.year,
                        item.month - 1
                      ).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR", {
                        month: "short",
                        year: "numeric",
                      });

                      return (
                        <div
                          key={`${item.month}-${index}`}
                          className="flex h-full min-w-12 flex-1 flex-col items-center justify-end gap-3"
                        >
                          <span className="text-xs text-neutral-300">
                            {item.reviews_count}
                          </span>
                          <div className="flex h-full w-full items-end">
                            <div
                              title={`${item.reviews_count} ${t('REVIEWS') || 'avaliações'}`}
                              className="w-full rounded-t-lg bg-violet-600 transition-all hover:bg-violet-400"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                          <span className="whitespace-nowrap text-xs text-neutral-400 capitalize">
                            {monthLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="text-xl font-semibold">{t('ABOUT_YOUR_DATA')}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                {t('DATA_DISCLAIMER')}
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}