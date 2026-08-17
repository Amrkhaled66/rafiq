import { Icon } from "@iconify/react";
import type { MissedLessonsStats as Stats } from "@/features/admin/missed-lessons/services/missedLessonsService";
import StatCard from "@/features/admin/shared/components/StatCard";
import StatsRow from "@/features/admin/shared/components/StatsRow";

export default function MissedLessonsStats({ stats }: { stats: Stats }) {
  return (
    <StatsRow>
      <StatCard
        title="إجمالي الحصص الفائتة"
        value={stats.totalMissed}
        color="#be123c"
        icon={<Icon icon="solar:videocamera-record-linear" />}
      />
      <StatCard
        title="لم تُشاهد"
        value={stats.totalUnwatched}
        color="#b45309"
        icon={<Icon icon="solar:eye-closed-linear" />}
      />
      <StatCard
        title="شوهدت متأخرًا"
        value={stats.totalWatchedLate}
        color="#0369a1"
        icon={<Icon icon="solar:eye-linear" />}
      />
      <StatCard
        title="تمت المتابعة"
        value={stats.totalResolved}
        color="#15803d"
        icon={<Icon icon="solar:check-circle-linear" />}
      />
      <StatCard
        title="بحاجة للمتابعة"
        value={stats.totalUnresolved}
        color="#a21caf"
        icon={<Icon icon="solar:clock-circle-linear" />}
      />
    </StatsRow>
  );
}
