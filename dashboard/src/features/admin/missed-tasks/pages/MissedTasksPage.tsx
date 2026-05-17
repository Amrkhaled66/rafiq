import { useMemo, useState } from "react";

import { useCoachesQuery } from "@/features/admin/coaches/queries/coachQueries";
import MissedTasksFilters from "@/features/admin/missed-tasks/components/MissedTasksPage/MissedTasksFilters";
import ResolveMissedTaskModal from "@/features/admin/missed-tasks/components/MissedTasksPage/ResolveMissedTaskModal";
import MissedTasksStatsSection from "@/features/admin/missed-tasks/components/MissedTasksPage/MissedTasksStatsSection";
import MissedTasksTable from "@/features/admin/missed-tasks/components/MissedTasksPage/MissedTasksTable";
import useMissedTasksActions from "@/features/admin/missed-tasks/hooks/useMissedTasksActions";
import { useMissedTasksQuery } from "@/features/admin/missed-tasks/queries/missedTasksQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import useResetPageOnChange from "@/features/admin/shared/hooks/useResetPageOnChange";
import useServerPagination from "@/features/admin/shared/hooks/useServerPagination";
import { useAuth } from "@/shared/context/authContext";
import { can } from "@/shared/auth/can";

export default function MissedTasksPage() {
  const { authData } = useAuth();
  const canReadCoaches = can(authData.user, "coaches", "read");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<"" | "resolved" | "unresolved">("");
  const [coachId, setCoachId] = useState("");

  const pagination = useServerPagination();
  useResetPageOnChange(pagination.setPage, [from, to, status, coachId]);

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
    from: from || undefined,
    to: to || undefined,
    status: status || undefined,
    coachId: coachId ? Number(coachId) : undefined,
    page: pagination.page,
    limit: pagination.limit,
  });
  const actions = useMissedTasksActions();

  if (missedTasksQuery.isLoading && !missedTasksQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">المهام الفائتة</h1>
        <p className="text-subTitle mt-2 text-sm">
          جاري تحميل صفحة المهام الفائتة...
        </p>
      </section>
    );
  }

  if (missedTasksQuery.isError || !missedTasksQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">المهام الفائتة</h1>
        <p className="mt-2 text-sm text-red-500">
          تعذر تحميل بيانات المهام الفائتة.
        </p>
      </section>
    );
  }

  const { stats, items, total, page, limit } = missedTasksQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="المهام الفائتة"
        subtitle="متابعة المهام الفائتة وتسجيل حلها من قبل المدرب."
      />

      <MissedTasksStatsSection stats={stats} />

      <MissedTasksFilters
        from={from}
        to={to}
        status={status}
        coachId={coachId}
        canReadCoaches={Boolean(canReadCoaches)}
        coachOptions={coachOptions}
        coachesLoading={Boolean(canReadCoaches && coachesQuery.isLoading)}
        onFromChange={setFrom}
        onToChange={setTo}
        onStatusChange={setStatus}
        onCoachChange={setCoachId}
      />

      <MissedTasksTable
        items={items}
        total={total}
        page={page}
        limit={limit}
        isLoading={missedTasksQuery.isFetching}
        canReadCoaches={Boolean(canReadCoaches)}
        resolvingTaskId={actions.resolvingTaskId}
        onResolve={actions.openResolveModal}
        onUnresolve={actions.handleUnresolve}
        onChangePage={pagination.setPage}
        onChangeRowsPerPage={pagination.onChangeRowsPerPage}
      />

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
