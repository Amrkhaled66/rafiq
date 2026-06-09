import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { getStudentHome } from "@/features/home/services/homeService";

export function useStudentHome() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["student-home", user?.id],
    queryFn: () => getStudentHome(user!.id),
    enabled: Boolean(user?.id),
  });
}
