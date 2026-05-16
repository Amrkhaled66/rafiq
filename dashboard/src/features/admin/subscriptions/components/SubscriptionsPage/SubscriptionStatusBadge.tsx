import type { SubscriptionStatus } from "@/features/admin/subscriptions/services/subscriptionService";

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "نشط",
  upcoming: "قادم",
  ended: "منتهٍ",
  cancelled: "ملغي",
};

const STATUS_CLASSES: Record<SubscriptionStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-sky-100 text-sky-700",
  ended: "bg-amber-100 text-amber-800",
  cancelled: "bg-slate-100 text-slate-700",
};

export default function SubscriptionStatusBadge({
  status,
}: {
  status: SubscriptionStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
