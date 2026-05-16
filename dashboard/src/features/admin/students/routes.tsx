import type { RouteObject } from "react-router-dom";
import StudentLessonsPage from "@/features/admin/lessons/pages/StudentLessonsPage";
import StudentPlanDetailsPage from "@/features/admin/plans/pages/StudentPlanDetailsPage";
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
    {
      path: ":id/plans/:planId",
      element: <StudentPlanDetailsPage />,
    },
    {
      path: ":id/plans/:planId/edit",
      element: <NewPlanPage />,
    },
    {
      path: ":id/lessons",
      element: <StudentLessonsPage />,
    },
  ],
};
