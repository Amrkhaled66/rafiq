import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { getToken } from "@/shared/utils/authStorage";
import { useAuth } from "@/shared/context/authContext";

export function useAxiosInterceptor() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = getToken();

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
        if (error?.response?.status === 401 && isAuthenticated) {
          logout();
          navigate("/", { replace: true });

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
  }, [logout, navigate, isAuthenticated]);
}
