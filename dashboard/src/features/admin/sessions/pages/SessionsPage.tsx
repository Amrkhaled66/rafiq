import "react-loading-skeleton/dist/skeleton.css";

import SessionsFilters from "@/features/admin/sessions/components/SessionsPage/SessionsFilters";
import SessionsStatsSection from "@/features/admin/sessions/components/SessionsPage/SessionsStatsSection";
import SessionsStatsSkeleton from "@/features/admin/sessions/components/SessionsPage/SessionsStatsSkeleton";
import SessionsTable from "@/features/admin/sessions/components/SessionsPage/SessionsTable";
import useSessionsFilterParams from "@/features/admin/sessions/hooks/useSessionsFilterParams";
import { useTaskSessionsQuery } from "@/features/admin/sessions/queries/sessionQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import useUrlPagination from "@/features/admin/shared/hooks/useUrlPagination";
import { optionalTrim } from "@/shared/utils/query";

export default function SessionsPage() {
  const filters = useSessionsFilterParams();
  const pagination = useUrlPagination({ defaults: { page: 1, limit: 10 } });

  const sessionsQuery = useTaskSessionsQuery({
    studentPhone: optionalTrim(filters.appliedFilters.studentPhone),
    status: filters.appliedFilters.status || undefined,
    from: filters.appliedFilters.from || undefined,
    to: filters.appliedFilters.to || undefined,
    page: pagination.page,
    limit: pagination.limit,
  });

  const isInitialLoading = sessionsQuery.isLoading && !sessionsQuery.data;
  const isFetching = sessionsQuery.isFetching;

  return (
    <div className="space-y-6">
      <PageHeader
        icon="material-symbols:timer-outline"
        title="الجلسات"
        subtitle="متابعة جلسات المهام مع عرض الحالة ومدة الجلسة وإمكانية التصفية."
      />

      {isInitialLoading || !sessionsQuery.data ? (
        <SessionsStatsSkeleton />
      ) : (
        <SessionsStatsSection stats={sessionsQuery.data.stats} />
      )}

      <SessionsFilters
        filters={filters.draftFilters}
        isApplying={sessionsQuery.isFetching}
        hasChanges={filters.hasChanges}
        hasFilters={filters.hasFilters}
        onChange={filters.setDraftFilter}
        onApply={filters.applyFilters}
        onReset={filters.resetFilters}
      />

      {sessionsQuery.isError && !sessionsQuery.data ? (
        <section className="dashboard-card text-right">
          <p className="text-sm text-red-500">تعذر تحميل بيانات الجلسات.</p>
        </section>
      ) : (
        <SessionsTable
          items={sessionsQuery.data?.items ?? []}
          total={sessionsQuery.data?.total ?? 0}
          page={pagination.page}
          limit={pagination.limit}
          isInitialLoading={isInitialLoading}
          isFetching={isFetching}
          onChangePage={pagination.setPage}
          onChangeRowsPerPage={pagination.onChangeRowsPerPage}
        />
      )}
    </div>
  );
}
