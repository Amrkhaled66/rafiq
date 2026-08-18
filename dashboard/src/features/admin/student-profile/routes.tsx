import type { RouteObject } from "react-router-dom";
import StudentProfilePage from "./pages/StudentProfilePage";
import StudentProfileSearchPage from "./pages/StudentProfileSearchPage";

export const studentProfileRoutes: RouteObject = {
  path: "student-profile",
  children: [
    {
      index: true,
      element: <StudentProfileSearchPage />,
    },
    {
      path: ":id",
      element: <StudentProfilePage />,
    },
  ],
};
