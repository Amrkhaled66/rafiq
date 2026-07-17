import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { AppState } from "react-native";

type UseTaskSessionReconciliationInput = {
  refetchTaskDetail: () => Promise<unknown>;
};

export function useTaskSessionReconciliation({
  refetchTaskDetail,
}: UseTaskSessionReconciliationInput) {
  useFocusEffect(
    useCallback(() => {
      void refetchTaskDetail();
    }, [refetchTaskDetail]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void refetchTaskDetail();
      }
    });

    return () => subscription.remove();
  }, [refetchTaskDetail]);
}
