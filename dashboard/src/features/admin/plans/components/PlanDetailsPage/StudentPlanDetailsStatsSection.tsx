import { Icon } from "@iconify/react";

import StatCard from "@/features/admin/shared/components/StatCard";
import type { StudentPlanDetailStats } from "@/features/admin/plans/services/plansService";

export default function StudentPlanDetailsStatsSection({
  stats,
}: {
  stats: StudentPlanDetailStats;
}) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-5">
      <StatCard
        title="إجمالي المهام"
        value={stats.totalTasks}
        icon={<Icon icon="solar:list-check-linear" className="size-7" />}
        color="#0f172a"
      />
      <StatCard
        title="المكتمل"
        value={stats.completedTasks}
        icon={<Icon icon="solar:check-circle-linear" className="size-7" />}
        color="#15803d"
      />
      <StatCard
        title="قيد التنفيذ"
        value={stats.pendingTasks}
        icon={<Icon icon="solar:clock-circle-linear" className="size-7" />}
        color="#d97706"
      />
      <StatCard
        title="المهام الفائتة"
        value={stats.missedTasks}
        icon={<Icon icon="solar:danger-triangle-linear" className="size-7" />}
        color="#be123c"
      />
      <StatCard
        title="تقدم الخطة"
        value={`${stats.progressPercent}%`}
        icon={<Icon icon="solar:chart-2-linear" className="size-7" />}
        color="#2563eb"
      />
    </section>
  );
}
