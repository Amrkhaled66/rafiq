export type SubscriptionStatus = "active" | "upcoming" | "ended" | "cancelled";
export type SubscriptionFilterKey = "all" | SubscriptionStatus;

export type SubscriptionItem = {
  id: number;
  studentId: number;
  packageId: number;
  packageName?: string;
  startsAt: string;
  endsAt: string;
  amountPaid: number;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
};
