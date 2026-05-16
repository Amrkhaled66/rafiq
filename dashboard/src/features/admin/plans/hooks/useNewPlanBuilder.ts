import { useCallback, useMemo, useReducer } from "react";

import { makeId } from "@/features/admin/plans/components/NewPlanPage/id";
import type {
  PlanDay,
  PlanTask,
} from "@/features/admin/plans/components/NewPlanPage/types";
import { formatDateLocal } from "@/shared/utils/dates";

type State = {
  name: string;
  fromDate: string;
  toDate: string;
  coachId: number | null;
  days: PlanDay[];
  visibleDaysCount: number;
};

type Action =
  | { type: "set_name"; value: string }
  | { type: "set_from"; value: string }
  | { type: "set_to"; value: string }
  | { type: "set_coach_id"; value: number | null }
  | {
      type: "load_plan";
      payload: {
        name: string;
        fromDate: string;
        toDate: string;
        coachId: number | null;
        days: PlanDay[];
      };
    }
  | { type: "reveal_next_day" }
  | { type: "update_task"; dayDate: string; taskId: string; patch: Partial<PlanTask> }
  | { type: "add_task"; dayDate: string }
  | { type: "delete_task"; dayDate: string; taskId: string };

const initialState: State = {
  name: "",
  fromDate: "",
  toDate: "",
  coachId: null,
  days: [],
  visibleDaysCount: 0,
};

function buildDays(fromDate: string, toDate: string): Pick<State, "days" | "visibleDaysCount"> {
  if (!fromDate || !toDate) {
    return { days: [], visibleDaysCount: 0 };
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);
  if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime())) {
    return { days: [], visibleDaysCount: 0 };
  }

  if (to < from) {
    return { days: [], visibleDaysCount: 0 };
  }

  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  const nextDays: PlanDay[] = [];
  while (cursor <= end) {
    const iso = formatDateLocal(cursor);
    nextDays.push({
      date: iso,
      // Start with no tasks; user adds tasks explicitly.
      tasks: [],
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return { days: nextDays, visibleDaysCount: nextDays.length > 0 ? 1 : 0 };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set_name": {
      return { ...state, name: action.value };
    }
    case "set_from": {
      const fromDate = action.value;
      const { days, visibleDaysCount } = buildDays(fromDate, state.toDate);
      return { ...state, fromDate, days, visibleDaysCount };
    }
    case "set_to": {
      const toDate = action.value;
      const { days, visibleDaysCount } = buildDays(state.fromDate, toDate);
      return { ...state, toDate, days, visibleDaysCount };
    }
    case "set_coach_id": {
      return { ...state, coachId: action.value };
    }
    case "load_plan": {
      return {
        ...state,
        name: action.payload.name,
        fromDate: action.payload.fromDate,
        toDate: action.payload.toDate,
        coachId: action.payload.coachId,
        days: action.payload.days,
        visibleDaysCount: action.payload.days.length,
      };
    }
    case "reveal_next_day": {
      if (state.visibleDaysCount >= state.days.length) return state;
      return { ...state, visibleDaysCount: Math.min(state.days.length, state.visibleDaysCount + 1) };
    }
    case "update_task": {
      const { dayDate, taskId, patch } = action;
      return {
        ...state,
        days: state.days.map((d) => {
          if (d.date !== dayDate) return d;
          return {
            ...d,
            tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
          };
        }),
      };
    }
    case "add_task": {
      const { dayDate } = action;
      return {
        ...state,
        days: state.days.map((d) => {
          if (d.date !== dayDate) return d;
          return {
            ...d,
            tasks: [...d.tasks, { id: makeId(), title: "", subject: "" }],
          };
        }),
      };
    }
    case "delete_task": {
      const { dayDate, taskId } = action;
      return {
        ...state,
        days: state.days.map((d) => {
          if (d.date !== dayDate) return d;
          const nextTasks = d.tasks.filter((t) => t.id !== taskId);
          return {
            ...d,
            tasks: nextTasks,
          };
        }),
      };
    }
    default: {
      return state;
    }
  }
}

export default function useNewPlanBuilder() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const durationDays = useMemo(() => {
    if (!state.fromDate || !state.toDate) return 0;

    const from = new Date(state.fromDate);
    const to = new Date(state.toDate);
    if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime())) {
      return 0;
    }
    if (to < from) return 0;

    const diffTime = to.getTime() - from.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [state.fromDate, state.toDate]);

  const setName = useCallback((value: string) => dispatch({ type: "set_name", value }), []);
  const setFromDate = useCallback((value: string) => dispatch({ type: "set_from", value }), []);
  const setToDate = useCallback((value: string) => dispatch({ type: "set_to", value }), []);
  const setCoachId = useCallback(
    (value: number | null) => dispatch({ type: "set_coach_id", value }),
    [],
  );
  const loadPlan = useCallback(
    (payload: {
      name: string;
      fromDate: string;
      toDate: string;
      coachId: number | null;
      days: PlanDay[];
    }) => dispatch({ type: "load_plan", payload }),
    [],
  );
  const revealNextDay = useCallback(() => dispatch({ type: "reveal_next_day" }), []);

  const updateTask = useCallback(
    (dayDate: string, taskId: string, patch: Partial<PlanTask>) =>
      dispatch({ type: "update_task", dayDate, taskId, patch }),
    [],
  );

  const addTask = useCallback((dayDate: string) => dispatch({ type: "add_task", dayDate }), []);

  const deleteTask = useCallback(
    (dayDate: string, taskId: string) => dispatch({ type: "delete_task", dayDate, taskId }),
    [],
  );

  return {
    ...state,
    durationDays,
    actions: {
      setName,
      setFromDate,
      setToDate,
      setCoachId,
      loadPlan,
      revealNextDay,
      updateTask,
      addTask,
      deleteTask,
    },
  };
}
