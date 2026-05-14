import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCoach,
  getCoach,
  listCoaches,
  type ListCoachesParams,
} from "@/features/admin/coaches/services/coachService";

export const coachesQueryKey = ["admin-coaches"] as const;
export const coachProfileQueryKey = ["admin-coach-profile"] as const;

export function useCoachesQuery(params: ListCoachesParams = {}) {
  return useQuery({
    queryKey: [...coachesQueryKey, params],
    queryFn: () => listCoaches(params),
  });
}

export function useCoachProfileQuery(id: number) {
  return useQuery({
    queryKey: [...coachProfileQueryKey, id],
    queryFn: () => getCoach(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateCoachMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCoach,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: coachesQueryKey,
      });
    },
  });
}
