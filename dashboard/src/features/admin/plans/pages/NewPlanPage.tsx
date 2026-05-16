import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import NewPlanPeriodCard from "@/features/admin/plans/components/NewPlanPage/NewPlanPeriodCard";
import PlanCalendarGrid from "@/features/admin/plans/components/NewPlanPage/PlanCalendarGrid";
import PlanDayEditorModal from "@/features/admin/plans/components/NewPlanPage/PlanDayEditorModal";
import useNewPlanBuilder from "@/features/admin/plans/hooks/useNewPlanBuilder";
import { useCreateStudentPlanMutation } from "@/features/admin/plans/queries/plansQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import { useStudentCoachesQuery } from "@/features/admin/students/queries/studentQueries";
import Button from "@/shared/components/Button";
import { useAuth } from "@/shared/context/authContext";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

export default function NewPlanPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const studentId = Number(id);

  const { authData } = useAuth();
  const isSuperAdmin = authData.user?.role === "super_admin";

  const { name, fromDate, toDate, coachId, days, durationDays, actions } =
    useNewPlanBuilder();

  const createPlanMutation = useCreateStudentPlanMutation(studentId);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);

  const assignedCoachesQuery = useStudentCoachesQuery(studentId);
  const assignedCoaches = assignedCoachesQuery.data ?? [];

  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);
  const isDayModalOpen = selectedDayDate != null;

  const selectedDay = useMemo(() => {
    if (!selectedDayDate) return null;
    return days.find((day) => day.date === selectedDayDate) ?? null;
  }, [days, selectedDayDate]);

  useEffect(() => {
    if (selectedDayDate && !selectedDay) {
      setSelectedDayDate(null);
    }
  }, [selectedDay, selectedDayDate]);

  const validation = useMemo(() => {
    const errors: string[] = [];

    if (!name.trim()) {
      errors.push("اسم الخطة مطلوب.");
    }

    if (!fromDate || !toDate) {
      errors.push("يجب تحديد From و To.");
    } else {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime())) {
        errors.push("تاريخ From/To غير صالح.");
      } else if (to < from) {
        errors.push("يجب أن يكون To أكبر من أو يساوي From.");
      }
    }

    if (isSuperAdmin) {
      if (assignedCoaches.length === 0) {
        errors.push(
          "لا يوجد مدربون معينون لهذا الطالب. قم بتعيين مدرب قبل حفظ الخطة.",
        );
      } else if (!coachId) {
        errors.push("اختيار المدرب مطلوب.");
      }
    }

    const allTasks = days.flatMap((day) =>
      day.tasks.map((task) => ({ ...task, dueOn: day.date })),
    );

    if (allTasks.length === 0) {
      errors.push("يجب إضافة مهمة واحدة على الأقل.");
    }

    for (const task of allTasks) {
      if (!task.title.trim()) {
        errors.push("يوجد مهام بدون عنوان.");
        break;
      }

      if (!task.subject) {
        errors.push("يوجد مهام بدون مادة.");
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [
    assignedCoaches.length,
    coachId,
    days,
    fromDate,
    isSuperAdmin,
    name,
    toDate,
  ]);

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">خطة جديدة</h1>
        <p className="text-subTitle mt-2 text-sm">رقم الطالب غير صالح.</p>
      </section>
    );
  }

  async function handleSubmit() {
    setSubmitErrors([]);

    if (!validation.isValid) {
      setSubmitErrors(validation.errors);
      return;
    }

    try {
      const tasks = days.flatMap((day) =>
        day.tasks.map((task) => ({
          title: task.title.trim(),
          subject: task.subject,
          dueOn: day.date,
        })),
      );

      await createPlanMutation.mutateAsync({
        name: name.trim(),
        startsOn: fromDate,
        endsOn: toDate,
        ...(isSuperAdmin && coachId ? { coachId } : {}),
        tasks,
      });

      appToast.success("تم حفظ الخطة بنجاح.");
      navigate(`/students/${studentId}/plans`);
    } catch (error) {
      showApiErrorToast(error, "تعذر حفظ الخطة.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="خطة جديدة"
        subtitle={`إنشاء خطة جديدة للطالب رقم ${studentId}.`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              رجوع
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!validation.isValid || createPlanMutation.isPending}
            >
              حفظ الخطة
            </Button>
          </div>
        }
      />

      {submitErrors.length > 0 ? (
        <section className="dashboard-card text-right">
          <h3 className="text-foreground text-base font-bold">أخطاء</h3>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-red-600">
            {submitErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <NewPlanPeriodCard
          name={name}
          onNameChange={actions.setName}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={actions.setFromDate}
          onToDateChange={actions.setToDate}
          duration={durationDays || undefined}
          isSuperAdmin={Boolean(isSuperAdmin)}
          assignedCoaches={assignedCoaches}
          coachId={coachId}
          onCoachIdChange={actions.setCoachId}
        />

        {days.length > 0 ? (
          <PlanCalendarGrid
            days={days}
            selectedDayDate={selectedDayDate}
            onSelectDay={setSelectedDayDate}
          />
        ) : (
          <section className="dashboard-card col-span-2 h-fit text-right">
            <h2 className="text-foreground text-lg font-bold">أيام الخطة</h2>
            <p className="text-subTitle mt-1 text-sm">
              اختر فترة الخطة من اليمين لبدء إنشاء أيام الخطة.
            </p>
          </section>
        )}
      </section>

      {selectedDay ? (
        <PlanDayEditorModal
          isOpen={isDayModalOpen}
          day={selectedDay}
          onClose={() => setSelectedDayDate(null)}
          onUpdateTask={(taskId, patch) =>
            actions.updateTask(selectedDay.date, taskId, patch)
          }
          onAddTask={() => actions.addTask(selectedDay.date)}
          onDeleteTask={(taskId) => actions.deleteTask(selectedDay.date, taskId)}
        />
      ) : null}
    </div>
  );
}

