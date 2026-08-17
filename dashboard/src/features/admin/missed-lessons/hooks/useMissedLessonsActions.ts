import { useState } from "react";
import {
  useResolveMissedLessonMutation,
  useUnresolveMissedLessonMutation,
} from "@/features/admin/missed-lessons/queries/missedLessonsQueries";
import type { MissedLessonRow } from "@/features/admin/missed-lessons/services/missedLessonsService";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

export default function useMissedLessonsActions() {
  const [selectedLesson, setSelectedLesson] = useState<MissedLessonRow | null>(
    null,
  );
  const resolveMutation = useResolveMissedLessonMutation();
  const unresolveMutation = useUnresolveMissedLessonMutation();

  async function resolve(note: string) {
    if (!selectedLesson) return;
    try {
      await resolveMutation.mutateAsync({
        occurrenceId: selectedLesson.occurrenceId,
        note,
      });
      appToast.success("تم تسجيل متابعة الحصة الفائتة.");
      setSelectedLesson(null);
    } catch (error) {
      showApiErrorToast(error, "تعذر تسجيل متابعة الحصة.");
    }
  }

  async function unresolve(row: MissedLessonRow) {
    try {
      await unresolveMutation.mutateAsync(row.occurrenceId);
      appToast.success("تم إلغاء متابعة الحصة الفائتة.");
    } catch (error) {
      showApiErrorToast(error, "تعذر إلغاء متابعة الحصة.");
    }
  }

  return {
    selectedLesson,
    open: setSelectedLesson,
    close: () => !resolveMutation.isPending && setSelectedLesson(null),
    resolve,
    unresolve,
    isSubmitting: resolveMutation.isPending,
    pendingOccurrenceId: resolveMutation.isPending
      ? (resolveMutation.variables?.occurrenceId ?? null)
      : unresolveMutation.isPending
        ? unresolveMutation.variables
        : null,
  };
}
