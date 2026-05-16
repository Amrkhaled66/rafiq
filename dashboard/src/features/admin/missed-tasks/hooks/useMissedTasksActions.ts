import { useState } from "react";

import {
  useResolveMissedTaskMutation,
  useUnresolveMissedTaskMutation,
} from "@/features/admin/missed-tasks/queries/missedTasksQueries";
import type { MissedTaskRow } from "@/features/admin/missed-tasks/services/missedTasksService";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

export default function useMissedTasksActions() {
  const [resolvingTask, setResolvingTask] = useState<MissedTaskRow | null>(null);
  const resolveMutation = useResolveMissedTaskMutation();
  const unresolveMutation = useUnresolveMissedTaskMutation();

  function openResolveModal(task: MissedTaskRow) {
    setResolvingTask(task);
  }

  function closeResolveModal() {
    if (resolveMutation.isPending) {
      return;
    }

    setResolvingTask(null);
  }

  async function handleResolve(note: string) {
    if (!resolvingTask) {
      return;
    }

    try {
      await resolveMutation.mutateAsync({ taskId: resolvingTask.taskId, note });
      appToast.success("تم تعليم المهمة الفائتة كمحلولة.");
      setResolvingTask(null);
    } catch (error) {
      showApiErrorToast(error, "تعذر حل المهمة الفائتة.");
    }
  }

  async function handleUnresolve(task: MissedTaskRow) {
    try {
      await unresolveMutation.mutateAsync(task.taskId);
      appToast.success("تم إلغاء حل المهمة الفائتة.");
    } catch (error) {
      showApiErrorToast(error, "تعذر إلغاء حل المهمة الفائتة.");
    }
  }

  return {
    resolvingTask,
    openResolveModal,
    closeResolveModal,
    handleResolve,
    handleUnresolve,
    resolvingTaskId: resolveMutation.isPending
      ? resolveMutation.variables?.taskId ?? null
      : unresolveMutation.isPending
        ? unresolveMutation.variables
        : null,
    isSubmittingResolve: resolveMutation.isPending,
  };
}
