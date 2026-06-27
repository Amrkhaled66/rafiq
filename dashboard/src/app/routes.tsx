import { type ReactElement } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

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
import useScrollToTop from "@/shared/hooks/useScrollToTop";
import RequireAdminAuth from "@/shared/routes/RequireAdminAuth";
import RequireAdminGuest from "@/shared/routes/RequireAdminGuest";
import { useAuth } from "@/shared/context/authContext";

function RouterProvidersLayout(): ReactElement {
  useScrollToTop();
  

  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}

function DashboardIndexRedirect(): ReactElement {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Navigate to="home" replace />
  ) : (
    <Navigate to="signin" replace />
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
            index: true,
            element: <DashboardIndexRedirect />,
          },

          {
            element: <RequireAdminGuest />,
            children: [
              authRoutes,
            ],
          },

          {
            element: <RequireAdminAuth />,
            children: [
              {
                element: <DashBoardLayout />,
                children: [
                  {
                    path: "home",
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

      {
        path: "*",
        element: <Navigate to={urls.dashBoardUrl} replace />,
      },
    ],
  },
]);