import { Icon } from "@iconify/react";

import type { MissedTasksStats } from "@/features/admin/missed-tasks/services/missedTasksService";
import StatCard from "@/features/admin/shared/components/StatCard";
import StatsRow from "@/features/admin/shared/components/StatsRow";

export default function MissedTasksStatsSection({
  stats,
}: {
  stats: MissedTasksStats;
}) {
  return (
    <StatsRow>
      <StatCard
        title="إجمالي المهام الفائتة"
        value={stats.totalMissed}
        color="#be123c"
        icon={<Icon icon="solar:danger-triangle-linear" className="size-7" />}
      />
      <StatCard
        title="إجمالي المهام المحلولة"
        value={stats.totalResolved}
        color="#15803d"
        icon={<Icon icon="solar:check-circle-linear" className="size-7" />}
      />
      <StatCard
        title="المهام غير المحلولة"
        value={stats.totalUnresolved}
        color="#b45309"
        icon={<Icon icon="solar:clock-circle-linear" className="size-7" />}
      />
    </StatsRow>
  );
}
