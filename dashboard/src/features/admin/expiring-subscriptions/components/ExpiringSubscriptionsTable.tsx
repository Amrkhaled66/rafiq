import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";

import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import type { ExpiringSubscriptionRow } from "@/features/admin/expiring-subscriptions/services/expiringSubscriptionsService";
import { formatDateArShort } from "@/shared/utils/dates";

export default function ExpiringSubscriptionsTable({
  items,
  total,
  page,
  limit,
  isLoading,
  onViewStudent,
  onChangePage,
  onChangeRowsPerPage,
}: {
  items: ExpiringSubscriptionRow[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onViewStudent: (studentId: number) => void;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number, page: number) => void;
}) {
  const columns = useMemo<TableColumn<ExpiringSubscriptionRow>[]>(
    () => [
      {
        name: "اسم الطالب",
        cell: (row) => (
          <button
            type="button"
            className="text-brand-primary font-medium hover:underline"
            onClick={() => onViewStudent(row.studentId)}
          >
            {row.studentName}
          </button>
        ),
        grow: 1.5,
      },
      {
        name: "اسم الباقة",
        selector: (row) => row.packageName,
        grow: 1.4,
      },
      {
        name: "تاريخ البداية",
        selector: (row) => formatDateArShort(row.startsAt),
      },
      {
        name: "تاريخ الانتهاء",
        selector: (row) => formatDateArShort(row.endsAt),
      },
      {
        name: "الأيام المتبقية",
        selector: (row) => row.daysRemaining,
        cell: (row) => (
          <span className="font-semibold text-amber-700">
            {row.daysRemaining === 0 ? "ينتهي اليوم" : row.daysRemaining}
          </span>
        ),
      },
    ],
    [onViewStudent],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">
          الاشتراكات القريبة من الانتهاء
        </h2>
        <p className="text-subTitle mt-1 text-sm">
          مرتبة حسب أقرب تاريخ انتهاء لمتابعة الطلاب في الوقت المناسب.
        </p>
      </div>

      <AdminServerTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        loadingText="جاري تحميل الاشتراكات..."
        noDataText="لا توجد اشتراكات ستنتهي خلال الفترة المحددة"
        currentPage={page}
        rowsPerPage={limit}
        totalRows={total}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </section>
  );
}
