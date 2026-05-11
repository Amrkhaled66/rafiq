import type { RouteObject } from "react-router-dom";
import StudentAddPlanPage from "./pages/StudentAddPlanPage";
import StudentPage from "./pages/StudentPage";
import StudentPlanPage from "./pages/StudentPlanPage";
import StudentPlansPage from "./pages/StudentPlansPage";
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
      element: <StudentAddPlanPage />,
    },
    {
      path: ":id/plans/:planId",
      element: <StudentPlanPage />,
    },
  ],
};
