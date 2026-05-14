import { Icon } from "@iconify/react";
import StatCard from "@/features/admin/shared/components/StatCard";
import type { CoachOverviewStats } from "@/features/admin/coaches/services/coachService";

export default function CoachStatsSection({
  stats,
}: {
  stats: CoachOverviewStats;
}) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="إجمالي الطلاب"
          value={stats.totalAssignedStudents}
          color="#d00507"
          icon={
            <Icon icon="solar:users-group-rounded-linear" className="size-7" />
          }
        />
        {/* <StatCard
          title="المهام الفائتة"
          value={stats.missedTasks}
          color="#be123c"
          icon={<Icon icon="solar:danger-triangle-linear" className="size-7" />}
        /> */}
        <StatCard
          title="الخطط المنشأة"
          value={stats.createdPlans}
          color="#1f7a5a"
          icon={
            <Icon icon="solar:notebook-bookmark-linear" className="size-7" />
          }
        />
      </div>
    </section>
  );
}
