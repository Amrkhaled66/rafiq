import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import SectionCard from "./SectionCard";
import type { MissedTasksResponse } from "@/features/admin/missed-tasks/services/missedTasksService";
import { formatDateArShort } from "@/shared/utils/dates";

export default function RecentActivity({
  resolvedMissedTasks,
}: {
  resolvedMissedTasks?: MissedTasksResponse;
}) {
  const navigate = useNavigate();

  return (
    <SectionCard
      title="نشاط مهم مؤخراً"
      action={
        <button
          type="button"
          className="text-brand-primary text-sm hover:underline"
          onClick={() => navigate("missed-tasks")}
        >
          عرض المزيد
        </button>
      }
    >
      {resolvedMissedTasks?.items?.length ? (
        <ul className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5">
          {resolvedMissedTasks.items.map((row) => (
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
                    <span className="inline-flex items-center gap-2">
                      <Icon
                        icon="material-symbols:check-circle-outline"
                        className="text-emerald-600 size-5"
                      />
                      تم حل مهمة فائتة
                    </span>
                  </p>
                  <p className="text-subTitle mt-1 truncate text-sm">
                    {row.studentName} · {row.taskName}
                  </p>
                </div>
                <div className="shrink-0 text-left">
                  <p className="text-subTitle text-sm">
                    {row.resolvedAt ? formatDateArShort(row.resolvedAt) : "-"}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-subTitle rounded-2xl border border-dashed border-black/10 p-4 text-sm">
          لا يوجد نشاط مهم خلال آخر 7 أيام.
        </div>
      )}
    </SectionCard>
  );
}
