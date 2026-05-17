import type { ReactElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { urls } from "@/shared/const/urls";
import { useAuth } from "@/shared/context/authContext";
import { can } from "@/shared/auth/can";

export default function RequireAdminAuth(): ReactElement {
  const { authData, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/${urls.dashBoardUrl}/signin`}
        replace
        state={{ from: location }}
      />
    );
  }

  if (!can(authData.user, "admin_dashboard", "read")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
