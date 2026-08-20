import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";
import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import type { MissedTaskRow } from "@/features/admin/missed-tasks/services/missedTasksService";
import { SCHOOL_SUBJECT_LABELS } from "@/shared/const/subjects";
import { urls } from "@/shared/const/urls";
import { formatDateArShort } from "@/shared/utils/dates";

type Props = {
  items: MissedTaskRow[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number, page: number) => void;
};

export default function ProfileMissedTasksSection(props: Props) {
  const navigate = useNavigate();
  const columns = useMemo<TableColumn<MissedTaskRow>[]>(
    () => [
      { name: "المهمة", selector: (row) => row.taskName, grow: 1.5 },
      {
        name: "المادة",
        selector: (row) => SCHOOL_SUBJECT_LABELS[row.subject] ?? row.subject,
      },
      {
        name: "الخطة",
        cell: (row) => (
          <button
            type="button"
            className="text-brand-primary font-medium hover:underline"
            onClick={() =>
              navigate(
                `/${urls.dashBoardUrl}/students/${row.studentId}/plans/${row.planId}`,
              )
            }
          >
            {row.planName}
          </button>
        ),
        grow: 1.3,
      },
      { name: "تاريخ الاستحقاق", selector: (row) => formatDateArShort(row.dueAt) },
      {
        name: "المتابعة",
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
              row.isResolved
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {row.isResolved ? "تمت المتابعة" : "بحاجة للمتابعة"}
          </span>
        ),
      },
    ],
    [navigate],
  );

  return (
    <AdminServerTable
      columns={columns}
      data={props.items}
      isLoading={props.isLoading}
      loadingText="جاري تحميل المهام الفائتة..."
      noDataText="لا توجد مهام فائتة لهذا الطالب."
      currentPage={props.page}
      rowsPerPage={props.limit}
      totalRows={props.total}
      onPageChange={props.onPageChange}
      onRowsPerPageChange={props.onRowsPerPageChange}
    />
  );
}
