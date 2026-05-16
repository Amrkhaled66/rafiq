import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSubscription,
  createSubscriptionPackage,
  listSubscriptionPackages,
  listSubscriptions,
  type CreateSubscriptionPackagePayload,
  type CreateSubscriptionPayload,
  type ListSubscriptionsParams,
} from "@/features/admin/subscriptions/services/subscriptionService";

export const subscriptionPackagesQueryKey = [
  "admin-subscription-packages",
] as const;
export const subscriptionsQueryKey = ["admin-subscriptions"] as const;

export function useSubscriptionPackagesQuery() {
  return useQuery({
    queryKey: subscriptionPackagesQueryKey,
    queryFn: listSubscriptionPackages,
  });
}

export function useCreateSubscriptionPackageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPackagePayload) =>
      createSubscriptionPackage(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: subscriptionPackagesQueryKey,
      });
    },
  });
}

export function useSubscriptionsQuery(params: ListSubscriptionsParams = {}) {
  return useQuery({
    queryKey: [...subscriptionsQueryKey, params],
    queryFn: () => listSubscriptions(params),
  });
}

export function useCreateSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) =>
      createSubscription(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: subscriptionsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: subscriptionPackagesQueryKey,
        }),
      ]);
    },
  });
}
