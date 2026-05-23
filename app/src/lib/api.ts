import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.6:3000";

export const api = axios.create({
  baseURL,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
