import { api } from "@/lib/api";

export const EXPIRING_SUBSCRIPTION_DAY_WINDOWS = [3, 7, 14, 30] as const;

export type ExpiringSubscriptionDays =
  (typeof EXPIRING_SUBSCRIPTION_DAY_WINDOWS)[number];

export type ExpiringSubscriptionRow = {
  id: number;
  studentId: number;
  studentName: string;
  packageId: number;
  packageName: string;
  startsAt: string;
  endsAt: string;
  daysRemaining: number;
};

export type ListExpiringSubscriptionsParams = {
  days: ExpiringSubscriptionDays;
  page: number;
  limit: number;
};

export type ExpiringSubscriptionsResponse = {
  items: ExpiringSubscriptionRow[];
  page: number;
  limit: number;
  total: number;
  days: ExpiringSubscriptionDays;
};

export async function listExpiringSubscriptions(
  params: ListExpiringSubscriptionsParams,
): Promise<ExpiringSubscriptionsResponse> {
  const { data } = await api.get<ExpiringSubscriptionsResponse>(
    "/subscriptions/expiring",
    { params },
  );

  return data;
}
