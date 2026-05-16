import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createStudent,
  listStudentCoaches,
  assignCoachToStudent,
  removeCoachFromStudent,
  getStudentOverview,
  listStudents,
  updateStudent,
  type ListStudentsParams,
} from "@/features/admin/students/services/studentService";
import type { UpdateStudentFormValues } from "@/features/admin/students/schema/updateStudentSchema";

export const studentsQueryKey = ["admin-students"] as const;
export const studentOverviewQueryKey = ["admin-student-overview"] as const;
export const studentCoachesQueryKey = ["admin-student-coaches"] as const;

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

export function useStudentCoachesQuery(id: number) {
  return useQuery({
    queryKey: [...studentCoachesQueryKey, id],
    queryFn: () => listStudentCoaches(id),
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

export function useAssignCoachToStudentMutation(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coachId: number) => assignCoachToStudent(studentId, coachId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...studentOverviewQueryKey, studentId],
        }),
        queryClient.invalidateQueries({
          queryKey: [...studentCoachesQueryKey, studentId],
        }),
      ]);
    },
  });
}

export function useRemoveCoachFromStudentMutation(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (coachId: number) => removeCoachFromStudent(studentId, coachId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...studentOverviewQueryKey, studentId],
        }),
        queryClient.invalidateQueries({
          queryKey: [...studentCoachesQueryKey, studentId],
        }),
      ]);
    },
  });
}
