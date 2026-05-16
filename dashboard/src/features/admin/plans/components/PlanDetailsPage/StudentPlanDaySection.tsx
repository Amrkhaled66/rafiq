import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";

import type {
  StudentPlanDetailDay,
  StudentPlanDetailTask,
} from "@/features/admin/plans/services/plansService";
import ProgressCell from "@/features/admin/shared/components/ProgressCell";
import Button from "@/shared/components/Button";
import Table from "@/shared/components/Table";
import { SCHOOL_SUBJECT_LABELS } from "@/shared/const/subjects";
import { formatDateArShort } from "@/shared/utils/dates";

function TaskStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; className: string }> = {
    pending: {
      label: "قيد الانتظار",
      className: "bg-slate-100 text-slate-700",
    },
    in_progress: {
      label: "قيد التنفيذ",
      className: "bg-amber-100 text-amber-700",
    },
    done: {
      label: "مكتملة",
      className: "bg-emerald-100 text-emerald-700",
    },
    missed: {
      label: "فائتة",
      className: "bg-rose-100 text-rose-700",
    },
  };

  const display = statusMap[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${display.className}`}>
      {display.label}
    </span>
  );
}

export default function StudentPlanDaySection({
  day,
  onCompleteTask,
  completingTaskId,
}: {
  day: StudentPlanDetailDay;
  onCompleteTask: (taskId: number) => void;
  completingTaskId: number | null;
}) {
  const columns = useMemo<TableColumn<StudentPlanDetailTask>[]>(
    () => [
      {
        name: "اسم المهمة",
        selector: (row) => row.title,
        grow: 1.6,
      },
      {
        name: "المادة",
        selector: (row) => SCHOOL_SUBJECT_LABELS[row.subject] ?? row.subject,
      },
      {
        name: "الحالة",
        cell: (row) => <TaskStatusBadge status={row.status} />,
      },
      {
        name: "",
        cell: (row) => (
          <Button
            variant="outline"
            className="px-3 py-1.5 text-sm"
            disabled={row.status === "done" || completingTaskId === row.id}
            onClick={() => onCompleteTask(row.id)}
          >
            {row.status === "done" ? "مكتملة" : "تأكيد الإكمال"}
          </Button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [completingTaskId, onCompleteTask],
  );

  return (
    <section className="dashboard-card space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-right">
          <h2 className="text-foreground text-xl font-bold">{day.weekday}</h2>
          <p className="text-subTitle text-sm">{formatDateArShort(day.date)}</p>
        </div>

        <ProgressCell value={day.progressPercent} />
      </div>

      <Table
        columns={columns}
        data={day.tasks}
        responsive
        persistTableHead
        noDataComponent={
          <div className="py-6 text-sm text-subTitle">لا توجد مهام لهذا اليوم.</div>
        }
      />
    </section>
  );
}
