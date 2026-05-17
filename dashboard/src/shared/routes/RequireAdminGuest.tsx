import type { ReactElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { urls } from "@/shared/const/urls";
import { useAuth } from "@/shared/context/authContext";
import { can } from "@/shared/auth/can";

export default function RequireAdminGuest(): ReactElement {
  const { authData, isAuthenticated } = useAuth();
  const location = useLocation();

  const isAdmin = can(authData.user, "admin_dashboard", "read");

  if (isAuthenticated && isAdmin) {
    const from = (location.state as any)?.from;
    const to =
      from?.pathname
        ? `${from.pathname ?? ""}${from.search ?? ""}`
        : `/${urls.dashBoardUrl}`;

    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
