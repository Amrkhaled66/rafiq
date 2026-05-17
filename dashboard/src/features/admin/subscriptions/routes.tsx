import type { RouteObject } from "react-router-dom";

import SubscriptionPackagesPage from "@/features/admin/subscriptions/pages/SubscriptionPackagesPage";
import SubscriptionsPage from "@/features/admin/subscriptions/pages/SubscriptionsPage";
import RequirePermission from "@/shared/routes/RequirePermission";

export const subscriptionsRoutes: RouteObject = {
  path: "subscriptions",
  element: <RequirePermission resource="subscriptions" action="read" />,
  children: [
    {
      index: true,
      element: <SubscriptionsPage />,
    },
    {
      path: "packages",
      element: <SubscriptionPackagesPage />,
    },
  ],
};
