import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCoach,
  getCoachOverview,
  listCoaches,
  listCoachPlans,
  type ListCoachPlansParams,
  type ListCoachesParams,
} from "@/features/admin/coaches/services/coachService";

export const coachesQueryKey = ["admin-coaches"] as const;
export const coachOverviewQueryKey = ["admin-coach-overview"] as const;
export const coachPlansQueryKey = ["admin-coach-plans"] as const;

export function useCoachesQuery(params: ListCoachesParams = {}) {
  return useQuery({
    queryKey: [...coachesQueryKey, params],
    queryFn: () => listCoaches(params),
  });
}

export function useCoachOverviewQuery(id: number) {
  return useQuery({
    queryKey: [...coachOverviewQueryKey, id],
    queryFn: () => getCoachOverview(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCoachPlansQuery(
  id: number,
  params: ListCoachPlansParams = {},
) {
  return useQuery({
    queryKey: [...coachPlansQueryKey, id, params],
    queryFn: () => listCoachPlans(id, params),
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
