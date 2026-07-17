import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { isSessionStatus } from "@/features/admin/sessions/constants/sessionStatus";
import type { SessionStatus } from "@/features/admin/sessions/services/sessionService";

export default function useSessionsFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawStatus = (searchParams.get("status") ?? "").trim();
  const status: "" | SessionStatus = isSessionStatus(rawStatus)
    ? rawStatus
    : "";

  const studentPhone = (searchParams.get("studentPhone") ?? "").trim();
  const from = (searchParams.get("from") ?? "").trim();
  const to = (searchParams.get("to") ?? "").trim();

  const updateParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setStatus = useCallback(
    (next: "" | SessionStatus) => updateParam("status", next),
    [updateParam],
  );

  const setStudentPhone = useCallback(
    (next: string) => updateParam("studentPhone", next.trim()),
    [updateParam],
  );

  const setFrom = useCallback(
    (next: string) => updateParam("from", next),
    [updateParam],
  );

  const setTo = useCallback(
    (next: string) => updateParam("to", next),
    [updateParam],
  );

  return {
    status,
    studentPhone,
    from,
    to,
    setStatus,
    setStudentPhone,
    setFrom,
    setTo,
  };
}
