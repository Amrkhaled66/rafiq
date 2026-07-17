import { useEffect } from "react";
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

  useEffect(() => {
    if (pagination.page !== 1) {
      pagination.setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.studentPhone, filters.from, filters.to]);

  const sessionsQuery = useTaskSessionsQuery({
    studentPhone: optionalTrim(filters.studentPhone),
    status: filters.status || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
    page: pagination.page,
    limit: pagination.limit,
  });

  const isInitialLoading = sessionsQuery.isLoading && !sessionsQuery.data;
  const isFetching = sessionsQuery.isFetching;

  return (
    <div className="space-y-6">
      <PageHeader
        title="الجلسات"
        subtitle="متابعة جلسات المهام مع عرض الحالة ومدة الجلسة وإمكانية التصفية."
      />

      {isInitialLoading || !sessionsQuery.data ? (
        <SessionsStatsSkeleton />
      ) : (
        <SessionsStatsSection stats={sessionsQuery.data.stats} />
      )}

      <SessionsFilters
        studentPhone={filters.studentPhone}
        status={filters.status}
        from={filters.from}
        to={filters.to}
        onStudentPhoneChange={filters.setStudentPhone}
        onStatusChange={filters.setStatus}
        onFromChange={filters.setFrom}
        onToChange={filters.setTo}
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
