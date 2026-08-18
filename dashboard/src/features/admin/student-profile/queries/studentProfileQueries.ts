import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getStudentProfile,
  searchStudentByPhone,
} from "@/features/admin/student-profile/services/studentProfileService";

export const studentProfileQueryKey = ["admin-student-profile"] as const;

export function useStudentProfileQuery(id: number) {
  return useQuery({
    queryKey: [...studentProfileQueryKey, id],
    queryFn: () => getStudentProfile(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useSearchStudentByPhoneMutation() {
  return useMutation({
    mutationFn: searchStudentByPhone,
  });
}
