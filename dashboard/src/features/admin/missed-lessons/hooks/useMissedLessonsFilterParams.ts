import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export default function useMissedLessonsFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const resolutionValue = searchParams.get("status") ?? "";
  const watchValue = searchParams.get("watchStatus") ?? "";
  const status =
    resolutionValue === "resolved" || resolutionValue === "unresolved"
      ? resolutionValue
      : "";
  const watchStatus =
    watchValue === "unwatched" || watchValue === "watched_late"
      ? watchValue
      : "";

  const setParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return {
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
    coachId: searchParams.get("coachId") ?? "",
    status: status as "" | "resolved" | "unresolved",
    watchStatus: watchStatus as "" | "unwatched" | "watched_late",
    setFrom: (value: string) => setParam("from", value),
    setTo: (value: string) => setParam("to", value),
    setCoachId: (value: string) => setParam("coachId", value),
    setStatus: (value: string) => setParam("status", value),
    setWatchStatus: (value: string) => setParam("watchStatus", value),
  };
}
