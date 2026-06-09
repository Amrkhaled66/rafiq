import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useCompleteStudentPlanTaskMutation,
  useDeleteStudentPlanMutation,
} from "@/features/admin/plans/queries/plansQueries";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

export function useStudentPlanDetailsActions(studentId: number, planId: number) {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deletePlanMutation = useDeleteStudentPlanMutation(studentId, planId);
  const completeTaskMutation = useCompleteStudentPlanTaskMutation(studentId, planId);

  function openDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function handleEdit() {
    navigate(`edit`);
  }

  async function handleConfirmDelete() {
    try {
      await deletePlanMutation.mutateAsync();
      setIsDeleteModalOpen(false);
      appToast.success("تم حذف الخطة بنجاح.");
      navigate(`/students/${studentId}/plans`);
    } catch (error) {
      showApiErrorToast(error, "تعذر حذف الخطة.");
    }
  }

  async function handleCompleteTask(taskId: number) {
    try {
      await completeTaskMutation.mutateAsync(taskId);
      appToast.success("تم تحديث حالة المهمة.");
    } catch (error) {
      showApiErrorToast(error, "تعذر تحديث حالة المهمة.");
    }
  }

  return {
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    handleEdit,
    handleConfirmDelete,
    handleCompleteTask,
    isDeleting: deletePlanMutation.isPending,
    completingTaskId: completeTaskMutation.isPending
      ? completeTaskMutation.variables
      : null,
  };
}
