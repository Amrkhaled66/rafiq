import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import {
  NativeTabs,
  Icon,
  Label,
  VectorIcon,
} from "expo-router/unstable-native-tabs";

import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useI18n } from "@/shared/i18n/I18nProvider";
import { getDirectionalTabs } from "@/shared/navigation/tab-config";
import { getTabTheme } from "@/shared/navigation/tab-theme";
import { AppFonts } from "@/shared/theme/theme";
import { AndroidTabBar } from "@/shared/ui/android-tab-bar";

export default function TabsLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const { t, isRTL, language } = useI18n();
  const currentFont = AppFonts[language];
  const tabs = getDirectionalTabs(isRTL);
  const tabTheme = getTabTheme(colorScheme, currentFont);

  if (Platform.OS === "ios") {
    return (
      <NativeTabs
        tintColor={tabTheme.tintColor}
        labelStyle={tabTheme.nativeLabelStyle}
        titlePositionAdjustment={tabTheme.nativeTitlePositionAdjustment}
        // selectedTitlePositionAdjustment={tabTheme.nativeTitlePositionAdjustment}
        indicatorColor={tabTheme.indicatorColor}
        backgroundColor={tabTheme.backgroundColor}
      >
        {tabs.map((tab) => (
          <NativeTabs.Trigger key={tab.name} name={tab.name}>
            <Icon
              src={{
                default: (
                  <VectorIcon
                    family={Ionicons}
                    name={tab.defaultIcon}
                    // size={tabTheme.nativeIconSize}
                  />
                ),
                selected: (
                  <VectorIcon
                    family={Ionicons}
                    name={tab.selectedIcon}
                    // size={tabTheme.nativeIconSize}
                  />
                ),
              }}
            />
            <Label>{t(tab.titleKey)}</Label>
          </NativeTabs.Trigger>
        ))}
      </NativeTabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <AndroidTabBar
          {...props}
          tabs={tabs}
          tintColor={tabTheme.tintColor}
          labelColor={tabTheme.labelColor}
          backgroundColor={tabTheme.backgroundColor}
        />
      )}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t(tab.titleKey),
          }}
        />
      ))}
    </Tabs>
  );
}
