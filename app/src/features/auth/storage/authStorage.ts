import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "rafiq.token";
const USER_KEY = "rafiq.user";

export async function setToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function setUser(userJson: string) {
  await SecureStore.setItemAsync(USER_KEY, userJson);
}

export async function getUser(): Promise<string | null> {
  return await SecureStore.getItemAsync(USER_KEY);
}

export async function clearUser() {
  await SecureStore.deleteItemAsync(USER_KEY);
}
