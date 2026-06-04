import type { PropsWithChildren } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export function TabPageLayout({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: isTablet ? 16 : 45,
          paddingBottom: insets.bottom + 50,
          paddingHorizontal: isTablet ? 28 : 18,
        }}
      >
        <View className="w-full max-w-260 gap-4 self-center md:gap-5">
          {children}
        </View>
      </ScrollView>
    </View>
  );
}
