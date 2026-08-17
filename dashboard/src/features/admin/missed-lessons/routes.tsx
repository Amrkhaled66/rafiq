import type { RouteObject } from "react-router-dom";
import MissedLessonsPage from "./pages/MissedLessonsPage";

export const missedLessonsRoutes: RouteObject = {
  path: "missed-lessons",
  element: <MissedLessonsPage />,
};
