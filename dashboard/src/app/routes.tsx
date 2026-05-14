import { type ReactElement } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { coachesRoutes } from "@/features/admin/coaches/routes";
import { studentsRoutes } from "@/features/admin/students/routes";
import DashBoardLayout from "@/features/admin/layouts/DashBoardLayout";
import { AppProviders } from "@/app/providers";
import { authRoutes } from "@/features/admin/auth/routes";
import useScrollToTop from "@/shared/hooks/useScrollToTop";
import { urls } from "@/shared/const/urls";
import { useAxiosInterceptor } from "@/shared/hooks/useAxiosInterceptor";
function RouterProvidersLayout(): ReactElement {
  useScrollToTop();
  useAxiosInterceptor();
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}

function PageShell({
  title,
  description,
}: {
  title: string;
  description: string;
}): ReactElement {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(23,23,23,0.06)]">
      <h1 className="text-foreground min-h-screen text-2xl font-bold">
        {title}
      </h1>

      <p className="text-subTitle mt-2 text-sm">{description}</p>
    </section>
  );
}

const dashboardPage = (
  <section className="space-y-6">
    <PageShell
      title="الرئيسية"
      description="نظرة عامة سريعة على بيانات المنصة وآخر التحديثات."
    />
  </section>
);

export const router = createBrowserRouter([
  {
    element: <RouterProvidersLayout />,
    children: [
      // -- Dashboard Routes --
      {
        path: urls.dashBoardUrl,
        children: [
          authRoutes,
          {
            element: <DashBoardLayout />,
            children: [
              {
                index: true,
                element: dashboardPage,
              },
              coachesRoutes,
              studentsRoutes,
            ],
          },
        ],
      },
    ],
  },
]);
