import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import LessonFormModal from "@/features/admin/lessons/components/StudentLessonsPage/LessonFormModal";
import StudentLessonsHeader from "@/features/admin/lessons/components/StudentLessonsPage/StudentLessonsHeader";
import StudentLessonsStatsSection from "@/features/admin/lessons/components/StudentLessonsPage/StudentLessonsStatsSection";
import StudentLessonsTable from "@/features/admin/lessons/components/StudentLessonsPage/StudentLessonsTable";
import {
  useCreateStudentLessonMutation,
  useDeleteStudentLessonMutation,
  useStudentLessonsQuery,
  useUpdateStudentLessonMutation,
} from "@/features/admin/lessons/queries/lessonQueries";
import type { Lesson } from "@/features/admin/lessons/services/lessonService";
import type { LessonFormValues } from "@/features/admin/lessons/schema/lessonSchema";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";
import { formatDateArShort2DigitDay } from "@/shared/utils/dates";

export default function StudentLessonsPage() {
  const { id } = useParams();
  const studentId = Number(id);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const lessonsQuery = useStudentLessonsQuery(studentId);
  const createLessonMutation = useCreateStudentLessonMutation(studentId);
  const deleteLessonMutation = useDeleteStudentLessonMutation(studentId);
  const updateLessonMutation = useUpdateStudentLessonMutation(
    studentId,
    editingLesson?.id ?? 0,
  );

  const lessons = lessonsQuery.data ?? [];

  const nextLessonLabel = useMemo(() => {
    const today = new Date();
    const nextLesson = lessons
      .filter((lesson) => new Date(lesson.scheduledAt) >= today)
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      )[0];

    return nextLesson ? formatDateArShort2DigitDay(nextLesson.scheduledAt) : "-";
  }, [lessons]);

  const totalSubjects = useMemo(
    () => new Set(lessons.map((lesson) => lesson.subject)).size,
    [lessons],
  );

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">دروس الطالب</h1>
        <p className="text-subTitle mt-2 text-sm">رقم الطالب غير صالح.</p>
      </section>
    );
  }

  if (lessonsQuery.isLoading) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">دروس الطالب</h1>
        <p className="text-subTitle mt-2 text-sm">جاري تحميل الدروس...</p>
      </section>
    );
  }

  if (lessonsQuery.isError) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">دروس الطالب</h1>
        <p className="mt-2 text-sm text-red-500">تعذر تحميل الدروس.</p>
      </section>
    );
  }

  function handleCreate(values: LessonFormValues) {
    createLessonMutation.mutate(values, {
      onSuccess: () => {
        setIsCreateOpen(false);
        appToast.success("تمت إضافة الدرس بنجاح.");
      },
      onError: (error) => {
        showApiErrorToast(error, "تعذر إضافة الدرس.");
      },
    });
  }

  function handleUpdate(values: LessonFormValues) {
    if (!editingLesson) return;

    updateLessonMutation.mutate(values, {
      onSuccess: () => {
        setEditingLesson(null);
        appToast.success("تم تعديل الدرس بنجاح.");
      },
      onError: (error) => {
        showApiErrorToast(error, "تعذر تعديل الدرس.");
      },
    });
  }

  function handleDelete(lesson: Lesson) {
    const confirmed = window.confirm(`هل تريد حذف الدرس "${lesson.name}"؟`);

    if (!confirmed) {
      return;
    }

    deleteLessonMutation.mutate(lesson.id, {
      onSuccess: () => {
        appToast.success("تم حذف الدرس بنجاح.");
      },
      onError: (error) => {
        showApiErrorToast(error, "تعذر حذف الدرس.");
      },
    });
  }

  return (
    <div className="space-y-6">
      <StudentLessonsHeader onAddLesson={() => setIsCreateOpen(true)} />

      <StudentLessonsStatsSection
        nextLessonLabel={nextLessonLabel}
        totalLessons={lessons.length}
        totalSubjects={totalSubjects}
      />

      <StudentLessonsTable
        lessons={lessons}
        isLoading={lessonsQuery.isFetching}
        onEditLesson={setEditingLesson}
        onDeleteLesson={handleDelete}
      />

      <LessonFormModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          createLessonMutation.reset();
        }}
        onSubmit={handleCreate}
        isSubmitting={createLessonMutation.isPending}
        title="إضافة درس جديد"
        submitLabel="إضافة الدرس"
      />

      <LessonFormModal
        isOpen={Boolean(editingLesson)}
        onClose={() => {
          setEditingLesson(null);
          updateLessonMutation.reset();
        }}
        onSubmit={handleUpdate}
        isSubmitting={updateLessonMutation.isPending}
        title="تعديل الدرس"
        submitLabel="حفظ التعديلات"
        lesson={editingLesson}
      />
    </div>
  );
}

