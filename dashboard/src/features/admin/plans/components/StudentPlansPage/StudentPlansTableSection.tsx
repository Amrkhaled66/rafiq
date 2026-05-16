import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";

import type { StudentPlanRow } from "@/features/admin/plans/services/plansService";
import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import Button from "@/shared/components/Button";
import { formatDateArShort } from "@/shared/utils/dates";
import { formatProfileDate } from "@/shared/utils/profile";

export default function StudentPlansTableSection({
  items,
  total,
  page,
  limit,
  isFetching,
  onChangePage,
  onChangeRowsPerPage,
}: {
  items: StudentPlanRow[];
  total: number;
  page: number;
  limit: number;
  isFetching: boolean;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (limit: number, page: number) => void;
}) {
  const columns = useMemo<TableColumn<StudentPlanRow>[]>(
    () => [
      {
        name: "اسم الخطة",
        selector: (row) => row.name,
        grow: 1.4,
      },
      {
        name: "المدة",
        selector: (row) =>
          `${formatDateArShort(row.startsOn)} → ${formatDateArShort(row.endsOn)}`,
        grow: 1.6,
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
      },
      {
        name: "الفائت",
        selector: (row) => row.missedTasks,
        center: true,
      },
      {
        name: "التقدم",
        cell: (row) => <ProgressCell value={row.progressPercent} />,
        grow: 1.4,
      },
      {
        name: "تاريخ الإنشاء",
        selector: (row) => formatProfileDate(row.createdAt),
      },
      {
        name: "",
        cell: () => (
          <Button disabled variant="outline" className="px-3 py-1.5 text-sm">
            عرض
          </Button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [],
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

function ProgressCell({ value }: { value: number }) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  return (
    <div className="min-w-36">
      <div className="mb-1 flex items-center justify-between text-xs text-subTitle">
        <span>{safe}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="from-brand-primary h-full rounded-full bg-linear-to-r to-blue-500 transition-all duration-300"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

