import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export default function useMissedTasksFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawStatus = (searchParams.get("status") ?? "").trim();
  const status: "" | "resolved" | "unresolved" =
    rawStatus === "resolved" || rawStatus === "unresolved" ? rawStatus : "";

  const from = (searchParams.get("from") ?? "").trim();
  const to = (searchParams.get("to") ?? "").trim();
  const coachId = (searchParams.get("coachId") ?? "").trim();
  const studentPhone = (searchParams.get("studentPhone") ?? "").trim();

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
    (next: "" | "resolved" | "unresolved") => updateParam("status", next),
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

  const setCoachId = useCallback(
    (next: string) => updateParam("coachId", next),
    [updateParam],
  );

  const setStudentPhone = useCallback(
    (next: string) => updateParam("studentPhone", next.trim()),
    [updateParam],
  );

  return {
    status,
    from,
    to,
    coachId,
    studentPhone,
    setStatus,
    setFrom,
    setTo,
    setCoachId,
    setStudentPhone,
  };
}
