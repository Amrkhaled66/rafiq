import { useEffect, useRef } from "react";

import { useAuth } from "@/features/auth/context/AuthProvider";
import * as authStorage from "@/features/auth/storage/authStorage";
import { api } from "@/lib/api";

export function useAxiosInterceptor() {
  const { logout, token } = useAuth();
  const isHandlingUnauthorizedRef = useRef(false);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        const storedToken = await authStorage.getToken();

        if (storedToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }

        return config;
      },
      async (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error?.response?.status === 401 &&
          token &&
          !isHandlingUnauthorizedRef.current
        ) {
          isHandlingUnauthorizedRef.current = true;

          try {
            await logout();
          } finally {
            isHandlingUnauthorizedRef.current = false;
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, token]);
}
