import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { getStudentSubscriptions } from "@/features/subscriptions/services/subscriptionService";

export function useStudentSubscriptions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-subscriptions", user?.id],
    queryFn: () => getStudentSubscriptions(user!.id),
    enabled: Boolean(user?.id),
  });
}
