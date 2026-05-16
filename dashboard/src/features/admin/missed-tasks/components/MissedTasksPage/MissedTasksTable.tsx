import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";

import type { MissedTaskRow } from "@/features/admin/missed-tasks/services/missedTasksService";
import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import InfoTooltipCell from "@/features/admin/shared/components/InfoTooltipCell";
import Button from "@/shared/components/Button";
import { SCHOOL_SUBJECT_LABELS } from "@/shared/const/subjects";
import { formatDateArShort } from "@/shared/utils/dates";

function TaskStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
      {status === "missed" ? "فائتة" : status}
    </span>
  );
}

function ResolvedBadge({
  isResolved,
  resolvedByName,
}: {
  isResolved: boolean;
  resolvedByName?: string | null;
}) {
  const resolvedText = isResolved
    ? resolvedByName
      ? `محلولة بواسطة ${resolvedByName}`
      : "محلولة"
    : "غير محلولة";

  return (
    <InfoTooltipCell tooltipText={resolvedText} tooltipLabel="عرض حالة الحل">
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium text-nowrap ${
          isResolved
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-900"
        }`}
      >
        {isResolved ? "محلولة" : "غير محلولة"}
      </span>
    </InfoTooltipCell>
  );
}

export default function MissedTasksTable({
  items,
  total,
  page,
  limit,
  isLoading,
  isSuperAdmin,
  resolvingTaskId,
  onResolve,
  onUnresolve,
  onChangePage,
  onChangeRowsPerPage,
}: {
  items: MissedTaskRow[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isSuperAdmin: boolean;
  resolvingTaskId: number | null;
  onResolve: (task: MissedTaskRow) => void;
  onUnresolve: (task: MissedTaskRow) => void;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number, page: number) => void;
}) {
  const navigate = useNavigate();

  const columns = useMemo<TableColumn<MissedTaskRow>[]>(() => {
    const baseColumns: TableColumn<MissedTaskRow>[] = [
      {
        name: "الطالب",
        cell: (row) => (
          <button
            type="button"
            className="text-brand-primary text-sm font-medium hover:underline"
            onClick={() => navigate(`/students/${row.studentId}`)}
          >
            {row.studentName}
          </button>
        ),
        grow: 1.2,
      },
      {
        name: "المهمة",
        selector: (row) => row.taskName,
        grow: 1.5,
      },
      {
        name: "المادة",
        selector: (row) => SCHOOL_SUBJECT_LABELS[row.subject] ?? row.subject,
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
        grow: 1.2,
      },
      {
        name: "تاريخ المهمة",
        selector: (row) => formatDateArShort(row.dueAt),
      },
      {
        name: "الحالة",
        cell: (row) => <TaskStatusBadge status={row.status} />,
      },
      {
        name: "الحل",
        cell: (row) => (
          <ResolvedBadge
            isResolved={row.isResolved}
            resolvedByName={row.resolvedByName}
          />
        ),
        grow: 1.4,
        allowOverflow: true,
      },
      {
        name: "ملاحظة الحل",
        cell: (row) => {
          const note = row.resolutionNote?.trim();

          if (!note) {
            return "-";
          }

          return (
            <InfoTooltipCell tooltipText={note} tooltipLabel="عرض ملاحظة الحل">
              <p className="max-w-48 truncate text-sm text-foreground">{note}</p>
            </InfoTooltipCell>
          );
        },
        grow: 1.8,
        allowOverflow: true,
      },
      {
        name: "تاريخ الحل",
        selector: (row) =>
          row.resolvedAt ? formatDateArShort(row.resolvedAt) : "-",
      },
    ];

    if (isSuperAdmin) {
      baseColumns.push({
        name: "المدرب",
        selector: (row) => row.coachName,
        grow: 1.7,
        sortable: true,
      });
    }

    baseColumns.push({
      name: "",
      cell: (row) => (
        <Button
          variant={row.isResolved ? "outline" : "primary"}
          className="px-3 py-1.5 text-sm"
          isLoading={resolvingTaskId === row.taskId}
          onClick={() => (row.isResolved ? onUnresolve(row) : onResolve(row))}
        >
          {row.isResolved ? "إلغاء الحل" : "حل المهمة"}
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    });

    return baseColumns;
  }, [isSuperAdmin, navigate, onResolve, onUnresolve, resolvingTaskId]);

  return (
    <section className="dashboard-card ">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">
          قائمة المهام الفائتة
        </h2>
        <p className="text-subTitle mt-1 text-sm">
          جميع المهام الفائتة ضمن النطاق المحدد.
        </p>
      </div>

      <AdminServerTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        loadingText="جاري تحميل المهام الفائتة..."
        noDataText="لا توجد مهام فائتة لعرضها"
        currentPage={page}
        rowsPerPage={limit}
        totalRows={total}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </section>
  );
}
