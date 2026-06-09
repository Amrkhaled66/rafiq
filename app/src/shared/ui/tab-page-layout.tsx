import type { PropsWithChildren } from "react";
import {
  ScrollView,
  type ScrollViewProps,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FocusedStatusBar } from "@/shared/ui/focused-status-bar";

type TabPageLayoutProps = PropsWithChildren<{
  scrollProps?: ScrollViewProps;
}>;

export function TabPageLayout({ children, scrollProps }: TabPageLayoutProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View className="flex-1 bg-background">
      <FocusedStatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 45,
          paddingBottom: insets.bottom + 50,
          paddingHorizontal: isTablet ? 28 : 18,
        }}
        {...scrollProps}
      >
        <View className="w-full max-w-260 gap-4 self-center md:gap-5">
          {children}
        </View>
      </ScrollView>
    </View>
  );
}
