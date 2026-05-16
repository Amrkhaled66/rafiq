import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";

import Table from "@/shared/components/Table";
import type { SubscriptionPackage } from "@/features/admin/subscriptions/services/subscriptionService";
import { formatDateArShort } from "@/shared/utils/dates";

export default function SubscriptionPackagesTable({
  packages,
  isLoading,
}: {
  packages: SubscriptionPackage[];
  isLoading: boolean;
}) {
  const columns = useMemo<TableColumn<SubscriptionPackage>[]>(
    () => [
      {
        name: "اسم الباقة",
        selector: (row) => row.name,
        grow: 1.6,
      },
      {
        name: "المدة",
        selector: (row) => `${row.durationDays} يوم`,
      },
      {
        name: "السعر",
        selector: (row) => `${row.price} ج.م`,
      },
      {
        name: "تاريخ الإنشاء",
        selector: (row) => formatDateArShort(row.createdAt),
      },
    ],
    [],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">قائمة الباقات</h2>
        <p className="text-subTitle mt-1 text-sm">
          جميع الباقات المتاحة لإسناد الاشتراكات.
        </p>
      </div>

      <Table
        columns={columns}
        data={packages}
        progressPending={isLoading}
        progressComponent={<div className="py-6 text-sm text-subTitle">جاري تحميل الباقات...</div>}
        noDataComponent={<div className="py-6 text-sm text-subTitle">لا توجد باقات لعرضها</div>}
        responsive
        highlightOnHover
        persistTableHead
      />
    </section>
  );
}
