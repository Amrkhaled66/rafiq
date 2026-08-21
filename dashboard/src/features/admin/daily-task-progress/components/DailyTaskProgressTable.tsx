import { Icon } from "@iconify/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type {
  SortOrder,
  TableColumn,
} from "react-data-table-component";

import type {
  DailyTaskProgressRow,
  DailyTaskProgressSort,
  DailyTaskProgressSortOrder,
  DailyTaskProgressStatus,
} from "@/features/admin/daily-task-progress/services/dailyTaskProgressService";
import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import { urls } from "@/shared/const/urls";

function ProgressCell({ row }: { row: DailyTaskProgressRow }) {
  return (
    <div className="w-full min-w-28 space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-slate-700">{row.completionPercent}%</span>
        <span className="text-subTitle">
          {row.completedTasks}/{row.totalTasks}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            row.completionPercent === 100 ? "bg-emerald-500" : "bg-amber-500"
          }`}
          style={{ width: `${row.completionPercent}%` }}
        />
      </div>
    </div>
  );
}

export default function DailyTaskProgressTable({
  items,
  total,
  page,
  limit,
  status,
  sortBy,
  sortOrder,
  isLoading,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
}: {
  items: DailyTaskProgressRow[];
  total: number;
  page: number;
  limit: number;
  status: DailyTaskProgressStatus;
  sortBy: DailyTaskProgressSort;
  sortOrder: DailyTaskProgressSortOrder;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number, page: number) => void;
  onSortChange: (
    sortBy: DailyTaskProgressSort,
    order: DailyTaskProgressSortOrder,
  ) => void;
}) {
  const navigate = useNavigate();
  const columns = useMemo<TableColumn<DailyTaskProgressRow>[]>(
    () => [
      {
        id: "studentName",
        name: "اسم الطالب",
        selector: (row) => row.studentName,
        sortField: "studentName",
        sortable: true,
        cell: (row) => (
          <button
            type="button"
            className="text-brand-primary text-right text-sm font-semibold hover:underline"
            onClick={() =>
              navigate(`/${urls.dashBoardUrl}/students/${row.studentId}`)
            }
          >
            {row.studentName}
          </button>
        ),
        grow: 1.5,
      },
      {
        name: "رقم الهاتف",
        selector: (row) => row.studentPhone,
        grow: 1.2,
      },
      {
        id: "totalTasks",
        name: "إجمالي المهام",
        selector: (row) => row.totalTasks,
        sortField: "totalTasks",
        sortable: true,
        center: true,
      },
      {
        id: "completedTasks",
        name: "المكتملة",
        selector: (row) => row.completedTasks,
        sortField: "completedTasks",
        sortable: true,
        center: true,
      },
      {
        id: "missedTasks",
        name: "الفائتة",
        selector: (row) => row.missedTasks,
        sortField: "missedTasks",
        sortable: true,
        center: true,
        cell: (row) => (
          <span
            className={`font-bold ${
              row.missedTasks > 0 ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {row.missedTasks}
          </span>
        ),
      },
      {
        name: "نسبة الإنجاز",
        cell: (row) => <ProgressCell row={row} />,
        grow: 1.3,
      },
      {
        name: "عرض",
        button: true,
        cell: (row) => (
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-brand-primary"
            onClick={() =>
              navigate(`/${urls.dashBoardUrl}/students/${row.studentId}`)
            }
            aria-label={`عرض الطالب ${row.studentName}`}
            title="عرض الطالب"
          >
            <Icon icon="solar:eye-linear" className="size-5" />
          </button>
        ),
      },
    ],
    [navigate],
  );

  function handleSort(
    column: TableColumn<DailyTaskProgressRow>,
    direction: SortOrder,
  ) {
    const field = column.sortField as DailyTaskProgressSort | undefined;
    if (!field) return;
    onSortChange(field, direction as DailyTaskProgressSortOrder);
  }

  return (
    <section className="dashboard-card space-y-4">
      <div className="text-right">
        <h2 className="text-foreground text-lg font-bold">
          {status === "finished"
            ? "الطلاب الذين أكملوا جميع المهام"
            : "الطلاب الذين لم يكملوا جميع المهام"}
        </h2>
        <p className="text-subTitle mt-1 text-sm">
          اضغط على عنوان أي عمود قابل للترتيب لتغيير ترتيب النتائج.
        </p>
      </div>

      <AdminServerTable
        key={`${status}-${sortBy}-${sortOrder}`}
        columns={columns}
        data={items}
        isLoading={isLoading}
        loadingText="جاري تحميل متابعة إنجاز الطلاب..."
        noDataText="لا يوجد طلاب مطابقون لهذا اليوم والحالة."
        currentPage={page}
        rowsPerPage={limit}
        totalRows={total}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sortServer
        defaultSortFieldId={sortBy}
        defaultSortAsc={sortOrder === "asc"}
        onSort={handleSort}
      />
    </section>
  );
}
