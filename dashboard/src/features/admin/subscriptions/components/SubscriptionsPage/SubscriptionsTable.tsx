import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";

import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import SubscriptionStatusBadge from "@/features/admin/subscriptions/components/SubscriptionsPage/SubscriptionStatusBadge";
import type { SubscriptionRow } from "@/features/admin/subscriptions/services/subscriptionService";
import { formatDateArShort } from "@/shared/utils/dates";
import { getRemainingDays } from "@/shared/utils/getReminingDays";

export default function SubscriptionsTable({
  items,
  total,
  page,
  limit,
  isLoading,
  onChangePage,
  onChangeRowsPerPage,
}: {
  items: SubscriptionRow[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number, page: number) => void;
}) {
  const columns = useMemo<TableColumn<SubscriptionRow>[]>(
    () => [
      {
        name: "اسم الطالب",
        selector: (row) => row.studentName,
        grow: 1.5,
      },
      {
        name: "اسم الباقة",
        selector: (row) => row.packageName,
        grow: 1.4,
      },
      {
        name: "البداية",
        selector: (row) => formatDateArShort(row.startsAt),
      },
      {
        name: "النهاية",
        selector: (row) => formatDateArShort(row.endsAt),
      },
      {
        name: "الأيام المتبقية",
        sortable: true,
        sortFunction: (a, b) => getRemainingDays(a) - getRemainingDays(b),
        cell: (row) => {
          const remainingDays = getRemainingDays(row);

          return (
            <div>
              {remainingDays}
            </div>
          );
        },
      },
      {
        name: "الحالة",
        cell: (row) => <SubscriptionStatusBadge status={row.status} />,
        grow: 1.1,
      },
    ],
    [],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">قائمة الاشتراكات</h2>
        <p className="text-subTitle mt-1 text-sm">
          جميع اشتراكات الطلاب المسجلة في النظام.
        </p>
      </div>

      <AdminServerTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        loadingText="جاري تحميل الاشتراكات..."
        noDataText="لا توجد اشتراكات لعرضها"
        currentPage={page}
        rowsPerPage={limit}
        totalRows={total}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </section>
  );
}
