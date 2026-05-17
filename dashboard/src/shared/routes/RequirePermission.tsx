import type { ReactElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { urls } from "@/shared/const/urls";
import { useAuth } from "@/shared/context/authContext";
import { can, type Action, type Resource } from "@/shared/auth/can";

export default function RequirePermission({
  resource,
  action,
}: {
  resource: Resource;
  action: Action;
}): ReactElement {
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

  if (!can(authData.user, resource, action)) {
    return <Navigate to={`/${urls.dashBoardUrl}`} replace />;
  }

  return <Outlet />;
}

