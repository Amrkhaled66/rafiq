import { useCallback, useState } from "react";

export type ServerPaginationState = {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  onChangeRowsPerPage: (nextLimit: number, nextPage: number) => void;
};

export default function useServerPagination(
  initial: { page?: number; limit?: number } = {},
): ServerPaginationState {
  const [page, setPage] = useState(initial.page ?? 1);
  const [limit, setLimit] = useState(initial.limit ?? 10);

  const onChangeRowsPerPage = useCallback(
    (nextLimit: number, nextPage: number) => {
      setLimit(nextLimit);
      setPage(nextPage);
    },
    [],
  );

  return {
    page,
    limit,
    setPage,
    setLimit,
    onChangeRowsPerPage,
  };
}

