import { type ReactElement } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { studentsRoutes } from "@/features/admin/students/routes";
import DashBoardLayout from "@/layouts/DashBoardLayout";
import { AppProviders } from "@/app/providers";
import useScrollToTop from "@/shared/hooks/useScrollToTop";
function RouterProvidersLayout(): ReactElement {
  useScrollToTop();
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
        path: "/",
        element: <DashBoardLayout />,
        children: [
          {
            index: true,
            element: dashboardPage,
          },
          studentsRoutes,
        ],
      },
    ],
  },
]);
