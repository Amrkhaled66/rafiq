import { useMemo } from "react";

import { useCoachesQuery } from "@/features/admin/coaches/queries/coachQueries";
import MissedTasksFilters from "@/features/admin/missed-tasks/components/MissedTasksPage/MissedTasksFilters";
import ResolveMissedTaskModal from "@/features/admin/missed-tasks/components/MissedTasksPage/ResolveMissedTaskModal";
import MissedTasksStatsSection from "@/features/admin/missed-tasks/components/MissedTasksPage/MissedTasksStatsSection";
import MissedTasksStatsSkeleton from "@/features/admin/missed-tasks/components/MissedTasksPage/MissedTasksStatsSkeleton";
import MissedTasksTable from "@/features/admin/missed-tasks/components/MissedTasksPage/MissedTasksTable";
import useMissedTasksFilterParams from "@/features/admin/missed-tasks/hooks/useMissedTasksFilterParams";
import useMissedTasksActions from "@/features/admin/missed-tasks/hooks/useMissedTasksActions";
import { useMissedTasksQuery } from "@/features/admin/missed-tasks/queries/missedTasksQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import useUrlPagination from "@/features/admin/shared/hooks/useUrlPagination";
import { useAuth } from "@/shared/context/authContext";
import { can } from "@/shared/auth/can";

export default function MissedTasksPage() {
  const { authData } = useAuth();
  const canReadCoaches = can(authData.user, "coaches", "read");
  const filters = useMissedTasksFilterParams();
  const pagination = useUrlPagination({ defaults: { page: 1, limit: 10 } });

  const coachesQuery = useCoachesQuery(
    canReadCoaches ? { page: 1, limit: 100, deletedStatus: "active" } : {},
  );

  const coachOptions = useMemo(
    () =>
      (coachesQuery.data?.data ?? []).map((coach) => ({
        label: coach.fullName,
        value: String(coach.id),
      })),
    [coachesQuery.data],
  );

  const missedTasksQuery = useMissedTasksQuery({
    from: filters.appliedFilters.from || undefined,
    to: filters.appliedFilters.to || undefined,
    status: filters.appliedFilters.status || undefined,
    coachId: filters.appliedFilters.coachId
      ? Number(filters.appliedFilters.coachId)
      : undefined,
    studentPhone: filters.appliedFilters.studentPhone || undefined,
    page: pagination.page,
    limit: pagination.limit,
  });
  const actions = useMissedTasksActions();

  const isInitialLoading = missedTasksQuery.isLoading && !missedTasksQuery.data;
  const isFetching = missedTasksQuery.isFetching;

  return (
    <div className="space-y-6">
      <PageHeader
        icon="material-symbols:event-busy-outline"
        title="المهام الفائتة"
        subtitle="متابعة المهام الفائتة وتسجيل حلها من قبل المدرب."
      />

      {isInitialLoading || !missedTasksQuery.data ? (
        <MissedTasksStatsSkeleton />
      ) : (
        <MissedTasksStatsSection stats={missedTasksQuery.data.stats} />
      )}

      <MissedTasksFilters
        filters={filters.draftFilters}
        canReadCoaches={Boolean(canReadCoaches)}
        coachOptions={coachOptions}
        coachesLoading={Boolean(canReadCoaches && coachesQuery.isLoading)}
        isApplying={missedTasksQuery.isFetching}
        hasChanges={filters.hasChanges}
        hasFilters={filters.hasFilters}
        onChange={filters.setDraftFilter}
        onApply={filters.applyFilters}
        onReset={filters.resetFilters}
      />

      {missedTasksQuery.isError && !missedTasksQuery.data ? (
        <section className="dashboard-card text-right">
          <p className="text-sm text-red-500">
            تعذر تحميل بيانات المهام الفائتة.
          </p>
        </section>
      ) : (
        <MissedTasksTable
          items={missedTasksQuery.data?.items ?? []}
          total={missedTasksQuery.data?.total ?? 0}
          page={pagination.page}
          limit={pagination.limit}
          isInitialLoading={isInitialLoading}
          isFetching={isFetching}
          canReadCoaches={Boolean(canReadCoaches)}
          resolvingTaskId={actions.resolvingTaskId}
          onResolve={actions.openResolveModal}
          onUnresolve={actions.handleUnresolve}
          onChangePage={pagination.setPage}
          onChangeRowsPerPage={pagination.onChangeRowsPerPage}
        />
      )}

      <ResolveMissedTaskModal
        isOpen={Boolean(actions.resolvingTask)}
        task={actions.resolvingTask}
        isSubmitting={actions.isSubmittingResolve}
        onClose={actions.closeResolveModal}
        onSubmit={actions.handleResolve}
      />
    </div>
  );
}
