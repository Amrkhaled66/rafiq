import { Icon } from "@iconify/react";

import StatCard from "@/features/admin/shared/components/StatCard";

export type StudentPlansStats = {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  missedTasks: number;
  upcomingTasks: number;
};

export default function StudentPlansStatsSection({
  stats,
}: {
  stats: StudentPlansStats;
}) {
  return (
    <section className="grid grid-cols-5 gap-4 md:gap-6 ">
      <StatCard
        title="إجمالي الخطط"
        value={stats.totalPlans}
        color="#0f172a"
        icon={<Icon icon="solar:notebook-bookmark-linear" className="size-7" />}
      />
      <StatCard
        title="الخطط النشطة"
        value={stats.activePlans}
        color="#d97706"
        icon={<Icon icon="solar:clock-circle-linear" className="size-7" />}
      />
      <StatCard
        title="الخطط المكتملة"
        value={stats.completedPlans}
        color="#1f7a5a"
        icon={
          <Icon icon="solar:checklist-minimalistic-linear" className="size-7" />
        }
      />
      <StatCard
        title="المهام الفائتة"
        value={stats.missedTasks}
        color="#be123c"
        icon={<Icon icon="solar:danger-triangle-linear" className="size-7" />}
      />
      <StatCard
        title="المهام القادمة"
        value={stats.upcomingTasks}
        color="#2563eb"
        icon={<Icon icon="solar:calendar-add-linear" className="size-7" />}
      />
    </section>
  );
}
