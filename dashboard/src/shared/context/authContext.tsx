import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setUnauthorizedHandler } from "@/lib/api";
import { urls } from "@/shared/const/urls";
import {
  clearToken,
  getToken,
  setUser,
  clearUser,
  getUser,
  setToken,
} from "@/shared/utils/authStorage";
import type { IUser } from "@/shared/interfaces/User";
type AuthState = {
  user: IUser | null;
  token: string | null;
};

export type AuthContextType = {
  authData: AuthState;
  login: (user: IUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (user: IUser) => void;
};

export const AuthContext = createContext<AuthContextType>({
  authData: { user: null, token: null },
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  updateUser: () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authData, setAuthData] = useState(() => {
    const token = getToken();
    const user = getUser() as IUser | null;
    return {
      user,
      token,
    };
  });
  const updateUser = useCallback((user: IUser) => {
    setAuthData((prev) => ({ ...prev, user }));
    setUser(user);
  }, []);

  const login = useCallback((user: IUser, token: string) => {
    setAuthData({ user, token });
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    clearUser();
    setAuthData({ user: null, token: null });
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();

      const signinPath = `/${urls.dashBoardUrl}/signin`;
      if (window.location.pathname !== signinPath) {
        window.location.assign(signinPath);
      }
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  const isAuthenticated = !!authData.token && !!authData.user;
  const contextValue = useMemo(
    () => ({
      authData,
      login,
      logout,
      isAuthenticated,
      updateUser,
    }),
    [authData, isAuthenticated, login, logout, updateUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
