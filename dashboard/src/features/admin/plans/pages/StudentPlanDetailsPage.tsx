import { useParams } from "react-router-dom";

import DeletePlanConfirmModal from "@/features/admin/plans/components/PlanDetailsPage/DeletePlanConfirmModal";
import StudentPlanDaySection from "@/features/admin/plans/components/PlanDetailsPage/StudentPlanDaySection";
import StudentPlanDetailsHeader from "@/features/admin/plans/components/PlanDetailsPage/StudentPlanDetailsHeader";
import StudentPlanDetailsStatsSection from "@/features/admin/plans/components/PlanDetailsPage/StudentPlanDetailsStatsSection";
import { useStudentPlanDetailsActions } from "@/features/admin/plans/hooks/useStudentPlanDetailsActions";
import { useStudentPlanDetailQuery } from "@/features/admin/plans/queries/plansQueries";

export default function StudentPlanDetailsPage() {
  const { id, planId } = useParams();
  const studentId = Number(id);
  const numericPlanId = Number(planId);

  const detailQuery = useStudentPlanDetailQuery(studentId, numericPlanId);
  const actions = useStudentPlanDetailsActions(studentId, numericPlanId);

  if (
    !Number.isFinite(studentId) ||
    studentId <= 0 ||
    !Number.isFinite(numericPlanId) ||
    numericPlanId <= 0
  ) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تفاصيل الخطة</h1>
        <p className="text-subTitle mt-2 text-sm">بيانات الخطة غير صالحة.</p>
      </section>
    );
  }

  if (detailQuery.isLoading) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تفاصيل الخطة</h1>
        <p className="text-subTitle mt-2 text-sm">جاري تحميل الخطة...</p>
      </section>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تفاصيل الخطة</h1>
        <p className="mt-2 text-sm text-red-500">تعذر تحميل تفاصيل الخطة.</p>
      </section>
    );
  }

  const { plan, stats, days } = detailQuery.data;

  return (
    <div className="space-y-6">
      <StudentPlanDetailsHeader
        title={plan.name}
        startsOn={plan.startsOn}
        endsOn={plan.endsOn}
        onDelete={actions.openDeleteModal}
        onEdit={actions.handleEdit}
      />

      <StudentPlanDetailsStatsSection stats={stats} />

      <div className="space-y-4">
        {days.map((day) => (
          <StudentPlanDaySection
            key={day.date}
            day={day}
            onCompleteTask={actions.handleCompleteTask}
            completingTaskId={actions.completingTaskId}
          />
        ))}
      </div>

      <DeletePlanConfirmModal
        isOpen={actions.isDeleteModalOpen}
        onClose={actions.closeDeleteModal}
        onConfirm={actions.handleConfirmDelete}
        isDeleting={actions.isDeleting}
      />
    </div>
  );
}
