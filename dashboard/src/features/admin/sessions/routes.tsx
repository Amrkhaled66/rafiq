import type { RouteObject } from "react-router-dom";
import SessionsPage from "./pages/SessionsPage";

export const sessionsRoutes: RouteObject = {
  path: "sessions",
  children: [
    {
      index: true,
      element: <SessionsPage />,
    },
  ],
};
