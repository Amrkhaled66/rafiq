import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/shared/context/authContext";
import { urls } from "@/shared/const/urls";

export function useAxiosInterceptor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated, authData } = useAuth();
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = authData.token;

        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          logout();
          navigate(`/${urls.dashBoardUrl}/signin`, {
            replace: true,
            state: { from: location },
          });

          //   Alert({
          //     title: "Session Expired",
          //     text: "Your session has expired. Please sign in again.",
          //     icon: "warning",
          //     confirmButtonText: "OK",
          //   });
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate, isAuthenticated, location]);
}
