import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";
import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import ProgressCell from "@/features/admin/shared/components/ProgressCell";
import type { StudentPlanRow } from "@/features/admin/plans/services/plansService";
import { urls } from "@/shared/const/urls";
import { formatDateArShort } from "@/shared/utils/dates";

type Props = {
  studentId: number;
  items: StudentPlanRow[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number, page: number) => void;
};

export default function ProfilePlansSection(props: Props) {
  const navigate = useNavigate();
  const columns = useMemo<TableColumn<StudentPlanRow>[]>(
    () => [
      {
        name: "الخطة",
        cell: (row) => (
          <button
            type="button"
            className="text-brand-primary font-medium hover:underline"
            onClick={() =>
              navigate(
                `/${urls.dashBoardUrl}/students/${props.studentId}/plans/${row.id}`,
              )
            }
          >
            {row.name}
          </button>
        ),
        grow: 1.5,
      },
      { name: "البداية", selector: (row) => formatDateArShort(row.startsOn) },
      { name: "النهاية", selector: (row) => formatDateArShort(row.endsOn) },
      {
        name: "المهام المكتملة",
        selector: (row) => `${row.completedTasks} / ${row.totalTasks}`,
        center: true,
      },
      { name: "المهام الفائتة", selector: (row) => row.missedTasks, center: true },
      {
        name: "التقدم",
        cell: (row) => <ProgressCell value={row.progressPercent} />,
        grow: 1.5,
      },
    ],
    [navigate, props.studentId],
  );

  return (
    <AdminServerTable
      columns={columns}
      data={props.items}
      isLoading={props.isLoading}
      loadingText="جاري تحميل الخطط..."
      noDataText="لا توجد خطط دراسية لهذا الطالب."
      currentPage={props.page}
      rowsPerPage={props.limit}
      totalRows={props.total}
      onPageChange={props.onPageChange}
      onRowsPerPageChange={props.onRowsPerPageChange}
    />
  );
}
