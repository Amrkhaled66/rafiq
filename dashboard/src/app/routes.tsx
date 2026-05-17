import { type ReactElement } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

import { AppProviders } from "@/app/providers";
import SigninPage from "@/features/admin/auth/SigninPage";
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
import RequireAdminAuth from "@/shared/routes/RequireAdminAuth";
import RequireAdminGuest from "@/shared/routes/RequireAdminGuest";

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
          {
            element: <RequireAdminGuest />,
            children: [
              {
                path: "signin",
                element: <SigninPage />,
              },
            ],
          },
          {
            element: <RequireAdminAuth />,
            children: [
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
    ],
  },
]);
