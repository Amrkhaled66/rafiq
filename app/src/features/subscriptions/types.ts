export type SubscriptionStatus = "active" | "upcoming" | "ended";
export type SubscriptionFilterKey = "all" | SubscriptionStatus;

export type SubscriptionItem = {
  id: number;
  studentId: number;
  packageId: number;
  packageName: string;
  startsAt: string;
  endsAt: string;
  amountPaid: number;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
};

export type StudentSubscriptionsResponse = {
  items: SubscriptionItem[];
};
