import type { RouteObject } from "react-router-dom";

import DailyTaskProgressPage from "@/features/admin/daily-task-progress/pages/DailyTaskProgressPage";

export const dailyTaskProgressRoutes: RouteObject = {
  path: "daily-task-progress",
  children: [
    {
      index: true,
      element: <DailyTaskProgressPage />,
    },
  ],
};
