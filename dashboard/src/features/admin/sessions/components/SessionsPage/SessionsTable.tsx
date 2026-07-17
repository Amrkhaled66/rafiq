import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";

import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import SessionsTableSkeleton from "@/features/admin/sessions/components/SessionsPage/SessionsTableSkeleton";
import { SESSION_STATUS_BADGE_CONFIG } from "@/features/admin/sessions/constants/sessionStatus";
import type {
  SessionStatus,
  TaskSessionRow,
} from "@/features/admin/sessions/services/sessionService";
import { formatTimeAr } from "@/shared/utils/dates";
import {urls} from "@/shared/const/urls"
function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const config = SESSION_STATUS_BADGE_CONFIG[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
function SessionDurationCell({
  durationSeconds,
  status,
}: {
  durationSeconds: number;
  status: SessionStatus;
}) {
  const [liveSeconds, setLiveSeconds] = useState(0);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setLiveSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [status]);
  const displayLiveSeconds = status === "running" ? liveSeconds : 0;
  const minutes = Math.max(
    1,
    Math.round((durationSeconds + displayLiveSeconds) / 60),
  );

  return <span>{minutes} دقيقة</span>;
}

export default function SessionsTable({
  items,
  total,
  page,
  limit,
  isInitialLoading,
  isFetching,
  onChangePage,
  onChangeRowsPerPage,
}: {
  items: TaskSessionRow[];
  total: number;
  page: number;
  limit: number;
  isInitialLoading: boolean;
  isFetching: boolean;
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
            onClick={() => navigate(`/${urls.dashBoardUrl}/students/${row.studentId}`)}
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
              navigate(`/${urls.dashBoardUrl}/students/${row.studentId}/plans/${row.planId}`)
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
            durationSeconds={row.durationSeconds}
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

  if (isFetching || isInitialLoading) {
    return <SessionsTableSkeleton />;
  }

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">قائمة الجلسات</h2>
      </div>

      <AdminServerTable
        columns={columns}
        data={items}
        isLoading={isFetching || isInitialLoading}
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
