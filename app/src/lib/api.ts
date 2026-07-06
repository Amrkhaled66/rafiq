import { create } from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.8:5555";

export const api = create({
  baseURL,
});

export default api;
