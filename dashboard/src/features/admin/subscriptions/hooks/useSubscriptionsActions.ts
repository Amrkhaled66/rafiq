import { useState } from "react";

import {
  useCancelSubscriptionMutation,
  useCreateSubscriptionMutation,
} from "@/features/admin/subscriptions/queries/subscriptionQueries";
import type { SubscriptionFormValues } from "@/features/admin/subscriptions/schema/subscriptionSchema";
import type { SubscriptionRow } from "@/features/admin/subscriptions/services/subscriptionService";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

export function useSubscriptionsActions() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [cancellingSubscription, setCancellingSubscription] =
    useState<SubscriptionRow | null>(null);
  const createSubscriptionMutation = useCreateSubscriptionMutation();
  const cancelSubscriptionMutation = useCancelSubscriptionMutation();

  function openCreateModal() {
    setIsCreateOpen(true);
  }

  function closeCreateModal() {
    setIsCreateOpen(false);
    createSubscriptionMutation.reset();
  }

  function openCancelModal(subscription: SubscriptionRow) {
    setCancellingSubscription(subscription);
  }

  function closeCancelModal() {
    setCancellingSubscription(null);
    cancelSubscriptionMutation.reset();
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

  function handleCancel(reason: string) {
    if (!cancellingSubscription) {
      return;
    }

    cancelSubscriptionMutation.mutate(
      {
        subscriptionId: cancellingSubscription.id,
        payload: { reason },
      },
      {
        onSuccess: () => {
          setCancellingSubscription(null);
          appToast.success("تم إلغاء الاشتراك بنجاح.");
        },
        onError: (error) => {
          showApiErrorToast(error, "تعذر إلغاء الاشتراك.");
        },
      },
    );
  }

  return {
    isCreateOpen,
    cancellingSubscription,
    openCreateModal,
    closeCreateModal,
    openCancelModal,
    closeCancelModal,
    handleCreate,
    handleCancel,
    isCreating: createSubscriptionMutation.isPending,
    isCancelling: cancelSubscriptionMutation.isPending,
  };
}
