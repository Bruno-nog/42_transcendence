import { api } from "@/src/lib/axios";

export interface MonthlyEvolution {
  year: number;
  month: number;
  reviews_count: number;
  average_rate: number;
}

export interface AnalyticsData {
  total_reviews: number;
  average_rate: number;
  favorite_genre: string | null;
  monthly_evolution: MonthlyEvolution[];
}

export interface AnalyticsFilters {
  start_date?: string;
  end_date?: string;
  category?: string;
}

function cleanFilters(filters: AnalyticsFilters = {}): AnalyticsFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value != null),
  ) as AnalyticsFilters;
}

export async function getMyAnalytics(
  filters: AnalyticsFilters = {},
): Promise<AnalyticsData> {
  const { data } = await api.get<AnalyticsData>("/analytics/me", {
    params: cleanFilters(filters),
  });
  return data;
}

export async function exportAnalytics(
  format: "csv" | "pdf",
  filters: AnalyticsFilters = {},
): Promise<void> {
  const response = await api.get(`/analytics/me/export/${format}`, {
    params: cleanFilters(filters),
    responseType: "blob",
  });

  const blobUrl = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `analytics.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}
