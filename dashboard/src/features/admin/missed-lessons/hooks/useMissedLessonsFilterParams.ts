import useUrlFilterDraft from "@/features/admin/shared/hooks/useUrlFilterDraft";

export type MissedLessonsFiltersState = {
  from: string;
  to: string;
  status: "" | "resolved" | "unresolved";
  watchStatus: "" | "unwatched" | "watched_late";
  coachId: string;
  studentPhone: string;
};

const DEFAULT_FILTERS: MissedLessonsFiltersState = {
  from: "",
  to: "",
  status: "",
  watchStatus: "",
  coachId: "",
  studentPhone: "",
};

function sanitizeFilters(filters: MissedLessonsFiltersState) {
  return {
    ...filters,
    status:
      filters.status === "resolved" || filters.status === "unresolved"
        ? filters.status
        : "",
    watchStatus:
      filters.watchStatus === "unwatched" ||
      filters.watchStatus === "watched_late"
        ? filters.watchStatus
        : "",
  } as MissedLessonsFiltersState;
}

export default function useMissedLessonsFilterParams() {
  return useUrlFilterDraft(DEFAULT_FILTERS, sanitizeFilters);
}
