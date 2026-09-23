import { useState } from "react";

import {
  useCreateStudentLessonMutation,
  useDeleteStudentLessonMutation,
  useUpdateStudentLessonMutation,
} from "@/features/admin/lessons/queries/lessonQueries";
import type { LessonFormValues } from "@/features/admin/lessons/schema/lessonSchema";
import type { Lesson } from "@/features/admin/lessons/services/lessonService";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

export function useStudentLessonsActions(studentId: number) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

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

  function closeDeleteModal() {
    if (deleteLessonMutation.isPending) {
      return;
    }

    setLessonToDelete(null);
    deleteLessonMutation.reset();
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
    setLessonToDelete(lesson);
  }

  function confirmDelete() {
    if (!lessonToDelete) {
      return;
    }

    deleteLessonMutation.mutate(lessonToDelete.id, {
      onSuccess: () => {
        setLessonToDelete(null);
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
    lessonToDelete,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    closeDeleteModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    confirmDelete,
    isCreating: createLessonMutation.isPending,
    isUpdating: updateLessonMutation.isPending,
    isDeleting: deleteLessonMutation.isPending,
  };
}
