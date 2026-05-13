import { Icon } from "@iconify/react";
import StatCard from "@/features/admin/shared/components/StatCard";
import type { StudentOverviewStats } from "@/features/admin/students/services/studentService";

export default function StudentStatsSection({
  stats,
}: {
  stats: StudentOverviewStats;
}) {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="مهام اليوم"
          value={stats.totalTasks}
          color="#d00507"
          icon={<Icon icon="solar:clipboard-list-linear" className="size-7" />}
        />
        <StatCard
          title="مكتمل"
          value={stats.completedTasks}
          color="#1f7a5a"
          icon={
            <Icon
              icon="solar:checklist-minimalistic-linear"
              className="size-7"
            />
          }
        />
        <StatCard
          title="متبقي"
          value={stats.remainingTasks}
          color="#d97706"
          icon={<Icon icon="solar:clock-circle-linear" className="size-7" />}
        />
        <StatCard
          title="فائت"
          value={stats.missedTasks}
          color="#be123c"
          icon={<Icon icon="solar:danger-triangle-linear" className="size-7" />}
        />
        <div className="dashboard-card text-right">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-foreground text-lg font-bold">نسبة الانجاز</h2>
            <span className="text-brand-primary text-sm font-medium">
              {stats.completionRate}%
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="from-brand-primary h-full rounded-full bg-linear-to-r to-blue-500 transition-all duration-300"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
