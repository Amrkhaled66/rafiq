import type Ionicons from "@expo/vector-icons/Ionicons";
import type { TranslationKey } from "@/shared/i18n/translations";

export type TabConfig = {
  name: "home" | "my-tasks" | "plans" | "my-lessons" | "profile";
  titleKey: TranslationKey;
  defaultIcon: keyof typeof Ionicons.glyphMap;
  selectedIcon: keyof typeof Ionicons.glyphMap;
};

export const TABS: readonly TabConfig[] = [
  {
    name: "home",
    titleKey: "tabs.home",
    defaultIcon: "home-outline",
    selectedIcon: "home",
  },
  {
    name: "my-tasks",
    titleKey: "tabs.tasks",
    defaultIcon: "file-tray-full-outline",
    selectedIcon: "file-tray-full",
  },
  {
    name: "my-lessons",
    titleKey: "tabs.lessons",
    defaultIcon: "school-outline",
    selectedIcon: "school",
  },
  {
    name: "plans",
    titleKey: "tabs.plans",
    defaultIcon: "calendar-clear-outline",
    selectedIcon: "calendar-clear",
  },

  {
    name: "profile",
    titleKey: "tabs.profile",
    defaultIcon: "person-circle-outline",
    selectedIcon: "person-circle",
  },
] as const;

export function getDirectionalTabs(isRTL: boolean) {
  return isRTL ? [...TABS].reverse() : [...TABS];
}
