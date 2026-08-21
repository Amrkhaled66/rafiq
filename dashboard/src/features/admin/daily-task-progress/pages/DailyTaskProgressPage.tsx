import DailyTaskProgressControls from "@/features/admin/daily-task-progress/components/DailyTaskProgressControls";
import DailyTaskProgressTable from "@/features/admin/daily-task-progress/components/DailyTaskProgressTable";
import useDailyTaskProgressParams from "@/features/admin/daily-task-progress/hooks/useDailyTaskProgressParams";
import { useDailyTaskProgressQuery } from "@/features/admin/daily-task-progress/queries/dailyTaskProgressQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import useUrlPagination from "@/features/admin/shared/hooks/useUrlPagination";

export default function DailyTaskProgressPage() {
  const filters = useDailyTaskProgressParams();
  const pagination = useUrlPagination({ defaults: { page: 1, limit: 10 } });
  const progressQuery = useDailyTaskProgressQuery({
    date: filters.date,
    status: filters.status,
    page: pagination.page,
    limit: pagination.limit,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });
  const summary = progressQuery.data?.summary ?? {
    finishedStudents: 0,
    unfinishedStudents: 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon="solar:checklist-minimalistic-linear"
        title="متابعة إنجاز الطلاب"
        subtitle="مراجعة إنجاز مهام الطلاب ليوم دراسي مكتمل ومعرفة عدد المهام الفائتة."
      />

      <DailyTaskProgressControls
        date={filters.date}
        maxDate={filters.maxDate}
        isToday={filters.isToday}
        status={filters.status}
        finishedStudents={summary.finishedStudents}
        unfinishedStudents={summary.unfinishedStudents}
        onDateChange={filters.setDate}
        onStatusChange={filters.setStatus}
      />

      {progressQuery.isError && !progressQuery.data ? (
        <section className="dashboard-card text-right">
          <p className="text-sm text-red-500">
            تعذر تحميل بيانات متابعة إنجاز الطلاب.
          </p>
        </section>
      ) : (
        <DailyTaskProgressTable
          items={progressQuery.data?.items ?? []}
          total={progressQuery.data?.total ?? 0}
          page={progressQuery.data?.page ?? pagination.page}
          limit={progressQuery.data?.limit ?? pagination.limit}
          status={filters.status}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          isLoading={progressQuery.isLoading || progressQuery.isFetching}
          onPageChange={pagination.setPage}
          onRowsPerPageChange={pagination.onChangeRowsPerPage}
          onSortChange={filters.setSort}
        />
      )}
    </div>
  );
}
