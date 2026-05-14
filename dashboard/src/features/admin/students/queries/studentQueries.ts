import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createStudent,
  getStudentOverview,
  listStudents,
  updateStudent,
  type ListStudentsParams,
} from "@/features/admin/students/services/studentService";
import type { UpdateStudentFormValues } from "@/features/admin/students/schema/updateStudentSchema";

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

export function useUpdateStudentMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UpdateStudentFormValues) => updateStudent(id, values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: studentsQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: [...studentOverviewQueryKey, id],
        }),
      ]);
    },
  });
}
