import { Redirect } from "expo-router";

import { useAuth } from "@/features/auth/context/AuthProvider";

export default function IndexRoute() {
  const { isReady, token, user } = useAuth();

  if (!isReady) {
    return null;
  }

  return <Redirect href={token && user ? "/home" : "/login"} />;
}
