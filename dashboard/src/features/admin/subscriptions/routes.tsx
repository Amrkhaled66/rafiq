import type { RouteObject } from "react-router-dom";

import SubscriptionPackagesPage from "@/features/admin/subscriptions/pages/SubscriptionPackagesPage";
import SubscriptionsPage from "@/features/admin/subscriptions/pages/SubscriptionsPage";

export const subscriptionsRoutes: RouteObject = {
  path: "subscriptions",
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
