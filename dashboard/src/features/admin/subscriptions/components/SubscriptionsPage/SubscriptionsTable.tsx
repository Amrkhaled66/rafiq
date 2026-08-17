import { Icon } from "@iconify/react";
import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";

import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import SubscriptionStatusBadge from "@/features/admin/subscriptions/components/SubscriptionsPage/SubscriptionStatusBadge";
import type { SubscriptionRow } from "@/features/admin/subscriptions/services/subscriptionService";
import Button from "@/shared/components/Button";
import { formatDateArShort } from "@/shared/utils/dates";
import { getRemainingDays } from "@/shared/utils/getReminingDays";

type SubscriptionsTableProps = {
  items: SubscriptionRow[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onCancelSubscription: (subscription: SubscriptionRow) => void;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number, page: number) => void;
};

export default function SubscriptionsTable({
  items,
  total,
  page,
  limit,
  isLoading,
  onCancelSubscription,
  onChangePage,
  onChangeRowsPerPage,
}: SubscriptionsTableProps) {
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
        cell: (row) => <div>{getRemainingDays(row)}</div>,
      },
      {
        name: "الحالة",
        cell: (row) => <SubscriptionStatusBadge status={row.status} />,
        grow: 1.1,
      },
      {
        name: "الإجراءات",
        cell: (row) =>
          row.status === "active" || row.status === "upcoming" ? (
            <Button
              variant="danger"
              className="inline-flex items-center gap-1.5 px-2 py-1 text-xs"
              onClick={() => onCancelSubscription(row)}
            >
              <Icon icon="solar:close-circle-linear" className="size-4" />
              <span>إلغاء</span>
            </Button>
          ) : (
            <span className="text-subTitle text-xs">-</span>
          ),
        grow: 0.9,
      },
    ],
    [onCancelSubscription],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">
          قائمة الاشتراكات
        </h2>
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
