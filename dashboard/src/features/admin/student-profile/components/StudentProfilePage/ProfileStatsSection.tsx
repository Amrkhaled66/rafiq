import { Icon } from "@iconify/react";
import StatCard from "@/features/admin/shared/components/StatCard";

type ProfileStats = {
  totalMissedTasks: number;
  totalMissedLessons: number;
  totalPlans: number;
  totalLessons: number;
};

export default function ProfileStatsSection({
  stats,
}: {
  stats: ProfileStats;
}) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="مهام فائتة"
          value={stats.totalMissedTasks}
          color="#be123c"
          icon={<Icon icon="solar:danger-triangle-linear" className="size-7" />}
        />
        <StatCard
          title="حصص فائتة"
          value={stats.totalMissedLessons}
          color="#d97706"
          icon={<Icon icon="solar:videocamera-record-linear" className="size-7" />}
        />
        <StatCard
          title="خطط دراسية"
          value={stats.totalPlans}
          color="#1f7a5a"
          icon={<Icon icon="solar:clipboard-list-linear" className="size-7" />}
        />
        <StatCard
          title="دروس مجدولة"
          value={stats.totalLessons}
          color="#2563eb"
          icon={<Icon icon="solar:book-bookmark-linear" className="size-7" />}
        />
      </div>
    </section>
  );
}
