import { getItem, setItem, removeItem } from "./localStorage";

const setUser = (user: any) => setItem("user", user);
const setToken = (token: string) => setItem("token", token);
const clearToken = () => removeItem("token");
const clearUser = () => removeItem("user");
const getToken = (): string | null => getItem("token");
const getUser = (): any | null => getItem("user");
const isAuth = !!getToken();


// const isAdmin = !!getAdminToken();

export {
  setUser,
  setToken,
  clearToken,
  clearUser,
  getToken,
  getUser,
  isAuth,
};
