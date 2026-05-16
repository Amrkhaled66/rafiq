import { useState } from "react";

import { useCreateSubscriptionMutation } from "@/features/admin/subscriptions/queries/subscriptionQueries";
import type { SubscriptionFormValues } from "@/features/admin/subscriptions/schema/subscriptionSchema";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

export function useSubscriptionsActions() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createSubscriptionMutation = useCreateSubscriptionMutation();

  function openCreateModal() {
    setIsCreateOpen(true);
  }

  function closeCreateModal() {
    setIsCreateOpen(false);
    createSubscriptionMutation.reset();
  }

  function handleCreate(values: SubscriptionFormValues) {
    createSubscriptionMutation.mutate(values, {
      onSuccess: () => {
        setIsCreateOpen(false);
        appToast.success("تمت إضافة الاشتراك بنجاح.");
      },
      onError: (error) => {
        showApiErrorToast(error, "تعذر إضافة الاشتراك.");
      },
    });
  }

  return {
    isCreateOpen,
    openCreateModal,
    closeCreateModal,
    handleCreate,
    isCreating: createSubscriptionMutation.isPending,
  };
}
