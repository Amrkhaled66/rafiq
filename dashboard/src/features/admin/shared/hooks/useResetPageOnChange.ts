import { useEffect } from "react";

export default function useResetPageOnChange(
  setPage: (page: number) => void,
  deps: readonly unknown[],
) {
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

