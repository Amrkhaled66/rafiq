import type { RouteObject } from "react-router-dom";
import StudentPage from "./pages/StudentPage";
import StudentPlansPage from "@/features/admin/plans/pages/StudentPlansPage";
import NewPlanPage from "@/features/admin/plans/pages/NewPlanPage";
import StudentsPage from "./pages/StudentsPage";

export const studentsRoutes: RouteObject = {
  path: "students",
  children: [
    {
      index: true,
      element: <StudentsPage />,
    },
    {
      path: ":id",
      element: <StudentPage />,
    },
    {
      path: ":id/plans",
      element: <StudentPlansPage />,
    },
    {
      path: ":id/plans/new",
      element: <NewPlanPage />,
    },
  ],
};
