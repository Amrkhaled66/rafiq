import { useState } from "react";

import {
  useCreateStudentLessonMutation,
  useDeleteStudentLessonMutation,
  useUpdateStudentLessonMutation,
} from "@/features/admin/lessons/queries/lessonQueries";
import type { Lesson } from "@/features/admin/lessons/services/lessonService";
import type { LessonFormValues } from "@/features/admin/lessons/schema/lessonSchema";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

export function useStudentLessonsActions(studentId: number) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const createLessonMutation = useCreateStudentLessonMutation(studentId);
  const deleteLessonMutation = useDeleteStudentLessonMutation(studentId);
  const updateLessonMutation = useUpdateStudentLessonMutation(
    studentId,
    editingLesson?.id ?? 0,
  );

  function openCreateModal() {
    setIsCreateOpen(true);
  }

  function closeCreateModal() {
    setIsCreateOpen(false);
    createLessonMutation.reset();
  }

  function openEditModal(lesson: Lesson) {
    setEditingLesson(lesson);
  }

  function closeEditModal() {
    setEditingLesson(null);
    updateLessonMutation.reset();
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
    if (!editingLesson) {
      return;
    }

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

  return {
    isCreateOpen,
    editingLesson,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating: createLessonMutation.isPending,
    isUpdating: updateLessonMutation.isPending,
  };
}
