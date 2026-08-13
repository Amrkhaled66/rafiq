import type { RouteObject } from "react-router-dom";

import ExpiringSubscriptionsPage from "@/features/admin/expiring-subscriptions/pages/ExpiringSubscriptionsPage";
import RequirePermission from "@/shared/routes/RequirePermission";

export const expiringSubscriptionsRoutes: RouteObject = {
  path: "expiring-subscriptions",
  element: <RequirePermission resource="expiring_subscriptions" action="read" />,
  children: [
    {
      index: true,
      element: <ExpiringSubscriptionsPage />,
    },
  ],
};
