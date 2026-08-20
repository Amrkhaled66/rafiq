import type { ReactNode } from "react";
import { View } from "react-native";
import { AppText } from "@/shared/ui/app-text";

export function PlanDaySection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <View className="gap-2.5">
      <View className="items-center justify-between flex-row">
        <AppText className="text-lg" weight="bold">
          {title}
        </AppText>
        <View className="bg-brand-primary-soft rounded-full px-3 py-1">
          <AppText className="text-xs" tone="tint" weight="semibold">
            {count}
          </AppText>
        </View>
      </View>
      <View className="gap-2.5">{children}</View>
    </View>
  );
}
