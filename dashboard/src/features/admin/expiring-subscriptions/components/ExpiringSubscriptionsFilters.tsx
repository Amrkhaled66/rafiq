import DropDownMenu from "@/shared/components/DropDownMenu";
import type { ExpiringSubscriptionDays } from "@/features/admin/expiring-subscriptions/services/expiringSubscriptionsService";

const DAY_OPTIONS = [
  { label: "خلال 3 أيام", value: "3" },
  { label: "خلال 7 أيام", value: "7" },
  { label: "خلال 14 يومًا", value: "14" },
  { label: "خلال 30 يومًا", value: "30" },
];

export default function ExpiringSubscriptionsFilters({
  days,
  onDaysChange,
}: {
  days: ExpiringSubscriptionDays;
  onDaysChange: (days: ExpiringSubscriptionDays) => void;
}) {
  return (
    <section className="dashboard-card">
      <div className="max-w-sm">
        <DropDownMenu
          label="موعد انتهاء الاشتراك"
          value={String(days)}
          items={DAY_OPTIONS}
          onChange={(value) =>
            onDaysChange(Number(value) as ExpiringSubscriptionDays)
          }
        />
      </div>
    </section>
  );
}
