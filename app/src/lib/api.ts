import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.5:5555";

export const api = axios.create({
  baseURL,
});

export default api;
