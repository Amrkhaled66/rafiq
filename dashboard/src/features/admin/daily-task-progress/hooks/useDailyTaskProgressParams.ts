import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import type {
  DailyTaskProgressSort,
  DailyTaskProgressSortOrder,
  DailyTaskProgressStatus,
} from "@/features/admin/daily-task-progress/services/dailyTaskProgressService";

const SORT_FIELDS: DailyTaskProgressSort[] = [
  "studentName",
  "totalTasks",
  "completedTasks",
  "missedTasks",
];

function getCairoDateString() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Africa/Cairo",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function addIsoDateDays(value: string, amount: number) {
  const date = new Date(`${value}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function getLatestDailyProgressDate() {
  return addIsoDateDays(getCairoDateString(), -1);
}

export default function useDailyTaskProgressParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const todayDate = getCairoDateString();
  const defaultDate = getLatestDailyProgressDate();
  const rawDate = searchParams.get("date") ?? defaultDate;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) && rawDate <= todayDate
    ? rawDate
    : defaultDate;
  const isToday = date === todayDate;
  const requestedStatus: DailyTaskProgressStatus =
    searchParams.get("status") === "finished" ? "finished" : "unfinished";
  const status: DailyTaskProgressStatus = isToday
    ? "finished"
    : requestedStatus;
  const defaultSortBy: DailyTaskProgressSort =
    status === "finished" ? "studentName" : "missedTasks";
  const rawSortBy = searchParams.get("sortBy");
  const sortBy = SORT_FIELDS.includes(rawSortBy as DailyTaskProgressSort)
    ? (rawSortBy as DailyTaskProgressSort)
    : defaultSortBy;
  const defaultSortOrder: DailyTaskProgressSortOrder =
    status === "finished" ? "asc" : "desc";
  const sortOrder: DailyTaskProgressSortOrder =
    searchParams.get("sortOrder") === "asc"
      ? "asc"
      : searchParams.get("sortOrder") === "desc"
        ? "desc"
        : defaultSortOrder;

  const updateParams = useCallback(
    (updates: Record<string, string>, resetPage = true) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          Object.entries(updates).forEach(([key, value]) => next.set(key, value));
          if (resetPage) next.set("page", "1");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setDate = useCallback(
    (nextDate: string) => {
      if (nextDate === todayDate) {
        updateParams({
          date: nextDate,
          status: "finished",
          sortBy: "studentName",
          sortOrder: "asc",
        });
        return;
      }

      updateParams({ date: nextDate });
    },
    [todayDate, updateParams],
  );

  const setStatus = useCallback(
    (nextStatus: DailyTaskProgressStatus) => {
      if (isToday && nextStatus === "unfinished") return;

      updateParams({
        status: nextStatus,
        sortBy: nextStatus === "finished" ? "studentName" : "missedTasks",
        sortOrder: nextStatus === "finished" ? "asc" : "desc",
      });
    },
    [isToday, updateParams],
  );

  const setSort = useCallback(
    (nextSortBy: DailyTaskProgressSort, nextOrder: DailyTaskProgressSortOrder) =>
      updateParams({ sortBy: nextSortBy, sortOrder: nextOrder }),
    [updateParams],
  );

  return {
    date,
    maxDate: todayDate,
    isToday,
    status,
    sortBy,
    sortOrder,
    setDate,
    setStatus,
    setSort,
  };
}
