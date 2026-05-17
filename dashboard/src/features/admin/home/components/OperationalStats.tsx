import { Icon } from "@iconify/react";

import StatCard from "@/features/admin/shared/components/StatCard";
import StatsRow from "@/features/admin/shared/components/StatsRow";
import type { MissedTasksStats } from "@/features/admin/missed-tasks/services/missedTasksService";
import type { SessionStats } from "@/features/admin/sessions/services/sessionService";
import type { SubscriptionStats } from "@/features/admin/subscriptions/services/subscriptionService";

export default function OperationalStats({
  missedStats,
  sessionsStats,
  subscriptionsStats,
  isSuperAdmin,
}: {
  missedStats?: MissedTasksStats;
  sessionsStats?: SessionStats;
  subscriptionsStats?: SubscriptionStats;
  isSuperAdmin: boolean;
}) {
  return (
    <StatsRow>
      <StatCard
        title="المهام الفائتة غير المحلولة"
        value={missedStats?.totalUnresolved ?? "-"}
        icon={<Icon icon="material-symbols:event-busy-outline" />}
        color="#d00507"
      />
      <StatCard
        title="الجلسات الجارية"
        value={sessionsStats?.runningSessions ?? "-"}
        icon={<Icon icon="material-symbols:timer-outline" />}
        color="#0ea5e9"
      />
      {isSuperAdmin ? (
        <StatCard
          title="اشتراكات قاربت على الانتهاء"
          value={subscriptionsStats?.soonEndingSubscriptions ?? "-"}
          icon={<Icon icon="material-symbols:subscriptions-outline" />}
          color="#a16207"
        />
      ) : null}
      {isSuperAdmin ? (
        <StatCard
          title="اشتراكات فعّالة"
          value={subscriptionsStats?.activeSubscriptions ?? "-"}
          icon={<Icon icon="material-symbols:verified-outline" />}
          color="#16a34a"
        />
      ) : null}
    </StatsRow>
  );
}

