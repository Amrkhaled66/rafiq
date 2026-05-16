import { useState } from "react";

import { useCreateSubscriptionPackageMutation } from "@/features/admin/subscriptions/queries/subscriptionQueries";
import type { SubscriptionPackageFormValues } from "@/features/admin/subscriptions/schema/subscriptionPackageSchema";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

export function useSubscriptionPackagesActions() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createPackageMutation = useCreateSubscriptionPackageMutation();

  function openCreateModal() {
    setIsCreateOpen(true);
  }

  function closeCreateModal() {
    setIsCreateOpen(false);
    createPackageMutation.reset();
  }

  function handleCreate(values: SubscriptionPackageFormValues) {
    createPackageMutation.mutate(values, {
      onSuccess: () => {
        setIsCreateOpen(false);
        appToast.success("تمت إضافة الباقة بنجاح.");
      },
      onError: (error) => {
        showApiErrorToast(error, "تعذر إضافة الباقة.");
      },
    });
  }

  return {
    isCreateOpen,
    openCreateModal,
    closeCreateModal,
    handleCreate,
    isCreating: createPackageMutation.isPending,
  };
}
