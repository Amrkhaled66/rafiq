import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";

import type {
  StudentPlanDetailDay,
  StudentPlanDetailTask,
  StudentPlanTaskSessionStats,
} from "@/features/admin/plans/services/plansService";
import {
  SESSION_STATUS_BADGE_CONFIG,
  type SessionStatus,
} from "@/features/admin/sessions/constants/sessionStatus";
import ProgressCell from "@/features/admin/shared/components/ProgressCell";
import Button from "@/shared/components/Button";
import Table from "@/shared/components/Table";
import { SCHOOL_SUBJECT_LABELS } from "@/shared/const/subjects";
import { formatDateArShort } from "@/shared/utils/dates";

const SESSION_STATUS_BREAKDOWN: Array<{
  status: SessionStatus;
  countKey: keyof Pick<
    StudentPlanTaskSessionStats,
    | "runningSessions"
    | "pausedSessions"
    | "completedSessions"
    | "cancelledSessions"
  >;
}> = [
  { status: "completed", countKey: "completedSessions" },
  { status: "running", countKey: "runningSessions" },
  { status: "paused", countKey: "pausedSessions" },
  { status: "cancelled", countKey: "cancelledSessions" },
];

function formatTotalFocusDuration(totalFocusSeconds: number) {
  const safeSeconds = Number.isFinite(totalFocusSeconds)
    ? Math.max(0, totalFocusSeconds)
    : 0;
  const totalMinutes = Math.floor(safeSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} دقيقة`;
  }

  if (minutes === 0) {
    return `${hours} ساعة`;
  }

  return `${hours} ساعة و${minutes} دقيقة`;
}

function SessionStatusBreakdown({
  stats,
}: {
  stats: StudentPlanTaskSessionStats;
}) {
  return (
    <div className="flex min-w-max items-center gap-1.5 whitespace-nowrap">
      {SESSION_STATUS_BREAKDOWN.map(({ status, countKey }) => {
        const config = SESSION_STATUS_BADGE_CONFIG[status];

        return (
          <span
            key={status}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${config.className}`}
          >
            <span>{config.label}</span>
            <span>{stats[countKey]}</span>
          </span>
        );
      })}
    </div>
  );
}

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
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${display.className}`}
    >
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
        name: "إجمالي الوقت",
        cell: (row) =>
          formatTotalFocusDuration(row.sessionStats.totalFocusSeconds),
        width: "140px",
        center: true,
      },
      {
        name: "عدد الجلسات",
        selector: (row) => row.sessionStats.totalSessions,
        width: "110px",
        center: true,
      },
      {
        name: "حالات الجلسات",
        cell: (row) => <SessionStatusBreakdown stats={row.sessionStats} />,
        minWidth: "330px",
        grow: 1.5,
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
          <div className="text-subTitle py-6 text-sm">
            لا توجد مهام لهذا اليوم.
          </div>
        }
      />
    </section>
  );
}
