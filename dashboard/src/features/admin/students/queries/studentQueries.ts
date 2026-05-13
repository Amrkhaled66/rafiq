import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createStudent,
  getStudentOverview,
  listStudents,
  type ListStudentsParams,
} from "@/features/admin/students/services/studentService";

export const studentsQueryKey = ["admin-students"] as const;
export const studentOverviewQueryKey = ["admin-student-overview"] as const;

export function useStudentsQuery(params: ListStudentsParams = {}) {
  return useQuery({
    queryKey: [...studentsQueryKey, params],
    queryFn: () => listStudents(params),
  });
}

export function useStudentOverviewQuery(id: number) {
  return useQuery({
    queryKey: [...studentOverviewQueryKey, id],
    queryFn: () => getStudentOverview(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentsQueryKey,
      });
    },
  });
}
