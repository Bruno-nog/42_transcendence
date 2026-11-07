import { Typography } from "@/src/components/ui/Typography";
import { type UserStats } from "@/src/services/auth/user";
import { useTranslations } from "next-intl";

interface UserStatsProps {
  stats: UserStats | null;
  loading: boolean;
}

export function UserStatsSection({ stats, loading }: UserStatsProps) {
  const t = useTranslations('Profile');
  
  if (loading) {
    return (
      <section className="rounded-xl bg-[#232a36] p-6 space-y-5 shadow-lg">
        <Typography className="text-gray-400">{t("LOADING_STATISTICS")}</Typography>
      </section>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      label: `${t("STATISTICS_REVIEWS")}`,
      value: stats.total_reviews,
      icon: "📝",
    },
    {
      label: `${t("STATISTICS_AVERAGE_RATING")}`,
      value: `${stats.average_rating} / 10`,
      icon: "⭐",
    },
    {
      label: `${t("STATISTICS_LIKES_RECEIVED")}`,
      value: stats.total_likes_received,
      icon: "❤️",
    },
    {
      label: `${t("STATISTICS_FAVORITES")}`,
      value: stats.total_favorites,
      icon: "🔖",
    },
    {
      label: `${t("STATISTICS_FRIENDS")}`,
      value: stats.total_friends,
      icon: "👥",
    },
  ];

  return (
    <section className="rounded-xl bg-[#232a36] p-6 space-y-5 shadow-lg">
      <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
        <Typography variant="h3" className="text-base font-bold text-white">
          {t("STATISTICS")}
        </Typography>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800 transition-all text-center"
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <Typography className="text-2xl font-bold text-emerald-400">
              {item.value}
            </Typography>
            <Typography className="text-xs text-gray-400 mt-1">
              {item.label}
            </Typography>
          </div>
        ))}
      </div>
    </section>
  );
}