import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import {
  EXPIRING_SUBSCRIPTION_DAY_WINDOWS,
  type ExpiringSubscriptionDays,
} from "@/features/admin/expiring-subscriptions/services/expiringSubscriptionsService";

function isExpiringSubscriptionDays(
  value: number,
): value is ExpiringSubscriptionDays {
  return EXPIRING_SUBSCRIPTION_DAY_WINDOWS.some((days) => days === value);
}

export default function useExpiringSubscriptionsFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawDays = Number(searchParams.get("days"));
  const days = isExpiringSubscriptionDays(rawDays) ? rawDays : 7;

  const setDays = useCallback(
    (next: ExpiringSubscriptionDays) => {
      setSearchParams(
        (previous) => {
          const params = new URLSearchParams(previous);
          params.set("days", String(next));
          params.set("page", "1");
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { days, setDays };
}
