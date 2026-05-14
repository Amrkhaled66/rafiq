import type { RouteObject } from "react-router-dom";
import CoachPage from "./pages/CoachPage";
import CoachesPage from "./pages/CoachesPage";

export const coachesRoutes: RouteObject = {
  path: "trainers",
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
