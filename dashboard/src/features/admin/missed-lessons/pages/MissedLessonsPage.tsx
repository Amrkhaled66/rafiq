import { useMemo } from "react";
import { useCoachesQuery } from "@/features/admin/coaches/queries/coachQueries";
import MissedLessonsFilters from "@/features/admin/missed-lessons/components/MissedLessonsFilters";
import MissedLessonsStats from "@/features/admin/missed-lessons/components/MissedLessonsStats";
import MissedLessonsTable from "@/features/admin/missed-lessons/components/MissedLessonsTable";
import ResolveMissedLessonModal from "@/features/admin/missed-lessons/components/ResolveMissedLessonModal";
import useMissedLessonsActions from "@/features/admin/missed-lessons/hooks/useMissedLessonsActions";
import useMissedLessonsFilterParams from "@/features/admin/missed-lessons/hooks/useMissedLessonsFilterParams";
import { useMissedLessonsQuery } from "@/features/admin/missed-lessons/queries/missedLessonsQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import useUrlPagination from "@/features/admin/shared/hooks/useUrlPagination";
import { can } from "@/shared/auth/can";
import { useAuth } from "@/shared/context/authContext";

export default function MissedLessonsPage() {
  const { authData } = useAuth();
  const showCoach = Boolean(can(authData.user, "coaches", "read"));
  const filters = useMissedLessonsFilterParams();
  const pagination = useUrlPagination({ defaults: { page: 1, limit: 10 } });
  const coaches = useCoachesQuery(
    showCoach ? { page: 1, limit: 100, deletedStatus: "active" } : {},
  );
  const query = useMissedLessonsQuery({
    from: filters.from || undefined,
    to: filters.to || undefined,
    status: filters.status || undefined,
    watchStatus: filters.watchStatus || undefined,
    coachId: filters.coachId ? Number(filters.coachId) : undefined,
    page: pagination.page,
    limit: pagination.limit,
  });
  const actions = useMissedLessonsActions();

  const coachOptions = useMemo(
    () =>
      (coaches.data?.data ?? []).map((coach) => ({
        label: coach.fullName,
        value: String(coach.id),
      })),
    [coaches.data],
  );
  const changeHandlers = {
    from: filters.setFrom,
    to: filters.setTo,
    status: filters.setStatus,
    watchStatus: filters.setWatchStatus,
    coachId: filters.setCoachId,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="الحصص الفائتة"
        subtitle="متابعة الحصص التي لم يشاهدها الطلاب في يومها المحدد."
      />
      {query.data ? <MissedLessonsStats stats={query.data.stats} /> : null}
      <MissedLessonsFilters
        from={filters.from}
        to={filters.to}
        status={filters.status}
        watchStatus={filters.watchStatus}
        coachId={filters.coachId}
        showCoach={showCoach}
        coachOptions={coachOptions}
        coachesLoading={coaches.isLoading}
        onChange={(key, value) => {
          pagination.setPage(1);
          changeHandlers[key](value);
        }}
      />
      {query.isError && !query.data ? (
        <section className="dashboard-card text-right text-sm text-red-500">
          تعذر تحميل بيانات الحصص الفائتة.
        </section>
      ) : (
        <MissedLessonsTable
          items={query.data?.items ?? []}
          total={query.data?.total ?? 0}
          page={pagination.page}
          limit={pagination.limit}
          isLoading={query.isFetching}
          pendingOccurrenceId={actions.pendingOccurrenceId}
          onResolve={actions.open}
          onUnresolve={actions.unresolve}
          onChangePage={pagination.setPage}
          onChangeRowsPerPage={pagination.onChangeRowsPerPage}
        />
      )}
      <ResolveMissedLessonModal
        key={actions.selectedLesson?.occurrenceId ?? "closed"}
        lesson={actions.selectedLesson}
        isSubmitting={actions.isSubmitting}
        onClose={actions.close}
        onSubmit={actions.resolve}
      />
    </div>
  );
}
