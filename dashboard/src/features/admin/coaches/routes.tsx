import type { RouteObject } from "react-router-dom";
import CoachPage from "./pages/CoachPage";
import CoachesPage from "./pages/CoachesPage";
import RequirePermission from "@/shared/routes/RequirePermission";

export const coachesRoutes: RouteObject = {
  path: "coaches",
  element: <RequirePermission resource="coaches" action="read" />,
  children: [
    {
      index: true,
      element: <CoachesPage />,
    },
    {
      path: ":id",
      element: <CoachPage />,
    },
  ],
};
