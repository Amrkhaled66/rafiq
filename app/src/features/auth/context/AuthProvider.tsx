import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { setAuthToken } from "@/lib/api";
import * as authStorage from "@/features/auth/storage/authStorage";
import type { AuthUser } from "@/features/auth/types";
import { router } from "expo-router";
type AuthState = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const savedToken = await authStorage.getToken();
      const savedUserJson = await authStorage.getUser();
      if (savedToken) {
        setAuthToken(savedToken);
        setToken(savedToken);
      }
      if (savedUserJson) {
        try {
          setUser(JSON.parse(savedUserJson));
        } catch {
          setUser(null);
        }
      }
    })();
  }, []);

  async function login(nextUser: AuthUser, nextToken: string) {
    await authStorage.setToken(nextToken);
    await authStorage.setUser(JSON.stringify(nextUser));
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }

  async function logout() {
    await authStorage.clearToken();
    await authStorage.clearUser();
    setAuthToken(null);
    setToken(null);
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
