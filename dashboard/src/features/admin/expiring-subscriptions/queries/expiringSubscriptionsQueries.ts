import { useQuery } from "@tanstack/react-query";

import {
  listExpiringSubscriptions,
  type ListExpiringSubscriptionsParams,
} from "@/features/admin/expiring-subscriptions/services/expiringSubscriptionsService";

export const expiringSubscriptionsQueryKey = [
  "admin-expiring-subscriptions",
] as const;

export function useExpiringSubscriptionsQuery(
  params: ListExpiringSubscriptionsParams,
) {
  return useQuery({
    queryKey: [...expiringSubscriptionsQueryKey, params],
    queryFn: () => listExpiringSubscriptions(params),
  });
}
