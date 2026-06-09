import { api } from "@/lib/api";

import type { StudentSubscriptionsResponse } from "@/features/subscriptions/types";

export async function getStudentSubscriptions(
  studentId: number,
): Promise<StudentSubscriptionsResponse> {
  const { data } = await api.get<StudentSubscriptionsResponse>(
    `/students/${studentId}/subscriptions`,
  );

  return data;
}
