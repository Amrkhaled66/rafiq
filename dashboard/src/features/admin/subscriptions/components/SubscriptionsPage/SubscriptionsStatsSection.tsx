import { Icon } from "@iconify/react";

import type { SubscriptionStats } from "@/features/admin/subscriptions/services/subscriptionService";
import StatCard from "@/features/admin/shared/components/StatCard";
import StatsRow from "@/features/admin/shared/components/StatsRow";

export default function SubscriptionsStatsSection({
  stats,
}: {
  stats: SubscriptionStats;
}) {
  return (
    <StatsRow>
      <StatCard
        title="إجمالي الاشتراكات"
        value={stats.totalCount}
        color="#d00507"
        icon={<Icon icon="material-symbols:subscriptions-outline" className="size-7" />}
      />
      <StatCard
        title="الاشتراكات النشطة"
        value={stats.activeSubscriptions}
        color="#15803d"
        icon={<Icon icon="solar:check-circle-linear" className="size-7" />}
      />
      <StatCard
        title="قريبة الانتهاء"
        value={stats.soonEndingSubscriptions}
        color="#c2410c"
        icon={<Icon icon="solar:alarm-linear" className="size-7" />}
      />
      <StatCard
        title="الاشتراكات المنتهية"
        value={stats.endedSubscriptions}
        color="#7c3aed"
        icon={<Icon icon="solar:calendar-mark-linear" className="size-7" />}
      />
    </StatsRow>
  );
}
