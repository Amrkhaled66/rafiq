import React, {
  PropsWithChildren,
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as authStorage from "@/features/auth/storage/authStorage";
import type { AuthUser } from "@/features/auth/types";
import { router } from "expo-router";
import { setAccessToken, setUnauthorizedHandler } from "@/lib/api";
type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  login: (user: AuthUser, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isHandlingUnauthorizedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function restoreAuth() {
      try {
        const [savedToken, savedUserJson] = await Promise.all([
          authStorage.getToken(),
          authStorage.getUser(),
        ]);

        if (!isMounted) {
          return;
        }

        setToken(savedToken);
        setAccessToken(savedToken);

        if (savedUserJson) {
          try {
            setUser(JSON.parse(savedUserJson));
          } catch {
            setUser(null);
          }
        }
      } catch {
        if (isMounted) {
          setToken(null);
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    void restoreAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setAccessToken(token);
  }, [token]);

  const login = useCallback(async (nextUser: AuthUser, nextToken: string) => {
    await authStorage.setToken(nextToken);
    await authStorage.setUser(JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await authStorage.clearToken();
    await authStorage.clearUser();
    setToken(null);
    setUser(null);
    router.push("/login");
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      if (isHandlingUnauthorizedRef.current) {
        return;
      }

      isHandlingUnauthorizedRef.current = true;

      try {
        await logout();
      } finally {
        isHandlingUnauthorizedRef.current = false;
      }
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  const contextValue = useMemo(
    () => ({ user, token, isReady, login, logout }),
    [user, token, isReady, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
