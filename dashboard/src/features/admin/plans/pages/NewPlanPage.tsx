import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { makeId } from "@/features/admin/plans/components/NewPlanPage/id";
import NewPlanPeriodCard from "@/features/admin/plans/components/NewPlanPage/NewPlanPeriodCard";
import PlanCalendarGrid from "@/features/admin/plans/components/NewPlanPage/PlanCalendarGrid";
import PlanDayEditorModal from "@/features/admin/plans/components/NewPlanPage/PlanDayEditorModal";
import type { PlanDay } from "@/features/admin/plans/components/NewPlanPage/types";
import useNewPlanBuilder from "@/features/admin/plans/hooks/useNewPlanBuilder";
import {
  useCreateStudentPlanMutation,
  useStudentPlanDetailQuery,
  useUpdateStudentPlanMutation,
} from "@/features/admin/plans/queries/plansQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import { useStudentCoachesQuery } from "@/features/admin/students/queries/studentQueries";
import Button from "@/shared/components/Button";
import { useAuth } from "@/shared/context/authContext";
import { appToast } from "@/shared/lib/toast";
import { formatDateLocal } from "@/shared/utils/dates";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

function buildEditableDays(
  startsOn: string,
  endsOn: string,
  groupedDays: Array<{
    date: string;
    tasks: Array<{ id: number; title: string; subject: string }>;
  }>,
): PlanDay[] {
  const from = new Date(startsOn);
  const to = new Date(endsOn);

  if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || to < from) {
    return [];
  }

  const groupedMap = new Map(
    groupedDays.map((day) => [
      day.date,
      day.tasks.map((task) => ({
        id: String(task.id),
        title: task.title,
        subject: task.subject,
      })),
    ]),
  );

  const cursor = new Date(from);
  const days: PlanDay[] = [];

  while (cursor <= to) {
    const date = formatDateLocal(cursor);
    days.push({
      date,
      tasks: groupedMap.get(date) ?? [],
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export default function NewPlanPage() {
  const navigate = useNavigate();
  const { id, planId } = useParams();
  const studentId = Number(id);
  const numericPlanId = Number(planId);
  const isEditMode = Number.isFinite(numericPlanId) && numericPlanId > 0;

  const { authData } = useAuth();
  const isSuperAdmin = authData.user?.role === "super_admin";

  const { name, fromDate, toDate, coachId, days, durationDays, actions } =
    useNewPlanBuilder();

  const createPlanMutation = useCreateStudentPlanMutation(studentId);
  const updatePlanMutation = useUpdateStudentPlanMutation(studentId, numericPlanId);
  const detailQuery = useStudentPlanDetailQuery(studentId, numericPlanId);
  const hydratedPlanIdRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!isEditMode || !detailQuery.data) {
      return;
    }

    if (hydratedPlanIdRef.current === detailQuery.data.plan.id) {
      return;
    }

    actions.loadPlan({
      name: detailQuery.data.plan.name,
      fromDate: detailQuery.data.plan.startsOn,
      toDate: detailQuery.data.plan.endsOn,
      coachId: detailQuery.data.plan.coachId ?? null,
      days: buildEditableDays(
        detailQuery.data.plan.startsOn,
        detailQuery.data.plan.endsOn,
        detailQuery.data.days,
      ).map((day) => ({
        ...day,
        tasks: day.tasks.map((task) => ({
          ...task,
          id: task.id || makeId(),
        })),
      })),
    });

    hydratedPlanIdRef.current = detailQuery.data.plan.id;
  }, [actions, detailQuery.data, isEditMode]);

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
        errors.push("لا يوجد مدربون معينون لهذا الطالب. قم بتعيين مدرب قبل حفظ الخطة.");
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
        <h1 className="text-foreground text-2xl font-bold">
          {isEditMode ? "تعديل الخطة" : "خطة جديدة"}
        </h1>
        <p className="text-subTitle mt-2 text-sm">رقم الطالب غير صالح.</p>
      </section>
    );
  }

  if (isEditMode && detailQuery.isLoading) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تعديل الخطة</h1>
        <p className="text-subTitle mt-2 text-sm">جاري تحميل الخطة...</p>
      </section>
    );
  }

  if (isEditMode && (detailQuery.isError || !detailQuery.data)) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">تعديل الخطة</h1>
        <p className="mt-2 text-sm text-red-500">تعذر تحميل بيانات الخطة.</p>
      </section>
    );
  }

  async function handleSubmit() {
    setSubmitErrors([]);

    if (!validation.isValid) {
      setSubmitErrors(validation.errors);
      return;
    }

    const payload = {
      name: name.trim(),
      startsOn: fromDate,
      endsOn: toDate,
      ...(isSuperAdmin && coachId ? { coachId } : {}),
      tasks: days.flatMap((day) =>
        day.tasks.map((task) => ({
          title: task.title.trim(),
          subject: task.subject,
          dueOn: day.date,
        })),
      ),
    };

    try {
      if (isEditMode) {
        await updatePlanMutation.mutateAsync(payload);
        appToast.success("تم تحديث الخطة بنجاح.");
        navigate(`/students/${studentId}/plans/${numericPlanId}`);
      } else {
        await createPlanMutation.mutateAsync(payload);
        appToast.success("تم حفظ الخطة بنجاح.");
        navigate(`/students/${studentId}/plans`);
      }
    } catch (error) {
      showApiErrorToast(
        error,
        isEditMode ? "تعذر تحديث الخطة." : "تعذر حفظ الخطة.",
      );
    }
  }

  const isSubmitting = createPlanMutation.isPending || updatePlanMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "تعديل الخطة" : "خطة جديدة"}
        subtitle={
          isEditMode
            ? `تعديل الخطة رقم ${numericPlanId} للطالب رقم ${studentId}.`
            : `إنشاء خطة جديدة للطالب رقم ${studentId}.`
        }
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              رجوع
            </Button>
            <Button onClick={handleSubmit} disabled={!validation.isValid || isSubmitting}>
              {isEditMode ? "حفظ التعديلات" : "حفظ الخطة"}
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
