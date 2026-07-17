import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export type UrlPaginationState = {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number, page: number) => void;
};

export default function useUrlPagination(
  options: {
    pageKey?: string;
    limitKey?: string;
    defaults?: { page?: number; limit?: number };
  } = {},
): UrlPaginationState {
  const { pageKey = "page", limitKey = "limit", defaults = {} } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string, fallback: number): number => {
    const raw = searchParams.get(key);
    const num = raw ? parseInt(raw, 10) : NaN;
    return Number.isNaN(num) || num < 1 ? fallback : num;
  };

  const page = getParam(pageKey, defaults.page ?? 1);
  const limit = getParam(limitKey, defaults.limit ?? 10);

  const setPage = useCallback(
    (next: number) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.set(pageKey, String(next));
          return p;
        },
        { replace: true },
      );
    },
    [pageKey, setSearchParams],
  );

  const setLimit = useCallback(
    (next: number) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.set(limitKey, String(next));
          return p;
        },
        { replace: true },
      );
    },
    [limitKey, setSearchParams],
  );

  const onChangeRowsPerPage = useCallback(
    (nextLimit: number, nextPage: number) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.set(limitKey, String(nextLimit));
          p.set(pageKey, String(nextPage));
          return p;
        },
        { replace: true },
      );
    },
    [pageKey, limitKey, setSearchParams],
  );

  return { page, limit, setPage, setLimit, onChangeRowsPerPage };
}
