import Ionicons from "@expo/vector-icons/Ionicons";
import {
  NativeTabs,
  Icon,
  Label,
  VectorIcon,
} from "expo-router/unstable-native-tabs";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";

const TABS = [
  {
    name: "home",
    titleKey: "tabs.home",
    icon: "home",
  },
  {
    name: "my-tasks",
    titleKey: "tabs.tasks",
    icon: "checkmark-done",
  },
  {
    name: "plans",
    titleKey: "tabs.plans",
    icon: "calendar",
  },
  {
    name: "profile",
    titleKey: "tabs.profile",
    icon: "person",
  },
] as const;

export default function TabsLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const { t } = useI18n();
  const tintColor = colorScheme === "dark" ? "#ffffff" : "#8f0d10";
  const labelColor = colorScheme === "dark" ? "#ffffff" : "#111827";

  return (
    <NativeTabs
      tintColor={tintColor}
      labelStyle={{
        color: labelColor,
        fontSize: 12,
        fontWeight: "600",
      }}
      indicatorColor={
        colorScheme === "dark"
          ? "rgba(255,255,255,0.16)"
          : "rgba(143,13,16,0.14)"
      }
      backgroundColor={
        colorScheme === "dark"
          ? "rgba(35,17,18,1)"
          : "rgba(255,255,255,1)"
      }
    >
      {TABS.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <Icon src={<VectorIcon family={Ionicons} name={tab.icon} />} />
          <Label>{t(tab.titleKey)}</Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
