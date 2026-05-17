import { Icon } from "@iconify/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/Button";
import SectionCard from "./SectionCard";
import type { MissedTasksResponse } from "@/features/admin/missed-tasks/services/missedTasksService";
import type { TaskSessionsResponse } from "@/features/admin/sessions/services/sessionService";
import type { SubscriptionsResponse } from "@/features/admin/subscriptions/services/subscriptionService";
import { formatDateArShort, formatTimeAr } from "@/shared/utils/dates";

function emptyState(label: string) {
  return (
    <div className="text-subTitle rounded-2xl border border-dashed border-black/10 p-4 text-sm">
      {label}
    </div>
  );
}

export default function ActionInbox({
  missedUnresolved,
  runningSessions,
  subscriptions,
  isSuperAdmin,
  now,
}: {
  missedUnresolved?: MissedTasksResponse;
  runningSessions?: TaskSessionsResponse;
  subscriptions?: SubscriptionsResponse;
  isSuperAdmin: boolean;
  now: Date;
}) {
  const navigate = useNavigate();

  const endingSoonRows = useMemo(() => {
    if (!subscriptions) return [];
    const nowDate = new Date(now);
    const in7 = new Date(nowDate);
    in7.setDate(in7.getDate() + 7);

    return subscriptions.items
      .filter((row) => row.status === "active")
      .filter((row) => {
        const endsAt = new Date(row.endsAt);
        return endsAt >= nowDate && endsAt <= in7;
      })
      .slice(0, 10);
  }, [subscriptions, now]);

  return (
    <SectionCard
      title="صندوق المتابعة"
      action={
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("missed-tasks")}
        >
          عرض المهام الفائتة
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="bg-brand-primary-soft/40 px-3 py-4 rounded-xl">
          <div className="mb-2  flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols:event-busy-outline"
                className="text-brand-primary size-5"
              />
              <h3 className="text-foreground font-semibold">
                مهام فائتة غير محلولة
              </h3>
            </div>
            <button
              type="button"
              className="text-brand-primary text-sm hover:underline"
              onClick={() =>
                navigate("missed-tasks", { state: { status: "unresolved" } })
              }
            >
              عرض الكل
            </button>
          </div>

          {missedUnresolved?.items?.length ? (
            <ul className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5">
              {missedUnresolved.items.map((row) => (
                <li key={row.taskId}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate("missed-tasks", {
                        state: { focusTaskId: row.taskId },
                      })
                    }
                    className="flex w-full items-start justify-between gap-3 p-4 text-right hover:bg-black/2"
                  >
                    <div className="min-w-0">
                      <p className="text-foreground truncate font-medium">
                        {row.studentName} · {row.taskName}
                      </p>
                      <p className="text-subTitle mt-1 truncate text-sm">
                        {row.planName}
                      </p>
                    </div>
                    <div className="shrink-0 text-left">
                      <p className="text-subTitle text-sm">
                        {formatDateArShort(row.dueAt)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            emptyState("لا توجد مهام فائتة غير محلولة ضمن الفترة الحالية.")
          )}
        </div>

        <div className="bg-sky-100 px-3 py-4 rounded-xl">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols:timer-outline"
                className="size-5 text-sky-600"
              />
              <h3 className="text-foreground font-semibold">جلسات جارية</h3>
            </div>
            <button
              type="button"
              className="text-sky-600 text-sm hover:underline"
              onClick={() =>
                navigate({
                  pathname: "sessions",
                  search: "?status=running",
                })
              }
            >
              عرض الكل
            </button>
          </div>

          {runningSessions?.items?.length ? (
            <ul className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5">
              {runningSessions.items.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`students/${row.studentId}`)}
                    className="flex w-full items-start justify-between gap-3 p-4 text-right hover:bg-black/2"
                  >
                    <div className="min-w-0">
                      <p className="text-foreground truncate font-medium">
                        {row.studentName} · {row.taskName}
                      </p>
                      <p className="text-subTitle mt-1 truncate text-sm">
                        {row.planName}
                      </p>
                    </div>
                    <div className="shrink-0 text-left">
                      <p className="text-subTitle text-sm">
                        {formatTimeAr(row.startedAt)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            emptyState("لا توجد جلسات جارية حالياً.")
          )}
        </div>

        {isSuperAdmin ? (
          <div className="bg-amber-100 px-3 py-4 rounded-xl">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:subscriptions-outline"
                  className="size-5 text-amber-700"
                />
                <h3 className="text-foreground font-semibold">
                  اشتراكات قاربت على الانتهاء
                </h3>
              </div>
              <button
                type="button"
                className="text-amber-700 text-sm hover:underline"
                onClick={() => navigate("subscriptions")}
              >
                عرض الكل
              </button>
            </div>

            {endingSoonRows.length ? (
              <ul className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5">
                {endingSoonRows.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => navigate("subscriptions")}
                      className="flex w-full items-start justify-between gap-3 p-4 text-right hover:bg-black/2"
                    >
                      <div className="min-w-0">
                        <p className="text-foreground truncate font-medium">
                          {row.studentName} · {row.packageName}
                        </p>
                        <p className="text-subTitle mt-1 truncate text-sm">
                          ينتهي في {formatDateArShort(row.endsAt)}
                        </p>
                      </div>
                      <div className="shrink-0 text-left">
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                          قريباً
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              emptyState("لا توجد اشتراكات ستنتهي خلال 7 أيام القادمة.")
            )}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
