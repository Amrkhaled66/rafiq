import type { ReactNode } from "react";
import { View } from "react-native";
import { AppText } from "@/shared/ui/app-text";
import { useDirection } from "@/shared/hooks/use-direction";

export function PlanDaySection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  const dir = useDirection();
  return (
    <View className="gap-2.5">
      <View className={`items-center justify-between ${dir.row}`}>
        <View className="bg-brand-primary-soft rounded-full px-3 py-1">
          <AppText className="text-xs" tone="tint" weight="semibold">
            {count}
          </AppText>
        </View>
        <AppText className="text-lg" weight="bold">
          {title}
        </AppText>
      </View>
      <View className="gap-2.5">{children}</View>
    </View>
  );
}
