import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type StringRecord<T> = { [K in keyof T]: string };

export default function useUrlFilterDraft<T extends StringRecord<T>>(
  defaults: T,
  sanitize: (filters: T) => T,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const keys = useMemo(() => Object.keys(defaults) as Array<keyof T>, [defaults]);

  const appliedFilters = useMemo(() => {
    const values = { ...defaults };
    for (const key of keys) {
      values[key] = (
        searchParams.get(String(key)) ?? defaults[key]
      ).trim() as T[typeof key];
    }
    return sanitize(values);
  }, [defaults, keys, sanitize, searchParams]);

  const appliedKey = JSON.stringify(appliedFilters);
  const [draftState, setDraftState] = useState({
    sourceKey: appliedKey,
    values: appliedFilters,
  });
  const draftFilters =
    draftState.sourceKey === appliedKey ? draftState.values : appliedFilters;

  const writeFilters = useCallback(
    (nextFilters: T) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          for (const key of keys) {
            const value = nextFilters[key].trim();
            if (value) next.set(String(key), value);
            else next.delete(String(key));
          }
          next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [keys, setSearchParams],
  );

  const setDraftFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setDraftState((previous) => {
        const current =
          previous.sourceKey === appliedKey ? previous.values : appliedFilters;
        return {
          sourceKey: appliedKey,
          values: { ...current, [key]: value },
        };
      });
    },
    [appliedFilters, appliedKey],
  );

  const applyFilters = useCallback(() => {
    writeFilters(sanitize(draftFilters));
  }, [draftFilters, sanitize, writeFilters]);

  const resetFilters = useCallback(() => {
    setDraftState({ sourceKey: appliedKey, values: defaults });
    writeFilters(defaults);
  }, [appliedKey, defaults, writeFilters]);

  return {
    appliedFilters,
    draftFilters,
    setDraftFilter,
    applyFilters,
    resetFilters,
    hasChanges: JSON.stringify(draftFilters) !== appliedKey,
    hasFilters:
      keys.some((key) => Boolean(draftFilters[key])) ||
      keys.some((key) => Boolean(appliedFilters[key])),
  };
}
