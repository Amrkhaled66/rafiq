import { api } from "@/lib/api";

export type SubscriptionStatus =
  | "active"
  | "upcoming"
  | "ended"
  | "cancelled";

export type SubscriptionPackage = {
  id: number;
  name: string;
  durationDays: number;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionRow = {
  id: number;
  studentId: number;
  studentName: string;
  packageId: number;
  packageName: string;
  startsAt: string;
  endsAt: string;
  status: SubscriptionStatus;
};

export type SubscriptionStats = {
  totalCount: number;
  activeSubscriptions: number;
  soonEndingSubscriptions: number;
  endedSubscriptions: number;
};

export type ListSubscriptionsParams = {
  page?: number;
  limit?: number;
  endingSoon?: boolean;
};

export type SubscriptionsResponse = {
  stats: SubscriptionStats;
  items: SubscriptionRow[];
  page: number;
  limit: number;
  total: number;
};

export type CreateSubscriptionPackagePayload = {
  name: string;
  durationDays: number;
  price: number;
};

export type CreateSubscriptionPayload = {
  studentPhone: string;
  packageId: number;
  startsAt: string;
  amountPaid: number;
};

export async function listSubscriptionPackages(): Promise<
  SubscriptionPackage[]
> {
  const { data } = await api.get<SubscriptionPackage[]>("/subscription-packages");
  return data;
}

export async function createSubscriptionPackage(
  payload: CreateSubscriptionPackagePayload,
): Promise<SubscriptionPackage> {
  const { data } = await api.post<SubscriptionPackage>(
    "/subscription-packages",
    payload,
  );
  return data;
}

export async function listSubscriptions(
  params: ListSubscriptionsParams = {},
): Promise<SubscriptionsResponse> {
  const { data } = await api.get<SubscriptionsResponse>("/subscriptions", {
    params,
  });
  return data;
}

export async function createSubscription(
  payload: CreateSubscriptionPayload,
): Promise<SubscriptionRow> {
  const { data } = await api.post<SubscriptionRow>("/subscriptions", payload);
  return data;
}
