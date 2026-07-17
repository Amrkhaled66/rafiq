import { create } from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.8:5555";

let accessToken: string | null = null;
let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const setUnauthorizedHandler = (
  handler: (() => void | Promise<void>) | null,
) => {
  unauthorizedHandler = handler;
};

export const api = create({
  baseURL,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await unauthorizedHandler?.();
    }

    return Promise.reject(error);
  },
);

export default api;
