import Ionicons from "@expo/vector-icons/Ionicons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDirection } from "@/shared/hooks/use-direction";
import { useI18n } from "@/shared/i18n/I18nProvider";
import type { TabConfig } from "@/shared/navigation/tab-config";
import { AppFonts } from "@/shared/theme/theme";
import { ElevatedView } from "@/shared/ui/elevated-view";

type AndroidTabBarProps = BottomTabBarProps & {
  tabs: readonly TabConfig[];
  tintColor: string;
  labelColor: string;
  backgroundColor: string;
};

export function AndroidTabBar({
  state,
  descriptors,
  navigation,
  tabs,
  tintColor,
  labelColor,
  backgroundColor,
}: AndroidTabBarProps) {
  const insets = useSafeAreaInsets();
  const dir = useDirection();
  const { t, language } = useI18n();
  const currentFont = AppFonts[language];

  return (
    <View
      className="px-4 pt-2"
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
      }}
    >
      {/* <ElevatedView
        className="rounded-[28px]"
        style={{
          backgroundColor,
          paddingHorizontal: 10,
          paddingVertical: 10,
          width: "100%",
        }}
      > */}
      <View className={`items-center justify-between ${dir.row}`}>
        {state.routes.map((route, index) => {
          const tab = tabs.find((item) => item.name === route.name);
          if (!tab) return null;

          const isFocused = state.index === index;
          const color = isFocused ? tintColor : labelColor;
          const descriptor = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={descriptor.options.tabBarAccessibilityLabel}
              testID={descriptor.options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                minHeight: 56,
                borderRadius: 22,
                backgroundColor: "transparent",
              }}
            >
              <Ionicons
                name={isFocused ? tab.selectedIcon : tab.defaultIcon}
                size={22}
                color={color}
              />
              <Text
                style={{
                  color,
                  fontSize: 12,
                  fontFamily: isFocused
                    ? currentFont.bold
                    : currentFont.semibold,
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                {t(tab.titleKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {/* </ElevatedView> */}
    </View>
  );
}
