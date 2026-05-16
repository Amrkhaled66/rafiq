import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";

import type { StudentPlanRow } from "@/features/admin/plans/services/plansService";
import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import ProgressCell from "@/features/admin/shared/components/ProgressCell";
import Button from "@/shared/components/Button";
import { formatDateArShort } from "@/shared/utils/dates";
import { formatProfileDate } from "@/shared/utils/profile";

export default function StudentPlansTableSection({
  studentId,
  items,
  total,
  page,
  limit,
  isFetching,
  onChangePage,
  onChangeRowsPerPage,
}: {
  studentId: number;
  items: StudentPlanRow[];
  total: number;
  page: number;
  limit: number;
  isFetching: boolean;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (limit: number, page: number) => void;
}) {
  const navigate = useNavigate();

  const columns = useMemo<TableColumn<StudentPlanRow>[]>(
    () => [
      {
        name: "اسم الخطة",
        selector: (row) => row.name,
        grow: 1.6,
      },
      {
        name: "المدة",
        selector: (row) =>
          `${formatDateArShort(row.startsOn)} → ${formatDateArShort(row.endsOn)}`,
        grow: 2,
      },
      {
        name: "إجمالي المهام",
        selector: (row) => row.totalTasks,
        center: true,
      },
      {
        name: "المكتمل",
        selector: (row) => row.completedTasks,
        center: true,
        width: "80px",
      },
      {
        name: "الفائت",
        selector: (row) => row.missedTasks,
        center: true,
        width: "80px",
      },
      {
        name: "التقدم",
        cell: (row) => <ProgressCell value={row.progressPercent} />,
        grow: 2,
      },
      {
        name: "تاريخ الإنشاء",
        selector: (row) => formatProfileDate(row.createdAt),
      },
      {
        name: "",
        cell: (row) => (
          <Button
            variant="ghost"
            className="px-3 py-1.5 text-sm"
            onClick={() => navigate(`${row.id}`)}
          >
            عرض
          </Button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [navigate, studentId],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">قائمة الخطط</h2>
        <p className="text-subTitle mt-1 text-sm">
          جميع الخطط المخصصة لهذا الطالب.
        </p>
      </div>

      <AdminServerTable
        columns={columns}
        data={items}
        isLoading={isFetching}
        loadingText="جاري تحميل الخطط..."
        noDataText="لا يوجد خطط لعرضها"
        currentPage={page}
        rowsPerPage={limit}
        totalRows={total}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </section>
  );
}
