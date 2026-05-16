import type { RouteObject } from "react-router-dom";
import MissedTasksPage from "./pages/MissedTasksPage";

export const missedTasksRoutes: RouteObject = {
  path: "missed-tasks",
  children: [
    {
      index: true,
      element: <MissedTasksPage />,
    },
  ],
};
