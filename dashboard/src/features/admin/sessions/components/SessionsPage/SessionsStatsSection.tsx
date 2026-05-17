import { Icon } from "@iconify/react";

import type { SessionStats } from "@/features/admin/sessions/services/sessionService";
import StatCard from "@/features/admin/shared/components/StatCard";
import StatsRow from "@/features/admin/shared/components/StatsRow";

export default function SessionsStatsSection({
  stats,
}: {
  stats: SessionStats;
}) {
  return (
    <StatsRow>
      <StatCard
        title="إجمالي الجلسات"
        value={stats.totalSessions}
        color="#d00507"
        icon={<Icon icon="solar:clipboard-list-linear" className="size-7" />}
      />
      <StatCard
        title="الجلسات الجارية"
        value={stats.runningSessions}
        color="#0284c7"
        icon={<Icon icon="solar:play-circle-linear" className="size-7" />}
      />
      <StatCard
        title="الجلسات المكتملة"
        value={stats.completedSessions}
        color="#15803d"
        icon={<Icon icon="solar:check-circle-linear" className="size-7" />}
      />
      <StatCard
        title="الجلسات المتوقفة"
        value={stats.stoppedSessions}
        color="#b45309"
        icon={<Icon icon="solar:stop-circle-linear" className="size-7" />}
      />
    </StatsRow>
  );
}
