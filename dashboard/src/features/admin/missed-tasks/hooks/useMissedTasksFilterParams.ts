import useUrlFilterDraft from "@/features/admin/shared/hooks/useUrlFilterDraft";

export type MissedTasksFiltersState = {
  status: "" | "resolved" | "unresolved";
  from: string;
  to: string;
  coachId: string;
  studentPhone: string;
};

const DEFAULT_FILTERS: MissedTasksFiltersState = {
  status: "",
  from: "",
  to: "",
  coachId: "",
  studentPhone: "",
};

function sanitizeFilters(filters: MissedTasksFiltersState) {
  return {
    ...filters,
    status:
      filters.status === "resolved" || filters.status === "unresolved"
        ? filters.status
        : "",
  } as MissedTasksFiltersState;
}

export default function useMissedTasksFilterParams() {
  return useUrlFilterDraft(DEFAULT_FILTERS, sanitizeFilters);
}
