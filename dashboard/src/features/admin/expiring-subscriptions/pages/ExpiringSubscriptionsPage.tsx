import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ExpiringSubscriptionsFilters from "@/features/admin/expiring-subscriptions/components/ExpiringSubscriptionsFilters";
import ExpiringSubscriptionsTable from "@/features/admin/expiring-subscriptions/components/ExpiringSubscriptionsTable";
import useExpiringSubscriptionsFilterParams from "@/features/admin/expiring-subscriptions/hooks/useExpiringSubscriptionsFilterParams";
import { useExpiringSubscriptionsQuery } from "@/features/admin/expiring-subscriptions/queries/expiringSubscriptionsQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import AdminPageSkeleton from "@/features/admin/shared/components/skeletons/AdminPageSkeleton";
import useUrlPagination from "@/features/admin/shared/hooks/useUrlPagination";

export default function ExpiringSubscriptionsPage() {
  const navigate = useNavigate();
  const filters = useExpiringSubscriptionsFilterParams();
  const pagination = useUrlPagination({ defaults: { page: 1, limit: 10 } });
  const subscriptionsQuery = useExpiringSubscriptionsQuery({
    days: filters.days,
    page: pagination.page,
    limit: pagination.limit,
  });

  const handleViewStudent = useCallback(
    (studentId: number) => navigate(`../students/${studentId}`),
    [navigate],
  );

  const isInitialLoading =
    subscriptionsQuery.isLoading && !subscriptionsQuery.data;

  if (isInitialLoading) {
    return <AdminPageSkeleton contentSections={2} rows={4} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon="solar:calendar-mark-linear"
        title="الاشتراكات اللي هتنتهي"
        subtitle="متابعة اشتراكات الطلاب القريبة من الانتهاء قبل توقف وصولهم إلى التطبيق."
      />

      <ExpiringSubscriptionsFilters
        days={filters.days}
        onDaysChange={filters.setDays}
      />

      {subscriptionsQuery.isError && !subscriptionsQuery.data ? (
        <section className="dashboard-card text-right">
          <p className="text-sm text-red-500">
            تعذر تحميل بيانات الاشتراكات القريبة من الانتهاء.
          </p>
        </section>
      ) : (
        <ExpiringSubscriptionsTable
          items={subscriptionsQuery.data?.items ?? []}
          total={subscriptionsQuery.data?.total ?? 0}
          page={pagination.page}
          limit={pagination.limit}
          isLoading={subscriptionsQuery.isFetching}
          onViewStudent={handleViewStudent}
          onChangePage={pagination.setPage}
          onChangeRowsPerPage={pagination.onChangeRowsPerPage}
        />
      )}
    </div>
  );
}
