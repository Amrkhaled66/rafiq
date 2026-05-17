import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";

import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import type {
  SessionStatus,
  TaskSessionRow,
} from "@/features/admin/sessions/services/sessionService";
import { formatTimeAr } from "@/shared/utils/dates";

function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const config: Record<SessionStatus, { label: string; className: string }> = {
    running: {
      label: "جارية",
      className: "bg-sky-100 text-sky-700",
    },
    completed: {
      label: "مكتملة",
      className: "bg-emerald-100 text-emerald-700",
    },
    stopped: {
      label: "متوقفة",
      className: "bg-amber-100 text-amber-800",
    },
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${config[status].className}`}
    >
      {config[status].label}
    </span>
  );
}

function SessionDurationCell({
  startedAt,
  endedAt,
  status,
}: {
  startedAt: string;
  endedAt: string | null;
  status: SessionStatus;
}) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (status !== "running" || endedAt) {
      return;
    }

    const interval = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [endedAt, status]);

  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  const minutes = Math.max(1, Math.round((end - start) / 60000));

  return <span>{minutes} دقيقة</span>;
}

export default function SessionsTable({
  items,
  total,
  page,
  limit,
  isLoading,
  onChangePage,
  onChangeRowsPerPage,
}: {
  items: TaskSessionRow[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number, page: number) => void;
}) {
  const navigate = useNavigate();

  const columns = useMemo<TableColumn<TaskSessionRow>[]>(
    () => [
      {
        name: "اسم الطالب",
        cell: (row) => (
          <button
            type="button"
            className="text-brand-primary text-sm font-medium hover:underline"
            onClick={() => navigate(`/students/${row.studentId}`)}
          >
            {row.studentName}
          </button>
        ),
        grow: 1.4,
      },
      {
        name: "اسم المهمة",
        selector: (row) => row.taskName,
        grow: 1.5,
      },
      {
        name: "الخطة",
        cell: (row) => (
          <button
            type="button"
            className="text-brand-primary text-sm font-medium hover:underline"
            onClick={() =>
              navigate(`/students/${row.studentId}/plans/${row.planId}`)
            }
          >
            {row.planName}
          </button>
        ),
        grow: 1.4,
      },
      {
        name: "وقت البدء",
        selector: (row) => formatTimeAr(row.startedAt),
      },
      {
        name: "وقت الانتهاء",
        selector: (row) => (row.endedAt ? formatTimeAr(row.endedAt) : "-"),
      },
      {
        name: "مدة الجلسة",
        cell: (row) => (
          <SessionDurationCell
            startedAt={row.startedAt}
            endedAt={row.endedAt}
            status={row.status}
          />
        ),
      },
      {
        name: "الحالة",
        cell: (row) => <SessionStatusBadge status={row.status} />,
      },
    ],
    [navigate],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">قائمة الجلسات</h2>
        <p className="text-subTitle mt-1 text-sm">
          جميع جلسات المهام مع إمكانية التصفية حسب الهاتف والحالة والتاريخ.
        </p>
      </div>

      <AdminServerTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        loadingText="جاري تحميل الجلسات..."
        noDataText="لا توجد جلسات لعرضها"
        currentPage={page}
        rowsPerPage={limit}
        totalRows={total}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </section>
  );
}
