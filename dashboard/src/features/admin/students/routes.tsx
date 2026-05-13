import type { RouteObject } from "react-router-dom";
import StudentPage from "./pages/StudentPage";
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
 
  ],
};
