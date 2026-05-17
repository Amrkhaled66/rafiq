import { type ReactElement } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

import { AppProviders } from "@/app/providers";
import { authRoutes } from "@/features/admin/auth/routes";
import { coachesRoutes } from "@/features/admin/coaches/routes";
import DashboardHomePage from "@/features/admin/home/pages/DashboardHomePage";
import DashBoardLayout from "@/features/admin/layouts/DashBoardLayout";
import { missedTasksRoutes } from "@/features/admin/missed-tasks/routes";
import { sessionsRoutes } from "@/features/admin/sessions/routes";
import { studentsRoutes } from "@/features/admin/students/routes";
import { subscriptionsRoutes } from "@/features/admin/subscriptions/routes";
import { urls } from "@/shared/const/urls";
import { useAxiosInterceptor } from "@/shared/hooks/useAxiosInterceptor";
import useScrollToTop from "@/shared/hooks/useScrollToTop";

function RouterProvidersLayout(): ReactElement {
  useScrollToTop();
  useAxiosInterceptor();
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}

export const router = createBrowserRouter([
  {
    element: <RouterProvidersLayout />,
    children: [
      {
        path: urls.dashBoardUrl,
        children: [
          authRoutes,
          {
            element: <DashBoardLayout />,
            children: [
              {
                index: true,
                element: <DashboardHomePage />,
              },
              coachesRoutes,
              missedTasksRoutes,
              sessionsRoutes,
              subscriptionsRoutes,
              studentsRoutes,
            ],
          },
        ],
      },
    ],
  },
]);

