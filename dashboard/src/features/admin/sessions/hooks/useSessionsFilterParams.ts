import useUrlFilterDraft from "@/features/admin/shared/hooks/useUrlFilterDraft";
import { isSessionStatus } from "@/features/admin/sessions/constants/sessionStatus";
import type { SessionStatus } from "@/features/admin/sessions/services/sessionService";

export type SessionsFiltersState = {
  status: "" | SessionStatus;
  studentPhone: string;
  from: string;
  to: string;
};

const DEFAULT_FILTERS: SessionsFiltersState = {
  status: "",
  studentPhone: "",
  from: "",
  to: "",
};

function sanitizeFilters(filters: SessionsFiltersState) {
  return {
    ...filters,
    status: isSessionStatus(filters.status) ? filters.status : "",
  } as SessionsFiltersState;
}

export default function useSessionsFilterParams() {
  return useUrlFilterDraft(DEFAULT_FILTERS, sanitizeFilters);
}
