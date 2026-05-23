import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

import { RafiqLogoMark } from "@/shared/ui/RafiqLogoMark";

export function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-brand-primary px-6">
      <View className="items-center justify-center">
        <RafiqLogoMark width={120} height={120} />
      </View>
    </View>
  );
}
