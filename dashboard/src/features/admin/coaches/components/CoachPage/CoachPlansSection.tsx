import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import type { CoachPlan } from "@/features/admin/coaches/services/coachService";
import Table from "@/shared/components/Table";
import { formatProfileDate } from "@/shared/utils/profile";

type CoachPlansSectionProps = {
  currentPage: number;
  isLoading?: boolean;
  plans: CoachPlan[];
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number, page: number) => void;
};

export default function CoachPlansSection({
  currentPage,
  isLoading = false,
  plans,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
}: CoachPlansSectionProps) {
  const columns = useMemo<TableColumn<CoachPlan>[]>(
    () => [
      {
        name: "الطالب",
        selector: (row) => row.studentName,
        grow: 1.3,
      },
      {
        name: "تبدأ من",
        selector: (row) => formatDateOnly(row.startsOn),
      },
      {
        name: "تنتهي في",
        selector: (row) => formatDateOnly(row.endsOn),
      },
      {
        name: "عدد المهام",
        selector: (row) => row.tasksCount,
        center: true,
      },
      {
        name: "المهام الفائتة",
        selector: (row) => row.missedTasksCount,
        center: true,
      },
      {
        name: "أنشئت في",
        selector: (row) => formatProfileDate(row.createdAt),
      },
    ],
    [],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">الخطط المنشأة</h2>
        <p className="text-subTitle mt-1 text-sm">
          جميع الخطط التي أنشأها هذا المدرب.
        </p>
      </div>

      <Table
        columns={columns}
        data={plans}
        progressPending={isLoading}
        progressComponent={
          <div className="text-subTitle py-6 text-sm">جاري تحميل الخطط...</div>
        }
        noDataComponent={
          <div className="text-subTitle py-6 text-sm">
            لا توجد خطط منشأة لهذا المدرب.
          </div>
        }
        pagination
        paginationDefaultPage={currentPage}
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[5, 10, 20, 50]}
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={onPageChange}
        onChangeRowsPerPage={onRowsPerPageChange}
        responsive
        highlightOnHover
        persistTableHead
      />
    </section>
  );
}

function formatDateOnly(value: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
