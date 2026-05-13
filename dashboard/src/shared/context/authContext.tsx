import { createContext, useContext, useState, type ReactNode } from "react";
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
  const updateUser = (user: IUser) => {
    setAuthData((prev) => ({ ...prev, user }));
    setUser(user);
  };

  const login = (user: IUser, token: string) => {
    console.log("logging")
    setAuthData({ user, token });
    setToken(token);
    setUser(user);
  };
  const logout = () => {
    setAuthData({ user: null, token: null });
    clearToken();
    clearUser();
  };
  const isAuthenticated = !!authData.token && !!authData.user;

  const contextValue = {
    authData,
    login,
    logout,
    isAuthenticated,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
