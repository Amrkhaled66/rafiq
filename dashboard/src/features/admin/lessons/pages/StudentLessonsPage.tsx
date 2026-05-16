import { useMemo } from "react";
import { useParams } from "react-router-dom";

import LessonFormModal from "@/features/admin/lessons/components/StudentLessonsPage/LessonFormModal";
import StudentLessonsHeader from "@/features/admin/lessons/components/StudentLessonsPage/StudentLessonsHeader";
import StudentLessonsStatsSection from "@/features/admin/lessons/components/StudentLessonsPage/StudentLessonsStatsSection";
import StudentLessonsTable from "@/features/admin/lessons/components/StudentLessonsPage/StudentLessonsTable";
import { useStudentLessonsActions } from "@/features/admin/lessons/hooks/useStudentLessonsActions";
import { useStudentLessonsQuery } from "@/features/admin/lessons/queries/lessonQueries";
import type { LessonWeekday } from "@/features/admin/lessons/services/lessonService";
import { LESSON_WEEKDAY_LABELS, LESSON_WEEKDAY_ORDER } from "@/shared/const/weekdays";
import { getTodayWeekday } from "@/shared/utils/dates";


function getLessonDistanceFromToday(weekday: LessonWeekday) {
  const todayIndex = LESSON_WEEKDAY_ORDER.indexOf(getTodayWeekday());
  const lessonIndex = LESSON_WEEKDAY_ORDER.indexOf(weekday);

  if (lessonIndex >= todayIndex) {
    return lessonIndex - todayIndex;
  }

  return LESSON_WEEKDAY_ORDER.length - todayIndex + lessonIndex;
}

export default function StudentLessonsPage() {
  const { id } = useParams();
  const studentId = Number(id);

  const lessonsQuery = useStudentLessonsQuery(studentId);
  const lessonsActions = useStudentLessonsActions(studentId);
  const lessons = lessonsQuery.data ?? [];

  const nextLessonLabel = useMemo(() => {
    const nextLesson = [...lessons].sort((a, b) => {
      const distanceDiff =
        getLessonDistanceFromToday(a.weekday) -
        getLessonDistanceFromToday(b.weekday);

      if (distanceDiff !== 0) {
        return distanceDiff;
      }

      return a.id - b.id;
    })[0];

    if (!nextLesson) {
      return "-";
    }

    return `${nextLesson.name} - ${
      LESSON_WEEKDAY_LABELS[nextLesson.weekday] ?? nextLesson.weekday
    }`;
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

  return (
    <div className="space-y-6">
      <StudentLessonsHeader onAddLesson={lessonsActions.openCreateModal} />

      <StudentLessonsStatsSection
        nextLessonLabel={nextLessonLabel}
        totalLessons={lessons.length}
        totalSubjects={totalSubjects}
      />

      <StudentLessonsTable
        lessons={lessons}
        isLoading={lessonsQuery.isFetching}
        onEditLesson={lessonsActions.openEditModal}
        onDeleteLesson={lessonsActions.handleDelete}
      />

      <LessonFormModal
        isOpen={lessonsActions.isCreateOpen}
        onClose={lessonsActions.closeCreateModal}
        onSubmit={lessonsActions.handleCreate}
        isSubmitting={lessonsActions.isCreating}
        title="إضافة درس جديد"
        submitLabel="إضافة الدرس"
      />

      <LessonFormModal
        isOpen={Boolean(lessonsActions.editingLesson)}
        onClose={lessonsActions.closeEditModal}
        onSubmit={lessonsActions.handleUpdate}
        isSubmitting={lessonsActions.isUpdating}
        title="تعديل الدرس"
        submitLabel="حفظ التعديلات"
        lesson={lessonsActions.editingLesson}
      />
    </div>
  );
}
